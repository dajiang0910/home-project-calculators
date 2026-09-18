import "server-only";
import { baseboardContent } from "../../content/calculators/baseboard";
import { ceilingPaintContent } from "../../content/calculators/ceiling-paint";
import { drywallContent } from "../../content/calculators/drywall";
import { flooringContent } from "../../content/calculators/flooring";
import { paintContent } from "../../content/calculators/paint";
import { tileContent } from "../../content/calculators/tile";
import { wallpaperContent } from "../../content/calculators/wallpaper";
import type { CalculatorContent } from "./types";

const contentBySlug = {
  paint: paintContent,
  flooring: flooringContent,
  tile: tileContent,
  drywall: drywallContent,
  wallpaper: wallpaperContent,
  "ceiling-paint": ceilingPaintContent,
  baseboard: baseboardContent,
} satisfies Readonly<Record<string, CalculatorContent>>;

export function loadCalculatorContent(slug: string): CalculatorContent {
  const content = (contentBySlug as Readonly<Record<string, CalculatorContent>>)[slug];
  if (!content) throw new Error(`Missing calculator content for "${slug}".`);
  return content;
}
