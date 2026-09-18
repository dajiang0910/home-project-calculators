import { parseFiniteNumber } from "../numeric";
import type { CalculatorField, CalculatorFieldGroup, CalculatorFormInput, ShoppingListItem } from "../types";

export type DrywallUnitSystem = "imperial" | "metric";
export type DrywallProjectType = "walls" | "walls-ceiling" | "ceiling";

export type DrywallInput = {
  unitSystem: DrywallUnitSystem;
  projectType: DrywallProjectType;
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  sheetLength: number;
  sheetWidth: number;
  waste: number;
  pricePerSheet: number;
  doors: number;
  windows: number;
  doorWidth: number;
  doorHeight: number;
  windowWidth: number;
  windowHeight: number;
};

export const drywallUnits = {
  imperial: { length: "ft", area: "sq ft", lengthFactor: 1 },
  metric: { length: "m", area: "m²", lengthFactor: 0.3048 },
} as const;

export function isDrywallUnitSystem(value: unknown): value is DrywallUnitSystem {
  return value === "imperial" || value === "metric";
}

export function isDrywallProjectType(value: unknown): value is DrywallProjectType {
  return value === "walls" || value === "walls-ceiling" || value === "ceiling";
}

export const drywallDefaults: Readonly<DrywallInput> = Object.freeze({
  unitSystem: "imperial",
  projectType: "walls-ceiling",
  roomLength: 12,
  roomWidth: 10,
  wallHeight: 8,
  sheetLength: 8,
  sheetWidth: 4,
  waste: 10,
  pricePerSheet: 15,
  doors: 1,
  windows: 2,
  doorWidth: 3,
  doorHeight: 7,
  windowWidth: 3,
  windowHeight: 4,
});

type NumericField = {
  name: Exclude<keyof DrywallInput, "unitSystem" | "projectType">;
  label: string;
  group: string;
  min: number;
  max: number;
  length?: boolean;
  integer?: boolean;
  description?: string;
};

export const drywallNumericFields: readonly NumericField[] = [
  { name: "roomLength", label: "Room Length", group: "room", min: 0.01, max: 1000, length: true },
  { name: "roomWidth", label: "Room Width", group: "room", min: 0.01, max: 1000, length: true },
  { name: "wallHeight", label: "Wall Height", group: "room", min: 0.01, max: 1000, length: true, description: "Used when the project includes walls." },
  { name: "sheetLength", label: "Sheet Length", group: "panels", min: 0.1, max: 100, length: true },
  { name: "sheetWidth", label: "Sheet Width", group: "panels", min: 0.1, max: 100, length: true },
  { name: "waste", label: "Waste", group: "panels", min: 0, max: 100, description: "Extra board for cuts, breakage, and layout constraints." },
  { name: "pricePerSheet", label: "Price per Sheet", group: "panels", min: 0, max: 100_000, description: "Price of one full sheet, before tax." },
  { name: "doors", label: "Number of Doors", group: "openings", min: 0, max: 10_000, integer: true },
  { name: "windows", label: "Number of Windows", group: "openings", min: 0, max: 10_000, integer: true },
  { name: "doorWidth", label: "Door Width", group: "openings", min: 0.01, max: 1000, length: true },
  { name: "doorHeight", label: "Door Height", group: "openings", min: 0.01, max: 1000, length: true },
  { name: "windowWidth", label: "Window Width", group: "openings", min: 0.01, max: 1000, length: true },
  { name: "windowHeight", label: "Window Height", group: "openings", min: 0.01, max: 1000, length: true },
];

export const drywallFieldGroups: readonly CalculatorFieldGroup[] = [
  { id: "room", title: "Your project", description: "Choose the surfaces to cover and enter the rectangular room dimensions." },
  { id: "panels", title: "Your drywall", description: "Match the sheet size, waste allowance, and price to the board you plan to buy." },
  { id: "openings", title: "Door & window sizes", description: "Openings are deducted only when the project includes walls. Defaults: doors 3 × 7 ft; windows 3 × 4 ft.", collapsible: true },
];

export function isDrywallNumericFieldActive(
  name: Exclude<keyof DrywallInput, "unitSystem" | "projectType">,
  input?: CalculatorFormInput,
): boolean {
  if (!input) return true;
  if (input.projectType === "ceiling" && ["wallHeight", "doors", "windows", "doorWidth", "doorHeight", "windowWidth", "windowHeight"].includes(name)) {
    return false;
  }
  if (["doorWidth", "doorHeight"].includes(name) && parseFiniteNumber(input.doors) === 0) return false;
  if (["windowWidth", "windowHeight"].includes(name) && parseFiniteNumber(input.windows) === 0) return false;
  return true;
}

export function getDrywallFields(system: DrywallUnitSystem, input?: CalculatorFormInput): readonly CalculatorField[] {
  const units = drywallUnits[system];
  return [
    {
      name: "unitSystem",
      label: "Unit System",
      type: "select",
      required: true,
      description: "Switching converts every room, opening, and sheet dimension. Counts, waste, and USD price stay unchanged.",
      options: [
        { value: "imperial", label: "US / Imperial — ft, sq ft" },
        { value: "metric", label: "Metric — m, m²" },
      ],
    },
    {
      name: "projectType",
      label: "Surfaces to Cover",
      group: "room",
      type: "select",
      required: true,
      options: [
        { value: "walls-ceiling", label: "Walls + ceiling" },
        { value: "walls", label: "Walls only" },
        { value: "ceiling", label: "Ceiling only" },
      ],
    },
    ...drywallNumericFields.filter((field) => isDrywallNumericFieldActive(field.name, input)).map((field): CalculatorField => {
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
        unit: field.length ? units.length : field.name === "waste" ? "%" : field.name === "pricePerSheet" ? "USD / sheet" : undefined,
      };
    }),
  ];
}

export const drywallShoppingList: readonly ShoppingListItem[] = [
  { name: "Drywall Sheets", detail: "Buy the Sheets Needed shown above in the thickness and type required for the room." },
  { name: "Joint Tape", detail: "Choose paper or mesh tape to suit the finishing system and local practice." },
  { name: "Joint Compound", detail: "Select setting-type or ready-mixed compound for bedding, filling, and finish coats." },
  { name: "Drywall Screws or Nails", detail: "Match the fastener type and length to the framing and sheet thickness." },
  { name: "Corner Bead", detail: "Measure exposed outside corners separately and choose the appropriate profile." },
  { name: "Tools & Safety Gear", detail: "Plan for a T-square, utility knife, rasp, screw gun, sanding tools, eye protection, and a suitable respirator." },
];
