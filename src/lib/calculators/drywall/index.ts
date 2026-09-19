import type { CalculatorEngine, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { ceilWholePurchase, multiplyCurrency, parseFiniteNumber } from "../numeric";
import { formatCurrency, formatNumber } from "../shared";
import {
  drywallDefaults,
  drywallFieldGroups,
  drywallNumericFields,
  drywallShoppingList,
  drywallUnits,
  getDrywallFields,
  isDrywallProjectType,
  isDrywallUnitSystem,
  type DrywallInput,
  type DrywallProjectType,
  type DrywallUnitSystem,
} from "./config";

export type DrywallResult = {
  unitSystem: DrywallUnitSystem;
  projectType: DrywallProjectType;
  grossWallArea: number;
  openingArea: number;
  netWallArea: number;
  ceilingArea: number;
  drywallArea: number;
  requiredAreaWithWaste: number;
  sheetArea: number;
  sheetsNeeded: number;
  estimatedCost: number;
  waste: number;
};

function includesWalls(projectType: DrywallProjectType): boolean {
  return projectType === "walls" || projectType === "walls-ceiling";
}

function includesCeiling(projectType: DrywallProjectType): boolean {
  return projectType === "ceiling" || projectType === "walls-ceiling";
}

function wallAndOpeningAreas(input: DrywallInput) {
  const grossWallArea = 2 * (input.roomLength + input.roomWidth) * input.wallHeight;
  const openingArea = input.doors * input.doorWidth * input.doorHeight
    + input.windows * input.windowWidth * input.windowHeight;
  return { grossWallArea, openingArea };
}

export function validate(input: unknown): ValidationResult<DrywallInput> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { form: "Enter your room and drywall details to calculate an estimate." } };
  }
  const raw = input as CalculatorFormInput;
  if (!isDrywallUnitSystem(raw.unitSystem)) {
    return { valid: false, errors: { unitSystem: "Choose US / Imperial or Metric units." } };
  }
  if (!isDrywallProjectType(raw.projectType)) {
    return { valid: false, errors: { projectType: "Choose whether to cover walls, the ceiling, or both." } };
  }

  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};
  for (const field of getDrywallFields(raw.unitSystem, raw)) {
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

  const value = { ...drywallDefaults, ...parsed, unitSystem: raw.unitSystem, projectType: raw.projectType } as DrywallInput;
  if (includesWalls(value.projectType)) {
    const { grossWallArea, openingArea } = wallAndOpeningAreas(value);
    if (openingArea > grossWallArea) {
      return { valid: false, errors: { doors: "Door and window area exceeds the wall area. Check the room dimensions, opening counts, and opening sizes." } };
    }
  }
  return { valid: true, value };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isDrywallUnitSystem(value) || !isDrywallUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;

  const converted: Record<string, unknown> = { ...input, unitSystem: value };
  const factor = drywallUnits[value].lengthFactor / drywallUnits[input.unitSystem].lengthFactor;
  for (const field of drywallNumericFields) {
    if (!field.length) continue;
    const numeric = parseFiniteNumber(input[field.name]);
    if (numeric === undefined) continue;
    const next = numeric * factor;
    if (Number.isFinite(next)) converted[field.name] = Number(next.toFixed(6));
  }
  return converted;
}

export function calculate(input: DrywallInput): DrywallResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const wallAreas = wallAndOpeningAreas(values);
  const grossWallArea = includesWalls(values.projectType) ? wallAreas.grossWallArea : 0;
  const openingArea = includesWalls(values.projectType) ? wallAreas.openingArea : 0;
  const netWallArea = Math.max(0, grossWallArea - openingArea);
  const ceilingArea = includesCeiling(values.projectType) ? values.roomLength * values.roomWidth : 0;
  const drywallArea = netWallArea + ceilingArea;
  const requiredAreaWithWaste = drywallArea * (1 + values.waste / 100);
  const sheetArea = values.sheetLength * values.sheetWidth;
  const sheetsNeeded = ceilWholePurchase(requiredAreaWithWaste / sheetArea);
  return {
    unitSystem: values.unitSystem,
    projectType: values.projectType,
    grossWallArea,
    openingArea,
    netWallArea,
    ceilingArea,
    drywallArea,
    requiredAreaWithWaste,
    sheetArea,
    sheetsNeeded,
    estimatedCost: multiplyCurrency(sheetsNeeded, values.pricePerSheet),
    waste: values.waste,
  };
}

export function formatResult(result: DrywallResult): readonly ResultItem[] {
  const unit = drywallUnits[result.unitSystem].area;
  return [
    { id: "sheets-needed", label: "Sheets Needed", value: `${result.sheetsNeeded.toLocaleString("en-US")} ${result.sheetsNeeded === 1 ? "sheet" : "sheets"}`, detail: "Rounded up to full sheets after waste.", kind: "primary" },
    { id: "estimated-cost", label: "Estimated Cost", value: formatCurrency(result.estimatedCost), detail: "Drywall sheets only · before tax and installation supplies", kind: "cost" },
    { id: "drywall-area", label: "Drywall Area", value: `${formatNumber(result.drywallArea)} ${unit}`, detail: "Selected surfaces after deducting wall openings.", kind: "metric" },
    { id: "required-area-with-waste", label: "Area With Waste", value: `${formatNumber(result.requiredAreaWithWaste)} ${unit}`, detail: `Includes ${formatNumber(result.waste)}% waste.`, kind: "metric" },
    { id: "coverage-per-sheet", label: "Coverage per Sheet", value: `${formatNumber(result.sheetArea)} ${unit}`, kind: "metric" },
  ];
}

export const drywallCalculator: CalculatorEngine<DrywallInput, DrywallResult> = {
  slug: "drywall",
  fields: getDrywallFields("imperial"),
  fieldGroups: drywallFieldGroups,
  getFields: (input) => getDrywallFields(isDrywallUnitSystem(input.unitSystem) ? input.unitSystem : "imperial", input),
  updateInput,
  createInitialInput: () => ({ ...drywallDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: drywallShoppingList,
  resultNote: "Area-based planning estimate for one rectangular room. Sheet orientation, stud spacing, seams, staggered joints, specialty board, multi-layer assemblies, labor, delivery, and tax are not modeled. Confirm the board type, thickness, and layout before buying.",
};
