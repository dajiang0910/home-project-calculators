import type { CalculatorEngine, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { ceilWholePurchase, parseFiniteNumber } from "../numeric";
import { formatCurrency, formatNumber } from "../shared";
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
    const numeric = parseFiniteNumber(input[field.name]);
    if (numeric === undefined) continue;
    const next = convertCeilingPaintValue(numeric, field.quantity, input.unitSystem, value);
    if (Number.isFinite(next)) {
      converted[field.name] = Number(next.toFixed(field.quantity === "length" ? 4 : 6));
    }
  }
  return converted;
}

export function calculate(input: CeilingPaintInput): CeilingPaintResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const ceilingArea = values.roomLength * values.roomWidth;
  const totalCoverageArea = ceilingArea * values.coats;
  const paintNeeded = totalCoverageArea / values.coverage * (1 + values.waste / 100);
  const recommendedPurchase = ceilWholePurchase(paintNeeded / ceilingPaintUnits[values.unitSystem].purchaseIncrement)
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

export function formatResult(result: CeilingPaintResult): readonly ResultItem[] {
  const units = ceilingPaintUnits[result.unitSystem];
  return [
    { id: "recommended-purchase", label: "Recommended Purchase", value: `${formatNumber(result.recommendedPurchase)} ${units.volume}`, detail: `Rounded up to whole ${result.unitSystem === "metric" ? "liters" : "US gallons"}.`, kind: "primary" },
    { id: "estimated-material-cost", label: "Estimated Material Cost", value: formatCurrency(result.estimatedCost), detail: "Ceiling paint only · before tax and supplies", kind: "cost" },
    { id: "paint-needed", label: "Paint Needed", value: `${formatNumber(result.paintNeeded)} ${units.volume}`, detail: `Includes ${formatNumber(result.waste)}% waste across ${result.coats} ${result.coats === 1 ? "coat" : "coats"}.`, kind: "metric" },
    { id: "ceiling-area", label: "Ceiling Area", value: `${formatNumber(result.ceilingArea)} ${units.area}`, kind: "metric" },
    { id: "total-coverage", label: "Total Coverage", value: `${formatNumber(result.totalCoverageArea)} ${units.area}`, detail: `Ceiling area multiplied by ${result.coats} ${result.coats === 1 ? "coat" : "coats"}.`, kind: "metric" },
    { id: "paint-coverage", label: "Paint Coverage", value: `${formatNumber(result.coverage)} ${units.coverage}`, detail: "Coverage for one coat from the entered paint label.", kind: "metric" },
  ];
}

export const ceilingPaintCalculator: CalculatorEngine<CeilingPaintInput, CeilingPaintResult> = {
  slug: "ceiling-paint",
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
};
