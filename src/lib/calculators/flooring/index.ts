import type { CalculatorEngine, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { ceilWholePurchase } from "../numeric";
import { convertNumericFields, formatCurrency, formatNumber, validateNumericFields } from "../shared";
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
  const { parsed, errors } = validateNumericFields(raw, getFlooringFields(raw.unitSystem));
  if (Object.keys(errors).length) return { valid: false, errors };
  return { valid: true, value: { ...parsed, unitSystem: raw.unitSystem } as FlooringInput };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isFlooringUnitSystem(value) || !isFlooringUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;
  const from = flooringUnits[input.unitSystem as FlooringUnitSystem];
  const to = flooringUnits[value];
  const converted = convertNumericFields(
    input,
    ["roomLength", "roomWidth", "coveragePerBox"].map((name) => ({ name })),
    (numeric, field) => {
      const factor: "areaFactor" | "lengthFactor" = field.name === "coveragePerBox" ? "areaFactor" : "lengthFactor";
      return numeric * (to[factor] / from[factor]);
    },
  );
  converted.unitSystem = value;
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

export function formatResult(result: FlooringResult): readonly ResultItem[] {
  const unit = flooringUnits[result.unitSystem].area;
  return [
    { id: "boxes-needed", label: "Boxes Needed", value: `${result.boxesNeeded.toLocaleString("en-US")} ${result.boxesNeeded === 1 ? "box" : "boxes"}`, detail: "Rounded up to full boxes after waste.", kind: "primary" },
    { id: "estimated-cost", label: "Estimated Cost", value: formatCurrency(result.estimatedCost), detail: "Flooring boxes only · before tax and installation supplies", kind: "cost" },
    { id: "floor-area", label: "Floor Area", value: `${formatNumber(result.floorArea)} ${unit}`, kind: "metric" },
    { id: "required-area-with-waste", label: "Required Area With Waste", value: `${formatNumber(result.requiredAreaWithWaste)} ${unit}`, detail: `Includes ${formatNumber(result.waste)}% waste.`, kind: "metric" },
  ];
}

export const flooringCalculator: CalculatorEngine<FlooringInput, FlooringResult> = {
  slug: "flooring",
  fields: getFlooringFields("imperial"), fieldGroups: flooringFieldGroups,
  getFields: (input) => getFlooringFields(isFlooringUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput, createInitialInput: () => ({ ...flooringDefaults }), validate, calculate, formatResult,
  shoppingList: flooringShoppingList,
  resultNote: "For one rectangular floor. Cost excludes underlayment, transitions, tools, delivery, labor, and tax. Check box coverage and installation requirements before buying.",
};
