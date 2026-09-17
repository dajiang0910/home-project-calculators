import type { CalculatorDefinition, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { drywallContent } from "../../../content/calculators/drywall";
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

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

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
  for (const field of getDrywallFields(raw.unitSystem)) {
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

  const value = { ...parsed, unitSystem: raw.unitSystem, projectType: raw.projectType } as DrywallInput;
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
    const numeric = parseNumber(input[field.name]);
    if (numeric === undefined) continue;
    const next = numeric * factor;
    if (Number.isFinite(next)) converted[field.name] = Number(next.toFixed(6));
  }
  return converted;
}

function roundSheets(value: number): number {
  const tolerance = 8 * Number.EPSILON * Math.max(1, value);
  return Math.max(1, Math.ceil(value - tolerance));
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
  const sheetsNeeded = requiredAreaWithWaste === 0 ? 0 : roundSheets(requiredAreaWithWaste / sheetArea);
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
    estimatedCost: sheetsNeeded * values.pricePerSheet,
    waste: values.waste,
  };
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatResult(result: DrywallResult): readonly ResultItem[] {
  const unit = drywallUnits[result.unitSystem].area;
  return [
    { label: "Sheets Needed", value: `${result.sheetsNeeded.toLocaleString("en-US")} ${result.sheetsNeeded === 1 ? "sheet" : "sheets"}`, detail: "Rounded up to full sheets after waste.", emphasis: true },
    { label: "Estimated Cost", value: currency.format(result.estimatedCost), detail: "Drywall sheets only · before tax and installation supplies", emphasis: true },
    { label: "Drywall Area", value: `${number.format(result.drywallArea)} ${unit}`, detail: "Selected surfaces after deducting wall openings." },
    { label: "Area With Waste", value: `${number.format(result.requiredAreaWithWaste)} ${unit}`, detail: `Includes ${number.format(result.waste)}% waste.` },
    { label: "Coverage per Sheet", value: `${number.format(result.sheetArea)} ${unit}` },
  ];
}

export const drywallCalculator: CalculatorDefinition<DrywallInput, DrywallResult> = {
  slug: "drywall",
  metadata: {
    title: "Drywall Calculator",
    seoTitle: "Drywall Calculator: Sheets, Waste & Cost",
    description: "Estimate drywall sheets for rectangular walls and ceilings, subtract openings, add waste, and calculate sheet cost.",
    category: "general",
    keywords: ["drywall calculator", "drywall sheet calculator", "sheetrock calculator", "drywall cost calculator"],
  },
  fields: getDrywallFields("imperial"),
  fieldGroups: drywallFieldGroups,
  getFields: (input) => getDrywallFields(isDrywallUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput,
  createInitialInput: () => ({ ...drywallDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: drywallShoppingList,
  resultNote: "Area-based planning estimate for one rectangular room. Sheet orientation, stud spacing, seams, staggered joints, specialty board, multi-layer assemblies, labor, delivery, and tax are not modeled. Confirm the board type, thickness, and layout before buying.",
  content: drywallContent,
};
