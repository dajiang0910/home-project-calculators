import type { CalculatorEngine, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { ceilWholePurchase, floorWholeCapacity, multiplyCurrency, parseFiniteNumber } from "../numeric";
import { formatCurrency, formatNumber } from "../shared";
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

function rollPlan(input: WallpaperInput) {
  const units = wallpaperUnits[input.unitSystem];
  const rollWidth = input.rollWidth / units.smallLengthDivisor;
  const patternRepeat = input.patternRepeat / units.smallLengthDivisor;
  const adjustedDropLength = patternRepeat === 0
    ? input.wallHeight
    : ceilWholePurchase(input.wallHeight / patternRepeat) * patternRepeat;
  return {
    rollWidth,
    adjustedDropLength,
    stripsPerRoll: floorWholeCapacity(input.rollLength / adjustedDropLength),
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
  for (const field of getWallpaperFields(raw.unitSystem, raw)) {
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

  const value = { ...wallpaperDefaults, ...parsed, unitSystem: raw.unitSystem } as WallpaperInput;
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
    const numeric = parseFiniteNumber(input[field.name]);
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
  const stripsNeeded = ceilWholePurchase(requiredAreaWithWaste / stripCoverage);
  const rollsNeeded = ceilWholePurchase(stripsNeeded / plan.stripsPerRoll);
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
    estimatedCost: multiplyCurrency(rollsNeeded, values.pricePerRoll),
    waste: values.waste,
  };
}

export function formatResult(result: WallpaperResult): readonly ResultItem[] {
  const units = wallpaperUnits[result.unitSystem];
  return [
    { id: "rolls-needed", label: "Rolls Needed", value: `${result.rollsNeeded.toLocaleString("en-US")} ${result.rollsNeeded === 1 ? "roll" : "rolls"}`, detail: `Allows for pattern repeat and ${formatNumber(result.waste)}% extra waste.`, kind: "primary" },
    { id: "estimated-cost", label: "Estimated Cost", value: formatCurrency(result.estimatedCost), detail: "Wallpaper rolls only · before tax and installation supplies", kind: "cost" },
    { id: "strips-needed", label: "Area-based Strip Estimate", value: `${result.stripsNeeded.toLocaleString("en-US")} ${result.stripsNeeded === 1 ? "strip" : "strips"}`, detail: "Opening area is treated as reusable material; actual strip reuse depends on opening placement and layout.", kind: "metric" },
    { id: "net-wall-area", label: "Net Wall Area", value: `${formatNumber(result.netWallArea)} ${units.area}`, detail: "Four walls minus doors and windows.", kind: "metric" },
    { id: "adjusted-drop", label: "Adjusted Drop", value: `${formatNumber(result.adjustedDropLength)} ${units.roomLength}`, detail: "Wall height rounded to the next full pattern repeat.", kind: "metric" },
    { id: "strips-per-roll", label: "Strips per Roll", value: `${result.stripsPerRoll.toLocaleString("en-US")} ${result.stripsPerRoll === 1 ? "strip" : "strips"}`, kind: "metric" },
  ];
}

export const wallpaperCalculator: CalculatorEngine<WallpaperInput, WallpaperResult> = {
  slug: "wallpaper",
  fields: getWallpaperFields("imperial"),
  fieldGroups: wallpaperFieldGroups,
  getFields: (input) => getWallpaperFields(isWallpaperUnitSystem(input.unitSystem) ? input.unitSystem : "imperial", input),
  updateInput,
  createInitialInput: () => ({ ...wallpaperDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: wallpaperShoppingList,
  resultNote: "Area-based planning estimate for four walls of one rectangular room. Deducted opening area may not translate into reusable full-width strips, so order conservatively when opening placement or pattern matching limits offcut reuse. Starting position, wall irregularities, print batch, labor, delivery, and tax are not modeled. Confirm the physical roll dimensions and repeat on the product label before buying.",
};
