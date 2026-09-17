export type CalculatorPresentation = {
  hero: "paint" | "flooring" | "tile" | "drywall";
};

export const calculatorPresentation: Readonly<Record<string, CalculatorPresentation>> = {
  paint: { hero: "paint" },
  flooring: { hero: "flooring" },
  tile: { hero: "tile" },
  drywall: { hero: "drywall" },
};

const costLabels = new Set(["Estimated Material Cost", "Estimated Cost"]);

export function isCostResult(label: string): boolean {
  return costLabels.has(label);
}
