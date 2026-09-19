import type { CalculatorEngine, CalculatorFormInput, ResultItem, ValidationResult } from "../types";
import { ceilWholePurchase, multiplyCurrency, parseFiniteNumber } from "../numeric";
import { formatCurrency, formatNumber } from "../shared";
import {
  getTileFields,
  isTileUnitSystem,
  tileDefaults,
  tileFieldGroups,
  tileNumericFields,
  tileShoppingList,
  tileUnits,
  type TileInput,
  type TileUnitSystem,
} from "./config";

export type TileResult = {
  unitSystem: TileUnitSystem;
  surfaceArea: number;
  tileArea: number;
  exactTileCount: number;
  tilesNeeded: number;
  boxesNeeded: number;
  tilesPurchased: number;
  estimatedCost: number;
  waste: number;
};

export function validate(input: unknown): ValidationResult<TileInput> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { form: "Enter your surface and tile measurements to calculate an estimate." } };
  }
  const raw = input as CalculatorFormInput;
  if (!isTileUnitSystem(raw.unitSystem)) {
    return { valid: false, errors: { unitSystem: "Choose US / Imperial or Metric units." } };
  }

  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};
  for (const field of getTileFields(raw.unitSystem)) {
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
  return { valid: true, value: { ...parsed, unitSystem: raw.unitSystem } as TileInput };
}

export function updateInput(input: CalculatorFormInput, name: string, value: string): CalculatorFormInput {
  if (name !== "unitSystem" || !isTileUnitSystem(value) || !isTileUnitSystem(input.unitSystem)) {
    return { ...input, [name]: value };
  }
  if (value === input.unitSystem) return input;

  const converted: Record<string, unknown> = { ...input, unitSystem: value };
  const from = tileUnits[input.unitSystem];
  const to = tileUnits[value];
  for (const field of tileNumericFields) {
    if (!field.quantity) continue;
    const numeric = parseFiniteNumber(input[field.name]);
    if (numeric === undefined) continue;
    const factor = `${field.quantity}Factor` as const;
    const next = numeric * (to[factor] / from[factor]);
    if (Number.isFinite(next)) converted[field.name] = Number(next.toFixed(6));
  }
  return converted;
}

export function calculate(input: TileInput): TileResult {
  const validation = validate(input);
  if (!validation.valid) throw new RangeError(Object.values(validation.errors).join(" "));
  const values = validation.value;
  const units = tileUnits[values.unitSystem];
  const surfaceArea = values.roomLength * values.roomWidth;
  const tileArea = values.tileLength * values.tileWidth / units.tileAreaDivisor;
  const exactTileCount = surfaceArea / tileArea;
  const tilesNeeded = ceilWholePurchase(exactTileCount * (1 + values.waste / 100));
  const boxesNeeded = ceilWholePurchase(tilesNeeded / values.tilesPerBox);
  const tilesPurchased = boxesNeeded * values.tilesPerBox;
  return {
    unitSystem: values.unitSystem,
    surfaceArea,
    tileArea,
    exactTileCount,
    tilesNeeded,
    boxesNeeded,
    tilesPurchased,
    estimatedCost: multiplyCurrency(boxesNeeded, values.pricePerBox),
    waste: values.waste,
  };
}

export function formatResult(result: TileResult): readonly ResultItem[] {
  const unit = tileUnits[result.unitSystem].area;
  return [
    { id: "tiles-needed", label: "Tiles Needed", value: `${result.tilesNeeded.toLocaleString("en-US")} ${result.tilesNeeded === 1 ? "tile" : "tiles"}`, detail: `Includes ${formatNumber(result.waste)}% waste and rounds up to a whole tile.`, kind: "primary" },
    { id: "boxes-needed", label: "Boxes Needed", value: `${result.boxesNeeded.toLocaleString("en-US")} ${result.boxesNeeded === 1 ? "box" : "boxes"}`, detail: `${result.tilesPurchased.toLocaleString("en-US")} tiles purchased in full boxes.`, kind: "primary" },
    { id: "estimated-cost", label: "Estimated Cost", value: formatCurrency(result.estimatedCost), detail: "Tile boxes only · before tax and installation supplies", kind: "cost" },
    { id: "surface-area", label: "Surface Area", value: `${formatNumber(result.surfaceArea)} ${unit}`, kind: "metric" },
    { id: "area-per-tile", label: "Area per Tile", value: `${formatNumber(result.tileArea)} ${unit}`, kind: "metric" },
  ];
}

export const tileCalculator: CalculatorEngine<TileInput, TileResult> = {
  slug: "tile",
  fields: getTileFields("imperial"),
  fieldGroups: tileFieldGroups,
  getFields: (input) => getTileFields(isTileUnitSystem(input.unitSystem) ? input.unitSystem : "imperial"),
  updateInput,
  createInitialInput: () => ({ ...tileDefaults }),
  validate,
  calculate,
  formatResult,
  shoppingList: tileShoppingList,
  resultNote: "For one rectangular floor or wall section. Layout, grout joints, partial edge pieces, pattern-specific cuts, installer requirements, labor, delivery, and tax are not modeled. Confirm box contents and dye lot before buying.",
};
