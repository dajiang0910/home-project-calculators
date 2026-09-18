import type { CalculatorDefinition, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { calculatorCatalogBySlug } from "../catalog";
import { wallpaperContent } from "../../../content/calculators/wallpaper";
import {
  getWallpaperFields,
  isWallpaperUnitSystem,
  wallpaperDefaults,
  wallpaperFieldGroups,
  wallpaperNumericFields,
  wallpaperShoppingList,
  wallpaperUnits,
  type WallpaperInput,
  type WallpaperUnitSystem,
} from "./config";

export type WallpaperResult = {
  unitSystem: WallpaperUnitSystem;
  grossWallArea: number;
  openingArea: number;
  netWallArea: number;
  requiredAreaWithWaste: number;
  adjustedDropLength: number;
  stripsPerRoll: number;
  stripsNeeded: number;
  rollsNeeded: number;
  estimatedCost: number;
  waste: number;
};

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function tolerance(value: number): number {
  return 8 * Number.EPSILON * Math.max(1, Math.abs(value));
}

function ceilCount(value: number): number {
  return Math.max(1, Math.ceil(value - tolerance(value)));
}

function floorCount(value: number): number {
  return Math.floor(value + tolerance(value));
}

function rollPlan(input: WallpaperInput) {
  const units = wallpaperUnits[input.unitSystem];
  const rollWidth = input.rollWidth / units.smallLengthDivisor;
  const patternRepeat = input.patternRepeat / units.smallLengthDivisor;
  const adjustedDropLength = patternRepeat === 0
    ? input.wallHeight
    : ceilCount(input.wallHeight / patternRepeat) * patternRepeat;
  return {
    rollWidth,
    adjustedDropLength,
    stripsPerRoll: floorCount(input.rollLength / adjustedDropLength),
  };
}

function wallAreas(input: WallpaperInput) {
  const grossWallArea = 2 * (input.roomLength + input.roomWidth) * input.wallHeight;
  const openingArea = input.doors * input.doorWidth * input.doorHeight
    + input.windows * input.windowWidth * input.windowHeight;
  return { grossWallArea, openingArea };
}

export function validate(input: unknown): ValidationResult<WallpaperInput> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { form: "Enter your room and wallpaper details to calculate an estimate." } };
  }
  const raw = input as CalculatorFormInput;
  if (!isWallpaperUnitSystem(raw.unitSystem)) {
    return { valid: false, errors: { unitSystem: "Choose US / Imperial or Metric units." } };
  }

  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};
  for (const field of getWallpaperFields(raw.unitSystem)) {
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

  const value = { ...parsed, unitSystem: raw.unitSystem } as WallpaperInput;
  const { grossWallArea, openingArea } = wallAreas(value);
  if (openingArea > grossWallArea) {
    return { valid: false, errors: { doors: "Door and window area exceeds the wall area. Check the room dimensions, opening counts, and opening sizes." } };
  }
  const plan = rollPlan(value);
  if (plan.stripsPerRoll < 1) {
    const unit = wallpaperUnits[value.unitSystem].rollLength;
    return { valid: false, errors: { rollLength: `Roll length must be at least one adjusted drop (${Number(plan.adjustedDropLength.toPrecision(6))} ${unit}).` } };
  }
  return { valid: true, value };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isWallpaperUnitSystem(value) || !isWallpaperUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;

  const converted: Record<string, unknown> = { ...input, unitSystem: value };
  const from = wallpaperUnits[input.unitSystem];
  const to = wallpaperUnits[value];
  for (const field of wallpaperNumericFields) {
    if (!field.quantity) continue;
    const numeric = parseNumber(input[field.name]);
    if (numeric === undefined) continue;
    const factor = `${field.quantity}Factor` as const;
    const next = numeric * (to[factor] / from[factor]);
    if (Number.isFinite(next)) converted[field.name] = Number(next.toFixed(6));
  }
  return converted;
}

export function calculate(input: WallpaperInput): WallpaperResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const { grossWallArea, openingArea } = wallAreas(values);
  const netWallArea = Math.max(0, grossWallArea - openingArea);
  const requiredAreaWithWaste = netWallArea * (1 + values.waste / 100);
  const plan = rollPlan(values);
  const stripCoverage = plan.rollWidth * values.wallHeight;
  const stripsNeeded = requiredAreaWithWaste === 0 ? 0 : ceilCount(requiredAreaWithWaste / stripCoverage);
  const rollsNeeded = stripsNeeded === 0 ? 0 : ceilCount(stripsNeeded / plan.stripsPerRoll);
  return {
    unitSystem: values.unitSystem,
    grossWallArea,
    openingArea,
    netWallArea,
    requiredAreaWithWaste,
    adjustedDropLength: plan.adjustedDropLength,
    stripsPerRoll: plan.stripsPerRoll,
    stripsNeeded,
    rollsNeeded,
    estimatedCost: rollsNeeded * values.pricePerRoll,
    waste: values.waste,
  };
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatResult(result: WallpaperResult): readonly ResultItem[] {
  const units = wallpaperUnits[result.unitSystem];
  return [
    { label: "Rolls Needed", value: `${result.rollsNeeded.toLocaleString("en-US")} ${result.rollsNeeded === 1 ? "roll" : "rolls"}`, detail: `Allows for pattern repeat and ${number.format(result.waste)}% extra waste.`, emphasis: true },
    { label: "Estimated Cost", value: currency.format(result.estimatedCost), detail: "Wallpaper rolls only · before tax and installation supplies", emphasis: true },
    { label: "Full-height Strips", value: `${result.stripsNeeded.toLocaleString("en-US")} ${result.stripsNeeded === 1 ? "strip" : "strips"}`, detail: "Rounded up before rolls are calculated." },
    { label: "Net Wall Area", value: `${number.format(result.netWallArea)} ${units.area}`, detail: "Four walls minus doors and windows." },
    { label: "Adjusted Drop", value: `${number.format(result.adjustedDropLength)} ${units.roomLength}`, detail: "Wall height rounded to the next full pattern repeat." },
    { label: "Strips per Roll", value: `${result.stripsPerRoll.toLocaleString("en-US")} ${result.stripsPerRoll === 1 ? "strip" : "strips"}` },
  ];
}

export const wallpaperCalculator: CalculatorDefinition<WallpaperInput, WallpaperResult> = {
  slug: "wallpaper",
  metadata: calculatorCatalogBySlug.wallpaper.metadata,
  fields: getWallpaperFields("imperial"),
  fieldGroups: wallpaperFieldGroups,
  getFields: (input) => getWallpaperFields(isWallpaperUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput,
  createInitialInput: () => ({ ...wallpaperDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: wallpaperShoppingList,
  resultNote: "Planning estimate for four walls of one rectangular room. Pattern match type, starting position, opening placement, partial-strip reuse, wall irregularities, print batch, labor, delivery, and tax are not modeled. Confirm the physical roll dimensions and repeat on the product label before buying.",
  content: wallpaperContent,
};
