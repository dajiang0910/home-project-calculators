import type { CalculatorDefinition, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { paintContent } from "../../../content/calculators/paint";
import { getPaintFields, paintDefaults, paintFieldGroups, paintNumericFields, paintShoppingList, type PaintInput } from "./config";
import { convertPaintValue, isPaintUnitSystem, paintUnits, unitFactor, type PaintUnitSystem } from "./units";

export type PaintResult = {
  unitSystem: PaintUnitSystem;
  wallArea: number;
  doorArea: number;
  windowArea: number;
  paintableArea: number;
  totalCoverageArea: number;
  baseGallons: number;
  paintGallons: number;
  paintNeeded: number;
  recommendedPurchase: number;
  estimatedCost: number;
  waste: number;
};

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function areas(input: PaintInput) {
  const factor = paintUnits[input.unitSystem].lengthFactor;
  return {
    wallArea: 2 * (input.roomLength / factor + input.roomWidth / factor) * (input.wallHeight / factor),
    doorArea: input.doors * (input.doorWidth / factor) * (input.doorHeight / factor),
    windowArea: input.windows * (input.windowWidth / factor) * (input.windowHeight / factor),
  };
}

export function validate(input: unknown): ValidationResult<PaintInput> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { form: "Enter your room measurements to calculate an estimate." } };
  }
  const raw = input as CalculatorFormInput;
  if (!isPaintUnitSystem(raw.unitSystem)) {
    return { valid: false, errors: { unitSystem: "Choose US / Imperial or Metric units." } };
  }
  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};
  const fields = getPaintFields(raw.unitSystem);
  for (const field of fields) {
    if (field.type !== "number") continue;
    const value = parseNumber(raw[field.name]);
    if (value === undefined) {
      errors[field.name] = `Enter a valid number for ${field.label.toLowerCase()}.`;
    } else if (field.min !== undefined && value < field.min) {
      errors[field.name] = field.min === 0
        ? `${field.label} cannot be negative.`
        : `${field.label} must be greater than zero (minimum ${Number(field.min.toPrecision(6))}${field.unit ? ` ${field.unit}` : ""}).`;
    } else if (field.max !== undefined && value > field.max) {
      errors[field.name] = `${field.label} must be ${Number(field.max.toPrecision(6))}${field.unit ? ` ${field.unit}` : ""} or less.`;
    } else if (field.step === 1 && !Number.isInteger(value)) {
      errors[field.name] = `Enter a whole number for ${field.label.toLowerCase()}.`;
    } else {
      parsed[field.name] = value === 0 ? 0 : value;
    }
  }
  if (Object.keys(errors).length) return { valid: false, errors };

  // Every numeric key has been parsed and checked against its configuration above.
  const value = { ...parsed, unitSystem: raw.unitSystem } as PaintInput;
  const { wallArea, doorArea, windowArea } = areas(value);
  if (doorArea + windowArea > wallArea) {
    return { valid: false, errors: { doors: "Door and window area exceeds the wall area. Check the room dimensions, opening counts, and opening sizes." } };
  }
  return { valid: true, value };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isPaintUnitSystem(value) || !isPaintUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;
  const converted: Record<string, unknown> = { ...input, unitSystem: value };
  for (const field of paintNumericFields) {
    if (!field.quantity) continue;
    const numeric = parseNumber(input[field.name]);
    if (numeric !== undefined) {
      const next = convertPaintValue(numeric, field.quantity, input.unitSystem, value);
      const decimalPlaces = field.quantity === "length" ? 4 : 6;
      converted[field.name] = Number.isFinite(next)
        ? Number(next.toFixed(decimalPlaces))
        : input[field.name];
    }
  }
  return converted;
}

export function calculate(input: PaintInput): PaintResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const { wallArea, doorArea, windowArea } = areas(values);
  const paintableArea = Math.max(0, wallArea - (doorArea + windowArea));
  const totalCoverageArea = paintableArea * values.coats;
  const baseGallons = totalCoverageArea / (values.coverage / unitFactor(values.unitSystem, "coverage"));
  const paintGallons = baseGallons * (1 + values.waste / 100);
  const units = paintUnits[values.unitSystem];
  const paintNeeded = paintGallons * units.volumeFactor;
  const packages = paintNeeded / units.purchaseIncrement;
  const tolerance = 1e-6;
  const recommendedPurchase = packages === 0 ? 0 : Math.max(1, Math.ceil(packages - tolerance)) * units.purchaseIncrement;
  return {
    unitSystem: values.unitSystem, wallArea, doorArea, windowArea, paintableArea,
    totalCoverageArea, baseGallons, paintGallons, paintNeeded, recommendedPurchase,
    estimatedCost: recommendedPurchase * values.pricePerUnit, waste: values.waste,
  };
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatResult(result: PaintResult): readonly ResultItem[] {
  const units = paintUnits[result.unitSystem];
  const area = (value: number) => `${number.format(value * units.areaFactor)} ${units.area}`;
  return [
    { label: "Recommended Purchase", value: `${number.format(result.recommendedPurchase)} ${units.volume}`, detail: `Rounded up to whole ${result.unitSystem === "metric" ? "liters" : "US gallons"}.`, emphasis: true },
    { label: "Estimated Material Cost", value: currency.format(result.estimatedCost), detail: "Paint only · before tax and supplies", emphasis: true },
    { label: "Paint Needed", value: `${number.format(result.paintNeeded)} ${units.volume}`, detail: `Includes ${number.format(result.waste)}% waste; before purchase rounding.` },
    { label: "Paintable Area", value: area(result.paintableArea), detail: "Walls minus doors and windows, for one coat." },
    { label: "Wall Area", value: area(result.wallArea) },
    { label: "Door Area", value: area(result.doorArea), detail: "Deducted from the walls." },
    { label: "Window Area", value: area(result.windowArea), detail: "Deducted from the walls." },
  ];
}

export const paintCalculator: CalculatorDefinition<PaintInput, PaintResult> = {
  slug: "paint",
  metadata: {
    title: "Paint Calculator",
    seoTitle: "Paint Calculator: How Much Paint Do I Need?",
    description: "Estimate paint for your room in gallons or liters. Account for doors, windows, coats, and waste, then see how much to buy and the estimated paint cost.",
    category: "painting",
    keywords: ["paint calculator", "paint coverage calculator", "how much paint do I need", "room paint calculator"],
  },
  fields: getPaintFields("imperial"),
  fieldGroups: paintFieldGroups,
  getFields: (input) => getPaintFields(isPaintUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput,
  createInitialInput: () => ({ ...paintDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: paintShoppingList,
  resultNote: "For four walls only. Ceiling, trim, primer, tools, labor, and tax are excluded from the paint estimate. Check your paint label and local can sizes before buying.",
  content: paintContent,
};
