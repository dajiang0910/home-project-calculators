import { parseFiniteNumber } from "../numeric";
import type { CalculatorField, CalculatorFieldGroup, CalculatorFormInput, ShoppingListItem } from "../types";

export type WallpaperUnitSystem = "imperial" | "metric";

export type WallpaperInput = {
  unitSystem: WallpaperUnitSystem;
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  rollWidth: number;
  rollLength: number;
  patternRepeat: number;
  waste: number;
  pricePerRoll: number;
  doors: number;
  windows: number;
  doorWidth: number;
  doorHeight: number;
  windowWidth: number;
  windowHeight: number;
};

type WallpaperQuantity = "roomLength" | "rollLength" | "smallLength";

export const wallpaperUnits = {
  imperial: {
    roomLength: "ft",
    rollLength: "ft",
    smallLength: "in",
    area: "sq ft",
    roomLengthFactor: 1,
    rollLengthFactor: 1,
    smallLengthFactor: 1,
    smallLengthDivisor: 12,
  },
  metric: {
    roomLength: "m",
    rollLength: "m",
    smallLength: "cm",
    area: "m²",
    roomLengthFactor: 0.3048,
    rollLengthFactor: 0.3048,
    smallLengthFactor: 2.54,
    smallLengthDivisor: 100,
  },
} as const;

export function isWallpaperUnitSystem(value: unknown): value is WallpaperUnitSystem {
  return value === "imperial" || value === "metric";
}

export const wallpaperDefaults: Readonly<WallpaperInput> = Object.freeze({
  unitSystem: "imperial",
  roomLength: 12,
  roomWidth: 10,
  wallHeight: 8,
  rollWidth: 20.5,
  rollLength: 33,
  patternRepeat: 20.5,
  waste: 10,
  pricePerRoll: 40,
  doors: 1,
  windows: 2,
  doorWidth: 3,
  doorHeight: 7,
  windowWidth: 3,
  windowHeight: 4,
});

type NumericField = {
  name: Exclude<keyof WallpaperInput, "unitSystem">;
  label: string;
  group: string;
  min: number;
  max: number;
  quantity?: WallpaperQuantity;
  integer?: boolean;
  description?: string;
};

export const wallpaperNumericFields: readonly NumericField[] = [
  { name: "roomLength", label: "Room Length", group: "room", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "roomWidth", label: "Room Width", group: "room", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "wallHeight", label: "Wall Height", group: "room", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "rollWidth", label: "Roll Width", group: "wallpaper", min: 0.1, max: 120, quantity: "smallLength", description: "Use the physical width printed on the roll label." },
  { name: "rollLength", label: "Roll Length", group: "wallpaper", min: 0.1, max: 1000, quantity: "rollLength", description: "Use the physical length in one roll, not its retail naming convention." },
  { name: "patternRepeat", label: "Pattern Repeat", group: "wallpaper", min: 0, max: 120, quantity: "smallLength", description: "Vertical repeat from the label. Enter 0 for wallpaper with no repeat." },
  { name: "waste", label: "Extra Waste", group: "wallpaper", min: 0, max: 100, description: "Additional allowance for trimming, damaged material, and difficult corners." },
  { name: "pricePerRoll", label: "Price per Roll", group: "wallpaper", min: 0, max: 100_000, description: "Price of one physical roll, before tax." },
  { name: "doors", label: "Number of Doors", group: "openings", min: 0, max: 10_000, integer: true },
  { name: "windows", label: "Number of Windows", group: "openings", min: 0, max: 10_000, integer: true },
  { name: "doorWidth", label: "Door Width", group: "openings", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "doorHeight", label: "Door Height", group: "openings", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "windowWidth", label: "Window Width", group: "openings", min: 0.01, max: 1000, quantity: "roomLength" },
  { name: "windowHeight", label: "Window Height", group: "openings", min: 0.01, max: 1000, quantity: "roomLength" },
];

export const wallpaperFieldGroups: readonly CalculatorFieldGroup[] = [
  { id: "room", title: "Your room", description: "Measure the four walls of one rectangular room." },
  { id: "wallpaper", title: "Your wallpaper", description: "Match the roll dimensions, vertical pattern repeat, extra waste, and price to your chosen product." },
  { id: "openings", title: "Door & window sizes", description: "Defaults: doors 3 × 7 ft; windows 3 × 4 ft. These areas are deducted from the walls.", collapsible: true },
];

export function isWallpaperNumericFieldActive(name: Exclude<keyof WallpaperInput, "unitSystem">, input?: CalculatorFormInput): boolean {
  if (!input) return true;
  if (["doorWidth", "doorHeight"].includes(name) && parseFiniteNumber(input.doors) === 0) return false;
  if (["windowWidth", "windowHeight"].includes(name) && parseFiniteNumber(input.windows) === 0) return false;
  return true;
}

export function getWallpaperFields(system: WallpaperUnitSystem, input?: CalculatorFormInput): readonly CalculatorField[] {
  const units = wallpaperUnits[system];
  return [
    {
      name: "unitSystem",
      label: "Unit System",
      type: "select",
      required: true,
      description: "Switching converts room, opening, roll, and pattern measurements. Counts, waste, and USD price stay unchanged.",
      options: [
        { value: "imperial", label: "US / Imperial — ft, in" },
        { value: "metric", label: "Metric — m, cm" },
      ],
    },
    ...wallpaperNumericFields.filter((field) => isWallpaperNumericFieldActive(field.name, input)).map((field): CalculatorField => {
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
        unit: field.quantity ? units[field.quantity] : field.name === "waste" ? "%" : field.name === "pricePerRoll" ? "USD / roll" : undefined,
      };
    }),
  ];
}

export const wallpaperShoppingList: readonly ShoppingListItem[] = [
  { name: "Wallpaper", detail: "Buy the Rolls Needed shown above from the same print batch when possible." },
  { name: "Wall Primer or Sizing", detail: "Prepare the surface with the product recommended for the wall and wallpaper type." },
  { name: "Wallpaper Adhesive", detail: "Use when the wallpaper is not pre-pasted; calculate quantity from the adhesive label." },
  { name: "Smoothing Tool", detail: "Choose a wallpaper brush or plastic smoother appropriate for the surface." },
  { name: "Seam Roller", detail: "Use only when recommended so textured or delicate paper is not flattened." },
  { name: "Cutting & Layout Tools", detail: "Plan for a plumb line or level, measuring tape, straightedge, sharp blades, and a pasting table if needed." },
];
