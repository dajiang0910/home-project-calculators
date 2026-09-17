import type { CalculatorDefinition, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { ceilingPaintContent } from "../../../content/calculators/ceiling-paint";
import {
  ceilingPaintDefaults,
  ceilingPaintFieldGroups,
  ceilingPaintNumericFields,
  ceilingPaintShoppingList,
  ceilingPaintUnits,
  convertCeilingPaintValue,
  getCeilingPaintFields,
  isCeilingPaintUnitSystem,
  type CeilingPaintInput,
  type CeilingPaintUnitSystem,
} from "./config";

export type CeilingPaintResult = {
  unitSystem: CeilingPaintUnitSystem;
  ceilingArea: number;
  totalCoverageArea: number;
  paintNeeded: number;
  recommendedPurchase: number;
  estimatedCost: number;
  coverage: number;
  coats: number;
  waste: number;
};

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function validate(input: unknown): ValidationResult<CeilingPaintInput> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { form: "Enter your ceiling and paint details to calculate an estimate." } };
  }
  const raw = input as CalculatorFormInput;
  if (!isCeilingPaintUnitSystem(raw.unitSystem)) {
    return { valid: false, errors: { unitSystem: "Choose US / Imperial or Metric units." } };
  }

  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};
  for (const field of getCeilingPaintFields(raw.unitSystem)) {
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
  return { valid: true, value: { ...parsed, unitSystem: raw.unitSystem } as CeilingPaintInput };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isCeilingPaintUnitSystem(value) || !isCeilingPaintUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;

  const converted: Record<string, unknown> = { ...input, unitSystem: value };
  for (const field of ceilingPaintNumericFields) {
    if (!field.quantity) continue;
    const numeric = parseNumber(input[field.name]);
    if (numeric === undefined) continue;
    const next = convertCeilingPaintValue(numeric, field.quantity, input.unitSystem, value);
    if (Number.isFinite(next)) {
      converted[field.name] = Number(next.toFixed(field.quantity === "length" ? 4 : 6));
    }
  }
  return converted;
}

function roundPurchase(value: number): number {
  const tolerance = 8 * Number.EPSILON * Math.max(1, value);
  return value === 0 ? 0 : Math.max(1, Math.ceil(value - tolerance));
}

export function calculate(input: CeilingPaintInput): CeilingPaintResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const ceilingArea = values.roomLength * values.roomWidth;
  const totalCoverageArea = ceilingArea * values.coats;
  const paintNeeded = totalCoverageArea / values.coverage * (1 + values.waste / 100);
  const recommendedPurchase = roundPurchase(paintNeeded / ceilingPaintUnits[values.unitSystem].purchaseIncrement)
    * ceilingPaintUnits[values.unitSystem].purchaseIncrement;
  return {
    unitSystem: values.unitSystem,
    ceilingArea,
    totalCoverageArea,
    paintNeeded,
    recommendedPurchase,
    estimatedCost: recommendedPurchase * values.pricePerUnit,
    coverage: values.coverage,
    coats: values.coats,
    waste: values.waste,
  };
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatResult(result: CeilingPaintResult): readonly ResultItem[] {
  const units = ceilingPaintUnits[result.unitSystem];
  return [
    { label: "Recommended Purchase", value: `${number.format(result.recommendedPurchase)} ${units.volume}`, detail: `Rounded up to whole ${result.unitSystem === "metric" ? "liters" : "US gallons"}.`, emphasis: true },
    { label: "Estimated Material Cost", value: currency.format(result.estimatedCost), detail: "Ceiling paint only · before tax and supplies", emphasis: true },
    { label: "Paint Needed", value: `${number.format(result.paintNeeded)} ${units.volume}`, detail: `Includes ${number.format(result.waste)}% waste across ${result.coats} ${result.coats === 1 ? "coat" : "coats"}.` },
    { label: "Ceiling Area", value: `${number.format(result.ceilingArea)} ${units.area}` },
    { label: "Total Coverage", value: `${number.format(result.totalCoverageArea)} ${units.area}`, detail: `Ceiling area multiplied by ${result.coats} ${result.coats === 1 ? "coat" : "coats"}.` },
    { label: "Paint Coverage", value: `${number.format(result.coverage)} ${units.coverage}`, detail: "Coverage for one coat from the entered paint label." },
  ];
}

export const ceilingPaintCalculator: CalculatorDefinition<CeilingPaintInput, CeilingPaintResult> = {
  slug: "ceiling-paint",
  metadata: {
    title: "Ceiling Paint Calculator",
    seoTitle: "Ceiling Paint Calculator: How Much Paint Do I Need?",
    description: "Estimate ceiling paint for a rectangular room. Account for coats, paint coverage, overhead waste, unit conversions, and the cost of whole gallons or liters.",
    category: "painting",
    keywords: ["ceiling paint calculator", "ceiling paint coverage", "how much paint for a ceiling", "ceiling paint cost calculator"],
  },
  fields: getCeilingPaintFields("imperial"),
  fieldGroups: ceilingPaintFieldGroups,
  getFields: (input) => getCeilingPaintFields(isCeilingPaintUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput,
  createInitialInput: () => ({ ...ceilingPaintDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: ceilingPaintShoppingList,
  resultNote: "For one rectangular ceiling only. Walls, trim, crown molding, skylights, fixtures, primer, labor, delivery, and tax are excluded. Use the waste allowance for texture, cut-in work, roller loss, and overhead conditions.",
  content: ceilingPaintContent,
};
