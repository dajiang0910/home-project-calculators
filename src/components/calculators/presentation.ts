import type { CalculatorSlug } from "../../lib/calculators/registry";

export type CalculatorPresentation = {
  hero: "paint" | "flooring" | "tile" | "drywall" | "wallpaper" | "ceilingPaint" | "baseboard";
};

export const calculatorPresentation = {
  paint: { hero: "paint" },
  flooring: { hero: "flooring" },
  tile: { hero: "tile" },
  drywall: { hero: "drywall" },
  wallpaper: { hero: "wallpaper" },
  "ceiling-paint": { hero: "ceilingPaint" },
  baseboard: { hero: "baseboard" },
} satisfies Readonly<Record<CalculatorSlug, CalculatorPresentation>>;

export function getCalculatorPresentation(slug: string): CalculatorPresentation {
  if (!Object.hasOwn(calculatorPresentation, slug)) {
    throw new Error(`Missing calculator presentation for "${slug}".`);
  }
  return calculatorPresentation[slug as CalculatorSlug];
}

const costLabels = new Set(["Estimated Material Cost", "Estimated Cost"]);

export function isCostResult(label: string): boolean {
  return costLabels.has(label);
}
