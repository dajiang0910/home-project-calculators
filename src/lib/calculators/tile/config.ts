import type { CalculatorField, CalculatorFieldGroup, ShoppingListItem } from "../types";

export type TileUnitSystem = "imperial" | "metric";

export type TileInput = {
  unitSystem: TileUnitSystem;
  roomLength: number;
  roomWidth: number;
  tileLength: number;
  tileWidth: number;
  waste: number;
  tilesPerBox: number;
  pricePerBox: number;
};

type TileQuantity = "roomLength" | "tileLength";

export const tileUnits = {
  imperial: {
    roomLength: "ft",
    tileLength: "in",
    area: "sq ft",
    roomLengthFactor: 1,
    tileLengthFactor: 1,
    tileAreaDivisor: 144,
  },
  metric: {
    roomLength: "m",
    tileLength: "cm",
    area: "m²",
    roomLengthFactor: 0.3048,
    tileLengthFactor: 2.54,
    tileAreaDivisor: 10_000,
  },
} as const;

export function isTileUnitSystem(value: unknown): value is TileUnitSystem {
  return value === "imperial" || value === "metric";
}

export const tileDefaults: Readonly<TileInput> = Object.freeze({
  unitSystem: "imperial",
  roomLength: 14,
  roomWidth: 12,
  tileLength: 12,
  tileWidth: 12,
  waste: 10,
  tilesPerBox: 12,
  pricePerBox: 35,
});

type NumericField = {
  name: Exclude<keyof TileInput, "unitSystem">;
  label: string;
  group: string;
  min: number;
  max: number;
  quantity?: TileQuantity;
  integer?: boolean;
  description?: string;
};

export const tileNumericFields: readonly NumericField[] = [
  { name: "roomLength", label: "Room Length", group: "surface", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "roomWidth", label: "Room Width", group: "surface", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "tileLength", label: "Tile Length", group: "tile", min: 0.1, max: 120, quantity: "tileLength" },
  { name: "tileWidth", label: "Tile Width", group: "tile", min: 0.1, max: 120, quantity: "tileLength" },
  { name: "waste", label: "Waste", group: "purchase", min: 0, max: 100, description: "Extra tile for cuts, breakage, pattern matching, and future repairs." },
  { name: "tilesPerBox", label: "Tiles per Box", group: "purchase", min: 1, max: 100_000, integer: true, description: "Use the full-piece count printed on the box." },
  { name: "pricePerBox", label: "Price per Box", group: "purchase", min: 0, max: 100_000, description: "Price of one full box, before tax." },
];

export const tileFieldGroups: readonly CalculatorFieldGroup[] = [
  { id: "surface", title: "Your surface", description: "Measure one rectangular floor or wall section." },
  { id: "tile", title: "Your tile", description: "Enter the nominal length and width of one tile." },
  { id: "purchase", title: "Your purchase", description: "Match the waste, box quantity, and price to your chosen tile." },
];

export function getTileFields(system: TileUnitSystem): readonly CalculatorField[] {
  const units = tileUnits[system];
  return [
    {
      name: "unitSystem",
      label: "Unit System",
      type: "select",
      required: true,
      description: "Switching converts room and tile dimensions. Box quantity, waste, and USD price stay unchanged.",
      options: [
        { value: "imperial", label: "US / Imperial — ft, in" },
        { value: "metric", label: "Metric — m, cm" },
      ],
    },
    ...tileNumericFields.map((field): CalculatorField => {
      const factor = field.quantity ? units[`${field.quantity}Factor`] : 1;
      return {
        name: field.name,
        label: field.label,
        group: field.group,
        description: field.description,
        type: "number",
        required: true,
        min: field.min * factor,
        max: field.max * factor,
        step: field.integer ? 1 : "any",
        unit: field.quantity ? units[field.quantity] : field.name === "waste" ? "%" : field.name === "pricePerBox" ? "USD / box" : undefined,
      };
    }),
  ];
}

export const tileShoppingList: readonly ShoppingListItem[] = [
  { name: "Tile", detail: "Buy the Boxes Needed shown above in the same dye lot when possible." },
  { name: "Mortar or Adhesive", detail: "Choose a product approved for your tile, substrate, and installation location." },
  { name: "Grout", detail: "Estimate separately using tile size, joint width, joint depth, and the grout label." },
  { name: "Tile Spacers", detail: "Match the spacer size to your planned grout joint." },
  { name: "Backer Board or Membrane", detail: "Use when required for a flat, stable, and water-resistant substrate." },
  { name: "Installation Supplies", detail: "Plan for a notched trowel, level, mixing tools, and a suitable tile cutter or wet saw." },
];
