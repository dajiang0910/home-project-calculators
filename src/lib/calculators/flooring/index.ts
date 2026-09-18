import type { CalculatorDefinition, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { calculatorCatalogBySlug } from "../catalog";
import { ceilWholePurchase, parseFiniteNumber } from "../numeric";
import { flooringContent } from "../../../content/calculators/flooring";
import { flooringDefaults, flooringFieldGroups, flooringShoppingList, flooringUnits, getFlooringFields, isFlooringUnitSystem, type FlooringInput, type FlooringUnitSystem } from "./config";

export type FlooringResult = {
  unitSystem: FlooringUnitSystem;
  floorArea: number;
  requiredAreaWithWaste: number;
  boxesNeeded: number;
  estimatedCost: number;
  waste: number;
};

export function validate(input: unknown): ValidationResult<FlooringInput> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { form: "Enter your room measurements to calculate an estimate." } };
  }
  const raw = input as CalculatorFormInput;
  if (!isFlooringUnitSystem(raw.unitSystem)) {
    return { valid: false, errors: { unitSystem: "Choose US / Imperial or Metric units." } };
  }
  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};
  for (const field of getFlooringFields(raw.unitSystem)) {
    if (field.type !== "number") continue;
    const value = parseFiniteNumber(raw[field.name]);
    if (value === undefined) {
      errors[field.name] = `Enter a valid number for ${field.label.toLowerCase()}.`;
    } else if (field.min !== undefined && value < field.min) {
      errors[field.name] = `${field.label} must be at least ${field.min}${field.unit ? ` ${field.unit}` : ""}.`;
    } else if (field.max !== undefined && value > field.max) {
      errors[field.name] = `${field.label} must be ${field.max}${field.unit ? ` ${field.unit}` : ""} or less.`;
    } else {
      parsed[field.name] = value === 0 ? 0 : value;
    }
  }
  if (Object.keys(errors).length) return { valid: false, errors };
  return { valid: true, value: { ...parsed, unitSystem: raw.unitSystem } as FlooringInput };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isFlooringUnitSystem(value) || !isFlooringUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;
  const converted: Record<string, unknown> = { ...input, unitSystem: value };
  const from = flooringUnits[input.unitSystem];
  const to = flooringUnits[value];
  for (const name of ["roomLength", "roomWidth", "coveragePerBox"] as const) {
    const numeric = parseFiniteNumber(input[name]);
    if (numeric === undefined) continue;
    const factor = name === "coveragePerBox" ? "areaFactor" : "lengthFactor";
    const next = numeric * (to[factor] / from[factor]);
    if (Number.isFinite(next)) converted[name] = next;
  }
  return converted;
}

export function calculate(input: FlooringInput): FlooringResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const floorArea = values.roomLength * values.roomWidth;
  const requiredAreaWithWaste = floorArea * (1 + values.waste / 100);
  const boxesNeeded = ceilWholePurchase(requiredAreaWithWaste / values.coveragePerBox);
  return {
    unitSystem: values.unitSystem, floorArea, requiredAreaWithWaste, boxesNeeded,
    estimatedCost: boxesNeeded * values.pricePerBox, waste: values.waste,
  };
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatResult(result: FlooringResult): readonly ResultItem[] {
  const unit = flooringUnits[result.unitSystem].area;
  return [
    { label: "Boxes Needed", value: `${result.boxesNeeded.toLocaleString("en-US")} ${result.boxesNeeded === 1 ? "box" : "boxes"}`, detail: "Rounded up to full boxes after waste.", emphasis: true },
    { label: "Estimated Cost", value: currency.format(result.estimatedCost), detail: "Flooring boxes only · before tax and installation supplies", emphasis: true },
    { label: "Floor Area", value: `${number.format(result.floorArea)} ${unit}` },
    { label: "Required Area With Waste", value: `${number.format(result.requiredAreaWithWaste)} ${unit}`, detail: `Includes ${number.format(result.waste)}% waste.` },
  ];
}

export const flooringCalculator: CalculatorDefinition<FlooringInput, FlooringResult> = {
  slug: "flooring",
  metadata: calculatorCatalogBySlug.flooring.metadata,
  fields: getFlooringFields("imperial"), fieldGroups: flooringFieldGroups,
  getFields: (input) => getFlooringFields(isFlooringUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput, createInitialInput: () => ({ ...flooringDefaults }), validate, calculate, formatResult,
  shoppingList: flooringShoppingList,
  resultNote: "For one rectangular floor. Cost excludes underlayment, transitions, tools, delivery, labor, and tax. Check box coverage and installation requirements before buying.",
  content: flooringContent,
};
