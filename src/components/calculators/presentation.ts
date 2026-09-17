export type CalculatorPresentation = {
  hero: "paint" | "flooring";
};

export const calculatorPresentation: Readonly<Record<string, CalculatorPresentation>> = {
  paint: { hero: "paint" },
  flooring: { hero: "flooring" },
};

const costLabels = new Set(["Estimated Material Cost", "Estimated Cost"]);

export function isCostResult(label: string): boolean {
  return costLabels.has(label);
}
