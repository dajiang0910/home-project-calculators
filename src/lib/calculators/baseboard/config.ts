import { parseFiniteNumber } from "../numeric";
import type { CalculatorField, CalculatorFieldGroup, CalculatorFormInput, ShoppingListItem } from "../types";

export type BaseboardUnitSystem = "imperial" | "metric";

export type BaseboardInput = {
  unitSystem: BaseboardUnitSystem;
  roomLength: number;
  roomWidth: number;
  doors: number;
  doorWidth: number;
  boardLength: number;
  waste: number;
  pricePerBoard: number;
};

export const baseboardUnits = {
  imperial: { length: "ft", lengthFactor: 1 },
  metric: { length: "m", lengthFactor: 0.3048 },
} as const;

export function isBaseboardUnitSystem(value: unknown): value is BaseboardUnitSystem {
  return value === "imperial" || value === "metric";
}

export const baseboardDefaults: Readonly<BaseboardInput> = Object.freeze({
  unitSystem: "imperial",
  roomLength: 14,
  roomWidth: 12,
  doors: 1,
  doorWidth: 3,
  boardLength: 8,
  waste: 10,
  pricePerBoard: 18,
});

type NumericField = {
  name: Exclude<keyof BaseboardInput, "unitSystem">;
  label: string;
  group: string;
  min: number;
  max: number;
  length?: boolean;
  integer?: boolean;
  description?: string;
};

export const baseboardNumericFields: readonly NumericField[] = [
  { name: "roomLength", label: "Room Length", group: "room", min: 0.01, max: 1000, length: true },
  { name: "roomWidth", label: "Room Width", group: "room", min: 0.01, max: 1000, length: true },
  { name: "boardLength", label: "Baseboard Length", group: "baseboard", min: 0.1, max: 100, length: true, description: "Length of one full baseboard piece you plan to buy." },
  { name: "waste", label: "Waste", group: "baseboard", min: 0, max: 100, description: "Extra material for miter cuts, inside corners, mistakes, and future repairs." },
  { name: "pricePerBoard", label: "Price per Piece", group: "baseboard", min: 0, max: 100000, description: "Price of one full baseboard piece, before tax." },
  { name: "doors", label: "Number of Doors", group: "openings", min: 0, max: 10000, integer: true },
  { name: "doorWidth", label: "Door Opening Width", group: "openings", min: 0.01, max: 1000, length: true, description: "Width of one doorway where baseboard is not installed." },
];

export const baseboardFieldGroups: readonly CalculatorFieldGroup[] = [
  { id: "room", title: "Your room", description: "Measure the length and width of one rectangular room." },
  { id: "baseboard", title: "Your baseboard", description: "Match the full-piece length, waste allowance, and price to the trim you plan to buy." },
  { id: "openings", title: "Door openings", description: "Doorways interrupt the baseboard run. Defaults: one 3 ft opening. Set the count to zero when there are no doors.", collapsible: true },
];

export function isBaseboardNumericFieldActive(name: Exclude<keyof BaseboardInput, "unitSystem">, input?: CalculatorFormInput): boolean {
  return !input || name !== "doorWidth" || parseFiniteNumber(input.doors) !== 0;
}

export function getBaseboardFields(system: BaseboardUnitSystem, input?: CalculatorFormInput): readonly CalculatorField[] {
  const units = baseboardUnits[system];
  return [
    {
      name: "unitSystem",
      label: "Unit System",
      type: "select",
      required: true,
      description: "Switching converts room, opening, and board dimensions. Counts, waste, and USD price stay unchanged.",
      options: [
        { value: "imperial", label: "US / Imperial — ft" },
        { value: "metric", label: "Metric — m" },
      ],
    },
    ...baseboardNumericFields.filter((field) => isBaseboardNumericFieldActive(field.name, input)).map((field): CalculatorField => {
      const factor = field.length ? units.lengthFactor : 1;
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
        unit: field.length ? units.length : field.name === "waste" ? "%" : field.name === "pricePerBoard" ? "USD / piece" : undefined,
      };
    }),
  ];
}

export const baseboardShoppingList: readonly ShoppingListItem[] = [
  { name: "Baseboard", detail: "Buy the Pieces Needed shown above in the profile, height, and finish you selected." },
  { name: "Fasteners or Adhesive", detail: "Use the installation method recommended for your wall type and trim material." },
  { name: "Paintable Caulk", detail: "Fill small gaps at the wall and joints after the baseboard is secured." },
  { name: "Touch-up Paint or Finish", detail: "Match the baseboard finish and keep extra for cut ends and future repairs." },
  { name: "Miter & Coping Tools", detail: "Plan for a miter saw or hand saw, coping saw, clamps, and a suitable blade." },
  { name: "Measuring & Protection", detail: "Use a tape measure, level, pencil, stud finder, eye protection, and floor covering." },
];
