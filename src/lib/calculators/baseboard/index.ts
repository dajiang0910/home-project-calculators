import type { CalculatorDefinition, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { calculatorCatalogBySlug } from "../catalog";
import { baseboardContent } from "../../../content/calculators/baseboard";
import {
  baseboardDefaults,
  baseboardFieldGroups,
  baseboardNumericFields,
  baseboardShoppingList,
  baseboardUnits,
  getBaseboardFields,
  isBaseboardUnitSystem,
  type BaseboardInput,
  type BaseboardUnitSystem,
} from "./config";

export type BaseboardResult = {
  unitSystem: BaseboardUnitSystem;
  roomPerimeter: number;
  openingLength: number;
  netWallRun: number;
  requiredLengthWithWaste: number;
  boardLength: number;
  piecesNeeded: number;
  estimatedCost: number;
  waste: number;
};

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function roomPerimeter(input: BaseboardInput): number {
  return 2 * (input.roomLength + input.roomWidth);
}

export function validate(input: unknown): ValidationResult<BaseboardInput> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { form: "Enter your room and baseboard details to calculate an estimate." } };
  }
  const raw = input as CalculatorFormInput;
  if (!isBaseboardUnitSystem(raw.unitSystem)) {
    return { valid: false, errors: { unitSystem: "Choose US / Imperial or Metric units." } };
  }

  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};
  for (const field of getBaseboardFields(raw.unitSystem)) {
    if (field.type !== "number") continue;
    const value = parseNumber(raw[field.name]);
    if (value === undefined) {
      errors[field.name] = `Enter a valid number for ${field.label.toLowerCase()}.`;
    } else if (field.min !== undefined && value < field.min) {
      errors[field.name] = field.min === 0
        ? `${field.label} cannot be negative.`
        : `${field.label} must be at least ${Number(field.min.toPrecision(6))}${field.unit ? ` ${field.unit}` : ""}.`;
    } else if (field.max !== undefined && value > field.max) {
      errors[field.name] = `${field.label} must be ${Number(field.max.toPrecision(6))}${field.unit ? ` ${field.unit}` : ""} or less.`;
    } else if (field.step === 1 && !Number.isInteger(value)) {
      errors[field.name] = `Enter a whole number for ${field.label.toLowerCase()}.`;
    } else {
      parsed[field.name] = value === 0 ? 0 : value;
    }
  }
  if (Object.keys(errors).length) return { valid: false, errors };

  const value = { ...parsed, unitSystem: raw.unitSystem } as BaseboardInput;
  const openingLength = value.doors * value.doorWidth;
  if (openingLength > roomPerimeter(value)) {
    return { valid: false, errors: { doors: "Door opening width exceeds the room perimeter. Check the room dimensions, door count, and opening width." } };
  }
  return { valid: true, value };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isBaseboardUnitSystem(value) || !isBaseboardUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;

  const converted: Record<string, unknown> = { ...input, unitSystem: value };
  const from = baseboardUnits[input.unitSystem];
  const to = baseboardUnits[value];
  for (const field of baseboardNumericFields) {
    if (!field.length) continue;
    const numeric = parseNumber(input[field.name]);
    if (numeric === undefined) continue;
    const next = numeric * (to.lengthFactor / from.lengthFactor);
    if (Number.isFinite(next)) converted[field.name] = Number(next.toFixed(6));
  }
  return converted;
}

function roundPieces(value: number): number {
  const tolerance = 8 * Number.EPSILON * Math.max(1, value);
  return value === 0 ? 0 : Math.max(1, Math.ceil(value - tolerance));
}

export function calculate(input: BaseboardInput): BaseboardResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const perimeter = roomPerimeter(values);
  const openingLength = values.doors * values.doorWidth;
  const netWallRun = Math.max(0, perimeter - openingLength);
  const requiredLengthWithWaste = netWallRun * (1 + values.waste / 100);
  const piecesNeeded = roundPieces(requiredLengthWithWaste / values.boardLength);
  return {
    unitSystem: values.unitSystem,
    roomPerimeter: perimeter,
    openingLength,
    netWallRun,
    requiredLengthWithWaste,
    boardLength: values.boardLength,
    piecesNeeded,
    estimatedCost: piecesNeeded * values.pricePerBoard,
    waste: values.waste,
  };
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatResult(result: BaseboardResult): readonly ResultItem[] {
  const unit = baseboardUnits[result.unitSystem].length;
  return [
    { label: "Pieces Needed", value: `${result.piecesNeeded.toLocaleString("en-US")} ${result.piecesNeeded === 1 ? "piece" : "pieces"}`, detail: "Rounded up to full baseboard pieces after waste.", emphasis: true },
    { label: "Estimated Cost", value: currency.format(result.estimatedCost), detail: "Baseboard pieces only · before tax and installation supplies", emphasis: true },
    { label: "Baseboard Needed", value: `${number.format(result.requiredLengthWithWaste)} ${unit}`, detail: `Includes ${number.format(result.waste)}% waste for cuts and joins.` },
    { label: "Net Wall Run", value: `${number.format(result.netWallRun)} ${unit}`, detail: "Room perimeter minus door openings." },
    { label: "Room Perimeter", value: `${number.format(result.roomPerimeter)} ${unit}` },
    { label: "Length per Piece", value: `${number.format(result.boardLength)} ${unit}` },
  ];
}

export const baseboardCalculator: CalculatorDefinition<BaseboardInput, BaseboardResult> = {
  slug: "baseboard",
  metadata: calculatorCatalogBySlug.baseboard.metadata,
  fields: getBaseboardFields("imperial"),
  fieldGroups: baseboardFieldGroups,
  getFields: (input) => getBaseboardFields(isBaseboardUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput,
  createInitialInput: () => ({ ...baseboardDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: baseboardShoppingList,
  resultNote: "For one rectangular room with a continuous baseboard run. Door casings, closets, stair runs, floor transitions, irregular wall segments, exact miter/coping layouts, labor, delivery, and tax are not modeled.",
  content: baseboardContent,
};
