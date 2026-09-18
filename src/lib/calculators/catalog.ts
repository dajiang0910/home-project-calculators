import type { CalculatorCategory, CalculatorManifest, CalculatorMetadata } from "./types";
import { calculatorRegistry, getCalculatorManifest, listCalculators, type CalculatorSlug } from "./registry";

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
  { slug: "painting", title: "Painting Calculators", shortTitle: "Painting", description: "Plan wall and ceiling coverage, coats, waste, purchase quantities, and paint cost.", detail: "Start with the surface, account for openings and coats, then compare the calculated need with the containers sold by your supplier.", marker: "PA", plannedTools: ["Exterior Paint Calculator", "Primer Calculator"] },
  { slug: "flooring", title: "Flooring Calculators", shortTitle: "Flooring", description: "Estimate floor area, tile counts, packaging, waste, and material cost.", detail: "Use room dimensions and product coverage to turn a measured floor into a practical number of boxes, tiles, or rolls to buy.", marker: "FL", plannedTools: ["Carpet Calculator", "Grout Calculator", "Thinset Calculator"] },
  { slug: "walls", title: "Wall Calculators", shortTitle: "Walls", description: "Plan drywall, wallpaper, insulation, openings, and finish materials for interior walls.", detail: "Wall projects depend on surface area, openings, product dimensions, and installation waste. These tools keep those assumptions visible.", marker: "WA", plannedTools: ["Insulation Calculator", "Stud Calculator"] },
  { slug: "trim", title: "Trim Calculators", shortTitle: "Trim", description: "Estimate linear runs, full pieces, cut waste, and cost for interior finish trim.", detail: "Translate room perimeter and openings into purchasable lengths while allowing for miters, joins, and offcuts.", marker: "TR", plannedTools: ["Crown Molding Calculator"] },
  { slug: "construction", title: "Construction Calculators", shortTitle: "Construction", description: "Plan concrete, masonry, siding, framing, and other structural material quantities.", detail: "Construction tools will turn project geometry into material volumes, counts, and cost-ready purchase estimates.", marker: "CO", plannedTools: ["Concrete Calculator", "Siding Calculator", "Brick Calculator"] },
  { slug: "outdoor", title: "Outdoor Calculators", shortTitle: "Outdoor", description: "Estimate materials for decks, fences, landscaping, patios, and yard projects.", detail: "Outdoor projects combine area, volume, spacing, and weather-aware waste allowances across several material types.", marker: "OU", plannedTools: ["Mulch Calculator", "Gravel Calculator", "Fence Calculator", "Deck Calculator"] },
  { slug: "roofing", title: "Roofing Calculators", shortTitle: "Roofing", description: "Plan roof area, shingles, bundles, underlayment, and related exterior materials.", detail: "Roofing estimates will account for roof geometry, pitch, waste, and the package sizes used by suppliers.", marker: "RO", plannedTools: ["Roofing Calculator", "Roof Shingle Calculator", "Gutter Calculator"] },
] as const;

function toCatalogEntry(manifest: CalculatorManifest): CalculatorCatalogEntry {
  return {
    slug: manifest.slug,
    metadata: manifest.metadata,
    summary: manifest.summary,
    marker: manifest.marker,
    image: manifest.image,
    ...(manifest.featured ? { featured: true } : {}),
  };
}

/** Discovery data is derived from the single publication manifest. */
export const calculatorCatalog: readonly CalculatorCatalogEntry[] = listCalculators().map(toCatalogEntry);

export function getCalculatorCatalogEntry(slug: string): CalculatorCatalogEntry | undefined {
  const manifest = getCalculatorManifest(slug);
  return manifest ? toCatalogEntry(manifest as CalculatorManifest) : undefined;
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
) as Readonly<Record<CalculatorSlug, CalculatorCatalogEntry>>;

export { calculatorRegistry };
