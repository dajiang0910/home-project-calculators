import type { CalculatorField, CalculatorFieldGroup, ShoppingListItem } from "../types";
import { paintUnits, unitFactor, type PaintQuantity, type PaintUnitSystem } from "./units";

export type PaintInput = {
  unitSystem: PaintUnitSystem;
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  doors: number;
  windows: number;
  coats: number;
  coverage: number;
  waste: number;
  pricePerUnit: number;
  doorWidth: number;
  doorHeight: number;
  windowWidth: number;
  windowHeight: number;
};

export const paintDefaults: Readonly<PaintInput> = Object.freeze({
  unitSystem: "imperial", roomLength: 14, roomWidth: 12, wallHeight: 8,
  doors: 1, windows: 2, coats: 2, coverage: 350, waste: 10, pricePerUnit: 45,
  doorWidth: 3, doorHeight: 7, windowWidth: 3, windowHeight: 4,
});

type NumericField = {
  name: Exclude<keyof PaintInput, "unitSystem">;
  label: string;
  group: string;
  min: number;
  max: number;
  quantity?: PaintQuantity;
  integer?: boolean;
  description?: string;
};

export const paintNumericFields: readonly NumericField[] = [
  { name: "roomLength", label: "Room Length", group: "room", min: 0.01, max: 1000, quantity: "length" },
  { name: "roomWidth", label: "Room Width", group: "room", min: 0.01, max: 1000, quantity: "length" },
  { name: "wallHeight", label: "Wall Height", group: "room", min: 0.01, max: 1000, quantity: "length" },
  { name: "doors", label: "Number of Doors", group: "room", min: 0, max: 10000, integer: true },
  { name: "windows", label: "Number of Windows", group: "room", min: 0, max: 10000, integer: true },
  { name: "coats", label: "Number of Coats", group: "paint", min: 1, max: 20, integer: true },
  { name: "coverage", label: "Paint Coverage", group: "paint", min: 0.01, max: 10000, quantity: "coverage", description: "Coverage for one coat. Use the rate on your paint can." },
  { name: "waste", label: "Waste", group: "paint", min: 0, max: 100, description: "Extra paint for roller loss, texture, and touch-ups." },
  { name: "pricePerUnit", label: "Price per Gallon", group: "paint", min: 0.01, max: 100000, quantity: "price", description: "Your paint price, before tax. Currency stays in USD." },
  { name: "doorWidth", label: "Door Width", group: "openings", min: 0.01, max: 1000, quantity: "length" },
  { name: "doorHeight", label: "Door Height", group: "openings", min: 0.01, max: 1000, quantity: "length" },
  { name: "windowWidth", label: "Window Width", group: "openings", min: 0.01, max: 1000, quantity: "length" },
  { name: "windowHeight", label: "Window Height", group: "openings", min: 0.01, max: 1000, quantity: "length" },
];

export const paintFieldGroups: readonly CalculatorFieldGroup[] = [
  { id: "room", title: "Your room", description: "Measure a rectangular room. Doors and windows are deducted from the walls." },
  { id: "paint", title: "Your paint", description: "Adjust coverage, coats, and price to match the paint you plan to use." },
  { id: "openings", title: "Door & window sizes", description: "Defaults: doors 3 × 7 ft (0.9144 × 2.1336 m); windows 3 × 4 ft (0.9144 × 1.2192 m). Edit the average size of each type below.", collapsible: true },
];

export function getPaintFields(system: PaintUnitSystem): readonly CalculatorField[] {
  const units = paintUnits[system];
  return [{ name: "unitSystem", label: "Unit System", type: "select", required: true,
    description: "Switching converts your measurements, coverage, and price. Purchases round up to whole gallons or liters.",
    options: [{ value: "imperial", label: "US / Imperial — ft, gal" }, { value: "metric", label: "Metric — m, L" }],
  }, ...paintNumericFields.map((field): CalculatorField => {
    const factor = field.quantity ? unitFactor(system, field.quantity) : 1;
    return {
      name: field.name, label: field.name === "pricePerUnit" && system === "metric" ? "Price per Liter" : field.label,
      group: field.group, description: field.description, type: "number", required: true,
      min: field.min * factor, max: field.max * factor, step: field.integer ? 1 : "any",
      unit: field.quantity ? units[field.quantity] : field.name === "waste" ? "%" : undefined,
    };
  })];
}

export const paintShoppingList: readonly ShoppingListItem[] = [
  { name: "Paint", detail: "Buy the recommended amount above in your chosen color and finish." },
  { name: "Primer", detail: "If needed for bare drywall, stains, or a major color change. Estimate separately." },
  { name: "Paint Roller", detail: "A roller frame, cover suited to your wall texture, and paint tray." },
  { name: "Paint Brush", detail: "An angled brush for cutting in at edges and corners." },
  { name: "Painter's Tape", detail: "Protect trim and create clean edges." },
  { name: "Drop Cloth", detail: "Cover the floor and furniture before painting." },
];
