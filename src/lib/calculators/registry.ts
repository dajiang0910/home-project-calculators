import type { CalculatorContent, CalculatorManifest } from "./types";
import { calculatorEngineLoaders } from "./runtime";

const contentLoaders = {
  paint: () => import("./content-loader").then(({ loadCalculatorContent }) => loadCalculatorContent("paint")),
  flooring: () => import("./content-loader").then(({ loadCalculatorContent }) => loadCalculatorContent("flooring")),
  tile: () => import("./content-loader").then(({ loadCalculatorContent }) => loadCalculatorContent("tile")),
  drywall: () => import("./content-loader").then(({ loadCalculatorContent }) => loadCalculatorContent("drywall")),
  wallpaper: () => import("./content-loader").then(({ loadCalculatorContent }) => loadCalculatorContent("wallpaper")),
  "ceiling-paint": () => import("./content-loader").then(({ loadCalculatorContent }) => loadCalculatorContent("ceiling-paint")),
  baseboard: () => import("./content-loader").then(({ loadCalculatorContent }) => loadCalculatorContent("baseboard")),
} satisfies Readonly<Record<string, () => Promise<CalculatorContent>>>;

/**
 * The single publication manifest. Keep formula engines and educational
 * content behind loaders so the client only downloads the active calculator.
 */
export const calculatorRegistry = {
  paint: {
    slug: "paint",
    metadata: {
      title: "Paint Calculator",
      seoTitle: "Paint Calculator: How Much Paint Do I Need?",
      description: "Estimate paint for your room in gallons or liters. Account for doors, windows, coats, and waste, then see how much to buy and the estimated paint cost.",
      category: "painting",
      keywords: ["paint calculator", "paint coverage calculator", "how much paint do I need", "room paint calculator"],
    },
    summary: "Estimate wall paint, coats, waste, and the whole gallons or liters to buy.", marker: "PA", image: "/images/calculators/paint-hero.png", featured: true, hero: "paint",
    loadEngine: calculatorEngineLoaders.paint, loadContent: contentLoaders.paint,
  },
  flooring: {
    slug: "flooring",
    metadata: {
      title: "Flooring Calculator", seoTitle: "Flooring Calculator: Boxes, Waste & Cost",
      description: "Calculate floor area, add waste, and estimate flooring boxes and cost in US or metric units.", category: "flooring",
      keywords: ["flooring calculator", "flooring boxes calculator", "floor area calculator", "flooring cost"],
    },
    summary: "Turn room area and product coverage into full boxes and an estimated material cost.", marker: "FL", image: "/images/calculators/flooring-hero.png", featured: true, hero: "flooring",
    loadEngine: calculatorEngineLoaders.flooring, loadContent: contentLoaders.flooring,
  },
  tile: {
    slug: "tile",
    metadata: {
      title: "Tile Calculator", seoTitle: "Tile Calculator: Tiles, Boxes, Waste & Cost",
      description: "Estimate the tiles and full boxes needed for a rectangular floor or wall, including waste and material cost.", category: "flooring",
      keywords: ["tile calculator", "tiles needed calculator", "tile boxes calculator", "tile cost calculator"],
    },
    summary: "Calculate individual tiles, full boxes, waste allowance, and purchase cost.", marker: "TI", image: "/images/calculators/tile-hero.png", featured: true, hero: "tile",
    loadEngine: calculatorEngineLoaders.tile, loadContent: contentLoaders.tile,
  },
  drywall: {
    slug: "drywall",
    metadata: {
      title: "Drywall Calculator", seoTitle: "Drywall Calculator: Sheets, Waste & Cost",
      description: "Estimate drywall sheets for rectangular walls and ceilings, subtract openings, add waste, and calculate sheet cost.", category: "walls",
      keywords: ["drywall calculator", "drywall sheet calculator", "sheetrock calculator", "drywall cost calculator"],
    },
    summary: "Estimate sheets for walls, ceilings, and openings with waste and full-sheet pricing.", marker: "DR", image: "/images/calculators/drywall-hero.png", featured: true, hero: "drywall",
    loadEngine: calculatorEngineLoaders.drywall, loadContent: contentLoaders.drywall,
  },
  wallpaper: {
    slug: "wallpaper",
    metadata: {
      title: "Wallpaper Calculator", seoTitle: "Wallpaper Calculator: Rolls, Pattern Repeat & Cost",
      description: "Estimate wallpaper rolls for a rectangular room, including doors, windows, pattern repeat, waste, and material cost.", category: "walls",
      keywords: ["wallpaper calculator", "wallpaper roll calculator", "how much wallpaper do I need", "wallpaper cost calculator"],
    },
    summary: "Plan strips and rolls while accounting for openings, pattern repeat, and waste.", marker: "WP", image: "/images/calculators/wallpaper-hero.png", hero: "wallpaper",
    loadEngine: calculatorEngineLoaders.wallpaper, loadContent: contentLoaders.wallpaper,
  },
  "ceiling-paint": {
    slug: "ceiling-paint",
    metadata: {
      title: "Ceiling Paint Calculator", seoTitle: "Ceiling Paint Calculator: How Much Paint Do I Need?",
      description: "Estimate ceiling paint for a rectangular room. Account for coats, paint coverage, overhead waste, unit conversions, and the cost of whole gallons or liters.", category: "painting",
      keywords: ["ceiling paint calculator", "ceiling paint coverage", "how much paint for a ceiling", "ceiling paint cost calculator"],
    },
    summary: "Estimate ceiling coverage, coats, overhead waste, and whole-container cost.", marker: "CP", image: "/images/calculators/ceiling-paint-hero.png", hero: "ceilingPaint",
    loadEngine: calculatorEngineLoaders["ceiling-paint"], loadContent: contentLoaders["ceiling-paint"],
  },
  baseboard: {
    slug: "baseboard",
    metadata: {
      title: "Baseboard Calculator", seoTitle: "Baseboard Calculator: Linear Feet, Pieces & Cost",
      description: "Estimate baseboard trim for a rectangular room. Deduct door openings, add cut waste, and calculate the full pieces and cost to buy.", category: "trim",
      keywords: ["baseboard calculator", "baseboard trim calculator", "baseboard linear feet", "baseboard cost calculator"],
    },
    summary: "Convert room perimeter into linear length, full trim pieces, waste, and cost.", marker: "BA", image: "/images/calculators/baseboard-hero.png", hero: "baseboard",
    loadEngine: calculatorEngineLoaders.baseboard, loadContent: contentLoaders.baseboard,
  },
} satisfies Readonly<Record<string, CalculatorManifest>>;

export type CalculatorSlug = keyof typeof calculatorRegistry;
export type AnyCalculatorManifest = (typeof calculatorRegistry)[CalculatorSlug];

export function getCalculator(slug: string): AnyCalculatorManifest | undefined {
  return Object.hasOwn(calculatorRegistry, slug) ? calculatorRegistry[slug as CalculatorSlug] : undefined;
}

export const getCalculatorManifest = getCalculator;

export function listCalculators(): readonly AnyCalculatorManifest[] {
  return Object.values(calculatorRegistry);
}
