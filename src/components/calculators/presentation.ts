import { getCalculatorManifest } from "../../lib/calculators/registry";
import type { CalculatorHero } from "../../lib/calculators/types";

export type CalculatorPresentation = {
  hero: CalculatorHero;
};

export function getCalculatorPresentation(slug: string): CalculatorPresentation {
  const manifest = getCalculatorManifest(slug);
  if (!manifest) throw new Error(`Missing calculator presentation for "${slug}".`);
  return { hero: manifest.hero };
}
