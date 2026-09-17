import type { CalculatorField, CalculatorFieldGroup, ShoppingListItem } from "../types";

export type FlooringUnitSystem = "imperial" | "metric";
export type FlooringInput = {
  unitSystem: FlooringUnitSystem;
  roomLength: number;
  roomWidth: number;
  coveragePerBox: number;
  waste: number;
  pricePerBox: number;
};

export const flooringUnits = {
  imperial: { length: "ft", area: "sq ft", lengthFactor: 1, areaFactor: 1 },
  metric: { length: "m", area: "m²", lengthFactor: 0.3048, areaFactor: 0.3048 ** 2 },
} as const;

export function isFlooringUnitSystem(value: unknown): value is FlooringUnitSystem {
  return value === "imperial" || value === "metric";
}

export const flooringDefaults: Readonly<FlooringInput> = Object.freeze({
  unitSystem: "imperial", roomLength: 14, roomWidth: 12,
  coveragePerBox: 23.8, waste: 10, pricePerBox: 50,
});

export const flooringFieldGroups: readonly CalculatorFieldGroup[] = [
  { id: "room", title: "Your room", description: "Measure the length and width of your rectangular floor." },
  { id: "flooring", title: "Your flooring", description: "Use the coverage and price printed on your flooring box." },
];

export function getFlooringFields(system: FlooringUnitSystem): readonly CalculatorField[] {
  const units = flooringUnits[system];
  return [
    { name: "unitSystem", label: "Unit System", type: "select", required: true,
      description: "Switching converts measurements and box coverage. Price per box stays in USD.",
      options: [{ value: "imperial", label: "US / Imperial — ft, sq ft" }, { value: "metric", label: "Metric — m, m²" }] },
    ...(["roomLength", "roomWidth"] as const).map((name): CalculatorField => ({
      name, label: name === "roomLength" ? "Room Length" : "Room Width", group: "room",
      type: "number", required: true, min: 0.01 * units.lengthFactor, max: 1000 * units.lengthFactor,
      step: "any", unit: units.length,
    })),
    { name: "coveragePerBox", label: "Flooring Coverage per Box", group: "flooring", type: "number", required: true,
      min: 0.01 * units.areaFactor, max: 100000 * units.areaFactor, step: "any", unit: `${units.area} / box`,
      description: "Area covered by one full box of your chosen flooring." },
    { name: "waste", label: "Waste", group: "flooring", type: "number", required: true,
      min: 0, max: 100, step: "any", unit: "%", description: "Extra flooring for cuts, damaged pieces, and spare boards." },
    { name: "pricePerBox", label: "Price per Box", group: "flooring", type: "number", required: true,
      min: 0, max: 100000, step: "any", unit: "USD / box", description: "Price of one full box, before tax." },
  ];
}

export const flooringShoppingList: readonly ShoppingListItem[] = [
  { name: "Flooring", detail: "Buy the Boxes Needed shown above in your chosen product and finish." },
  { name: "Underlayment", detail: "If required by the flooring manufacturer; check whether it is already attached." },
  { name: "Transition Strips", detail: "Measure doorways and joins to other flooring separately." },
  { name: "Spacers", detail: "Use the expansion gap specified for your flooring." },
  { name: "Installation Supplies", detail: "Choose a cutting tool, tapping block, and any adhesive or fasteners required by your product." },
];
