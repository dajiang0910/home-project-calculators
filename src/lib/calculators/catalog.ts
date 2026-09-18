import type { CalculatorCategory, CalculatorMetadata } from "./types";

export type CalculatorCategoryDefinition = {
  slug: CalculatorCategory;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
  marker: string;
  plannedTools: readonly string[];
};

export type CalculatorCatalogEntry = {
  slug: string;
  metadata: CalculatorMetadata;
  summary: string;
  marker: string;
  image: string;
  featured?: boolean;
};

export const calculatorCategories: readonly CalculatorCategoryDefinition[] = [
  {
    slug: "painting",
    title: "Painting Calculators",
    shortTitle: "Painting",
    description: "Plan wall and ceiling coverage, coats, waste, purchase quantities, and paint cost.",
    detail: "Start with the surface, account for openings and coats, then compare the calculated need with the containers sold by your supplier.",
    marker: "PA",
    plannedTools: ["Exterior Paint Calculator", "Primer Calculator"],
  },
  {
    slug: "flooring",
    title: "Flooring Calculators",
    shortTitle: "Flooring",
    description: "Estimate floor area, tile counts, packaging, waste, and material cost.",
    detail: "Use room dimensions and product coverage to turn a measured floor into a practical number of boxes, tiles, or rolls to buy.",
    marker: "FL",
    plannedTools: ["Carpet Calculator", "Grout Calculator", "Thinset Calculator"],
  },
  {
    slug: "walls",
    title: "Wall Calculators",
    shortTitle: "Walls",
    description: "Plan drywall, wallpaper, insulation, openings, and finish materials for interior walls.",
    detail: "Wall projects depend on surface area, openings, product dimensions, and installation waste. These tools keep those assumptions visible.",
    marker: "WA",
    plannedTools: ["Insulation Calculator", "Stud Calculator"],
  },
  {
    slug: "trim",
    title: "Trim Calculators",
    shortTitle: "Trim",
    description: "Estimate linear runs, full pieces, cut waste, and cost for interior finish trim.",
    detail: "Translate room perimeter and openings into purchasable lengths while allowing for miters, joins, and offcuts.",
    marker: "TR",
    plannedTools: ["Crown Molding Calculator"],
  },
  {
    slug: "construction",
    title: "Construction Calculators",
    shortTitle: "Construction",
    description: "Plan concrete, masonry, siding, framing, and other structural material quantities.",
    detail: "Construction tools will turn project geometry into material volumes, counts, and cost-ready purchase estimates.",
    marker: "CO",
    plannedTools: ["Concrete Calculator", "Siding Calculator", "Brick Calculator"],
  },
  {
    slug: "outdoor",
    title: "Outdoor Calculators",
    shortTitle: "Outdoor",
    description: "Estimate materials for decks, fences, landscaping, patios, and yard projects.",
    detail: "Outdoor projects combine area, volume, spacing, and weather-aware waste allowances across several material types.",
    marker: "OU",
    plannedTools: ["Mulch Calculator", "Gravel Calculator", "Fence Calculator", "Deck Calculator"],
  },
  {
    slug: "roofing",
    title: "Roofing Calculators",
    shortTitle: "Roofing",
    description: "Plan roof area, shingles, bundles, underlayment, and related exterior materials.",
    detail: "Roofing estimates will account for roof geometry, pitch, waste, and the package sizes used by suppliers.",
    marker: "RO",
    plannedTools: ["Roofing Calculator", "Roof Shingle Calculator", "Gutter Calculator"],
  },
] as const;

export const calculatorCatalog: readonly CalculatorCatalogEntry[] = [
  {
    slug: "paint",
    metadata: {
      title: "Paint Calculator",
      seoTitle: "Paint Calculator: How Much Paint Do I Need?",
      description: "Estimate paint for your room in gallons or liters. Account for doors, windows, coats, and waste, then see how much to buy and the estimated paint cost.",
      category: "painting",
      keywords: ["paint calculator", "paint coverage calculator", "how much paint do I need", "room paint calculator"],
    },
    summary: "Estimate wall paint, coats, waste, and the whole gallons or liters to buy.",
    marker: "PA",
    image: "/images/calculators/paint-hero.png",
    featured: true,
  },
  {
    slug: "flooring",
    metadata: {
      title: "Flooring Calculator",
      seoTitle: "Flooring Calculator: Boxes, Waste & Cost",
      description: "Calculate floor area, add waste, and estimate flooring boxes and cost in US or metric units.",
      category: "flooring",
      keywords: ["flooring calculator", "flooring boxes calculator", "floor area calculator", "flooring cost"],
    },
    summary: "Turn room area and product coverage into full boxes and an estimated material cost.",
    marker: "FL",
    image: "/images/calculators/flooring-hero.png",
    featured: true,
  },
  {
    slug: "tile",
    metadata: {
      title: "Tile Calculator",
      seoTitle: "Tile Calculator: Tiles, Boxes, Waste & Cost",
      description: "Estimate the tiles and full boxes needed for a rectangular floor or wall, including waste and material cost.",
      category: "flooring",
      keywords: ["tile calculator", "tiles needed calculator", "tile boxes calculator", "tile cost calculator"],
    },
    summary: "Calculate individual tiles, full boxes, waste allowance, and purchase cost.",
    marker: "TI",
    image: "/images/calculators/tile-hero.png",
    featured: true,
  },
  {
    slug: "drywall",
    metadata: {
      title: "Drywall Calculator",
      seoTitle: "Drywall Calculator: Sheets, Waste & Cost",
      description: "Estimate drywall sheets for rectangular walls and ceilings, subtract openings, add waste, and calculate sheet cost.",
      category: "walls",
      keywords: ["drywall calculator", "drywall sheet calculator", "sheetrock calculator", "drywall cost calculator"],
    },
    summary: "Estimate sheets for walls, ceilings, and openings with waste and full-sheet pricing.",
    marker: "DR",
    image: "/images/calculators/drywall-hero.png",
    featured: true,
  },
  {
    slug: "wallpaper",
    metadata: {
      title: "Wallpaper Calculator",
      seoTitle: "Wallpaper Calculator: Rolls, Pattern Repeat & Cost",
      description: "Estimate wallpaper rolls for a rectangular room, including doors, windows, pattern repeat, waste, and material cost.",
      category: "walls",
      keywords: ["wallpaper calculator", "wallpaper roll calculator", "how much wallpaper do I need", "wallpaper cost calculator"],
    },
    summary: "Plan strips and rolls while accounting for openings, pattern repeat, and waste.",
    marker: "WP",
    image: "/images/calculators/wallpaper-hero.png",
  },
  {
    slug: "ceiling-paint",
    metadata: {
      title: "Ceiling Paint Calculator",
      seoTitle: "Ceiling Paint Calculator: How Much Paint Do I Need?",
      description: "Estimate ceiling paint for a rectangular room. Account for coats, paint coverage, overhead waste, unit conversions, and the cost of whole gallons or liters.",
      category: "painting",
      keywords: ["ceiling paint calculator", "ceiling paint coverage", "how much paint for a ceiling", "ceiling paint cost calculator"],
    },
    summary: "Estimate ceiling coverage, coats, overhead waste, and whole-container cost.",
    marker: "CP",
    image: "/images/calculators/ceiling-paint-hero.png",
  },
  {
    slug: "baseboard",
    metadata: {
      title: "Baseboard Calculator",
      seoTitle: "Baseboard Calculator: Linear Feet, Pieces & Cost",
      description: "Estimate baseboard trim for a rectangular room. Deduct door openings, add cut waste, and calculate the full pieces and cost to buy.",
      category: "trim",
      keywords: ["baseboard calculator", "baseboard trim calculator", "baseboard linear feet", "baseboard cost calculator"],
    },
    summary: "Convert room perimeter into linear length, full trim pieces, waste, and cost.",
    marker: "BA",
    image: "/images/calculators/baseboard-hero.png",
  },
] as const;

export function getCalculatorCatalogEntry(slug: string): CalculatorCatalogEntry | undefined {
  return calculatorCatalog.find((calculator) => calculator.slug === slug);
}

export function getCalculatorCategory(slug: string): CalculatorCategoryDefinition | undefined {
  return calculatorCategories.find((category) => category.slug === slug);
}

export function listCalculatorsByCategory(category: CalculatorCategory): readonly CalculatorCatalogEntry[] {
  return calculatorCatalog.filter((calculator) => calculator.metadata.category === category);
}

export function listActiveCalculatorCategories(): readonly CalculatorCategoryDefinition[] {
  return calculatorCategories.filter((category) => listCalculatorsByCategory(category.slug).length > 0);
}

export const calculatorCatalogBySlug = Object.fromEntries(
  calculatorCatalog.map((calculator) => [calculator.slug, calculator]),
) as Readonly<Record<string, CalculatorCatalogEntry>>;
