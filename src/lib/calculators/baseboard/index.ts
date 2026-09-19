import type { CalculatorEngine, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { ceilWholePurchase, multiplyCurrency, parseFiniteNumber } from "../numeric";
import { formatCurrency, formatNumber } from "../shared";
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
  for (const field of getBaseboardFields(raw.unitSystem, raw)) {
    if (field.type !== "number") continue;
    const value = parseFiniteNumber(raw[field.name]);
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

  const value = { ...baseboardDefaults, ...parsed, unitSystem: raw.unitSystem } as BaseboardInput;
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
    const numeric = parseFiniteNumber(input[field.name]);
    if (numeric === undefined) continue;
    const next = numeric * (to.lengthFactor / from.lengthFactor);
    if (Number.isFinite(next)) converted[field.name] = Number(next.toFixed(6));
  }
  return converted;
}

export function calculate(input: BaseboardInput): BaseboardResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const perimeter = roomPerimeter(values);
  const openingLength = values.doors * values.doorWidth;
  const netWallRun = Math.max(0, perimeter - openingLength);
  const requiredLengthWithWaste = netWallRun * (1 + values.waste / 100);
  const piecesNeeded = ceilWholePurchase(requiredLengthWithWaste / values.boardLength);
  return {
    unitSystem: values.unitSystem,
    roomPerimeter: perimeter,
    openingLength,
    netWallRun,
    requiredLengthWithWaste,
    boardLength: values.boardLength,
    piecesNeeded,
    estimatedCost: multiplyCurrency(piecesNeeded, values.pricePerBoard),
    waste: values.waste,
  };
}

export function formatResult(result: BaseboardResult): readonly ResultItem[] {
  const unit = baseboardUnits[result.unitSystem].length;
  return [
    { id: "pieces-needed", label: "Pieces Needed", value: `${result.piecesNeeded.toLocaleString("en-US")} ${result.piecesNeeded === 1 ? "piece" : "pieces"}`, detail: "Rounded up to full baseboard pieces after waste.", kind: "primary" },
    { id: "estimated-cost", label: "Estimated Cost", value: formatCurrency(result.estimatedCost), detail: "Baseboard pieces only · before tax and installation supplies", kind: "cost" },
    { id: "baseboard-needed", label: "Baseboard Needed", value: `${formatNumber(result.requiredLengthWithWaste)} ${unit}`, detail: `Includes ${formatNumber(result.waste)}% waste for cuts and joins.`, kind: "metric" },
    { id: "net-wall-run", label: "Net Wall Run", value: `${formatNumber(result.netWallRun)} ${unit}`, detail: "Room perimeter minus door openings.", kind: "metric" },
    { id: "room-perimeter", label: "Room Perimeter", value: `${formatNumber(result.roomPerimeter)} ${unit}`, kind: "metric" },
    { id: "length-per-piece", label: "Length per Piece", value: `${formatNumber(result.boardLength)} ${unit}`, kind: "metric" },
  ];
}

export const baseboardCalculator: CalculatorEngine<BaseboardInput, BaseboardResult> = {
  slug: "baseboard",
  fields: getBaseboardFields("imperial"),
  fieldGroups: baseboardFieldGroups,
  getFields: (input) => getBaseboardFields(isBaseboardUnitSystem(input.unitSystem) ? input.unitSystem : "imperial", input),
  updateInput,
  createInitialInput: () => ({ ...baseboardDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: baseboardShoppingList,
  resultNote: "For one rectangular room with a continuous baseboard run. Door casings, closets, stair runs, floor transitions, irregular wall segments, exact miter/coping layouts, labor, delivery, and tax are not modeled.",
};
