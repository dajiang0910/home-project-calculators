import type { CalculatorField, CalculatorFieldGroup, ShoppingListItem } from "../types";

export type CeilingPaintUnitSystem = "imperial" | "metric";

export type CeilingPaintInput = {
  unitSystem: CeilingPaintUnitSystem;
  roomLength: number;
  roomWidth: number;
  coats: number;
  coverage: number;
  waste: number;
  pricePerUnit: number;
};

export const METERS_PER_FOOT = 0.3048;
export const SQUARE_METERS_PER_SQUARE_FOOT = METERS_PER_FOOT ** 2;
export const LITERS_PER_GALLON = 3.785411784;

export const ceilingPaintUnits = {
  imperial: {
    length: "ft",
    area: "sq ft",
    volume: "gal",
    coverage: "sq ft / gal",
    price: "USD / gal",
    lengthFactor: 1,
    areaFactor: 1,
    volumeFactor: 1,
    purchaseIncrement: 1,
  },
  metric: {
    length: "m",
    area: "m²",
    volume: "L",
    coverage: "m² / L",
    price: "USD / L",
    lengthFactor: METERS_PER_FOOT,
    areaFactor: SQUARE_METERS_PER_SQUARE_FOOT,
    volumeFactor: LITERS_PER_GALLON,
    purchaseIncrement: 1,
  },
} as const;

export function isCeilingPaintUnitSystem(value: unknown): value is CeilingPaintUnitSystem {
  return value === "imperial" || value === "metric";
}

type CeilingPaintQuantity = "length" | "coverage" | "price";

function unitFactor(system: CeilingPaintUnitSystem, quantity: CeilingPaintQuantity): number {
  const units = ceilingPaintUnits[system];
  if (quantity === "length") return units.lengthFactor;
  if (quantity === "coverage") return units.areaFactor / units.volumeFactor;
  return 1 / units.volumeFactor;
}

export function convertCeilingPaintValue(value: number, quantity: CeilingPaintQuantity, from: CeilingPaintUnitSystem, to: CeilingPaintUnitSystem): number {
  return value / unitFactor(from, quantity) * unitFactor(to, quantity);
}

export const ceilingPaintDefaults: Readonly<CeilingPaintInput> = Object.freeze({
  unitSystem: "imperial",
  roomLength: 14,
  roomWidth: 12,
  coats: 2,
  coverage: 350,
  waste: 15,
  pricePerUnit: 45,
});

type NumericField = {
  name: Exclude<keyof CeilingPaintInput, "unitSystem">;
  label: string;
  group: string;
  min: number;
  max: number;
  quantity?: CeilingPaintQuantity;
  integer?: boolean;
  description?: string;
};

export const ceilingPaintNumericFields: readonly NumericField[] = [
  { name: "roomLength", label: "Room Length", group: "ceiling", min: 0.01, max: 1000, quantity: "length" },
  { name: "roomWidth", label: "Room Width", group: "ceiling", min: 0.01, max: 1000, quantity: "length" },
  { name: "coats", label: "Number of Coats", group: "paint", min: 1, max: 20, integer: true, description: "Use the number of coats your ceiling needs for even coverage." },
  { name: "coverage", label: "Paint Coverage", group: "paint", min: 0.01, max: 10000, quantity: "coverage", description: "Coverage for one coat. Use the rate on your paint can." },
  { name: "waste", label: "Extra Waste", group: "paint", min: 0, max: 100, description: "Extra allowance for roller loss, texture, touch-ups, and overhead work." },
  { name: "pricePerUnit", label: "Price per Gallon", group: "paint", min: 0.01, max: 100000, quantity: "price", description: "Your ceiling paint price, before tax. Currency stays in USD." },
];

export const ceilingPaintFieldGroups: readonly CalculatorFieldGroup[] = [
  { id: "ceiling", title: "Your ceiling", description: "Measure the length and width of one rectangular ceiling surface." },
  { id: "paint", title: "Your ceiling paint", description: "Match the coverage, coats, waste, and price to the product you plan to use." },
];

export function getCeilingPaintFields(system: CeilingPaintUnitSystem): readonly CalculatorField[] {
  const units = ceilingPaintUnits[system];
  return [
    {
      name: "unitSystem",
      label: "Unit System",
      type: "select",
      required: true,
      description: "Switching converts ceiling dimensions, coverage, and price. Coats, waste, and USD stay equivalent.",
      options: [
        { value: "imperial", label: "US / Imperial — ft, gal" },
        { value: "metric", label: "Metric — m, L" },
      ],
    },
    ...ceilingPaintNumericFields.map((field): CalculatorField => {
      const factor = field.quantity ? unitFactor(system, field.quantity) : 1;
      return {
        name: field.name,
        label: field.name === "pricePerUnit" && system === "metric" ? "Price per Liter" : field.label,
        group: field.group,
        description: field.description,
        type: "number",
        required: true,
        min: field.min * factor,
        max: field.max * factor,
        step: field.integer ? 1 : "any",
        unit: field.quantity ? units[field.quantity] : field.name === "waste" ? "%" : undefined,
      };
    }),
  ];
}

export const ceilingPaintShoppingList: readonly ShoppingListItem[] = [
  { name: "Ceiling Paint", detail: "Buy the Recommended Purchase shown above in the finish and color you need." },
  { name: "Primer", detail: "Use when the ceiling is bare, stained, patched, or changing from a dark color." },
  { name: "Extension Pole & Roller", detail: "Choose a roller cover suited to the ceiling texture and a pole that keeps your stance comfortable." },
  { name: "Angled Brush", detail: "Cut in carefully around the ceiling edge, fixtures, and corners." },
  { name: "Painter's Tape", detail: "Protect walls, trim, vents, and light fixtures where needed." },
  { name: "Drop Cloth", detail: "Cover floors and furniture before overhead painting begins." },
];
