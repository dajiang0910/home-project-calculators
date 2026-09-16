export type PaintUnitSystem = "imperial" | "metric";

export const METERS_PER_FOOT = 0.3048;
export const SQUARE_METERS_PER_SQUARE_FOOT = METERS_PER_FOOT ** 2;
export const LITERS_PER_GALLON = 3.785411784;

export const paintUnits = {
  imperial: { length: "ft", area: "sq ft", volume: "gal", coverage: "sq ft / gal", price: "USD / gal", lengthFactor: 1, areaFactor: 1, volumeFactor: 1, purchaseIncrement: 1 },
  metric: { length: "m", area: "m²", volume: "L", coverage: "m² / L", price: "USD / L", lengthFactor: METERS_PER_FOOT, areaFactor: SQUARE_METERS_PER_SQUARE_FOOT, volumeFactor: LITERS_PER_GALLON, purchaseIncrement: 1 },
} as const;

export function isPaintUnitSystem(value: unknown): value is PaintUnitSystem {
  return value === "imperial" || value === "metric";
}

export type PaintQuantity = "length" | "coverage" | "price";

export function unitFactor(system: PaintUnitSystem, quantity: PaintQuantity): number {
  const units = paintUnits[system];
  if (quantity === "length") return units.lengthFactor;
  if (quantity === "coverage") return units.areaFactor / units.volumeFactor;
  return 1 / units.volumeFactor;
}

export function convertPaintValue(value: number, quantity: PaintQuantity, from: PaintUnitSystem, to: PaintUnitSystem): number {
  return value / unitFactor(from, quantity) * unitFactor(to, quantity);
}
