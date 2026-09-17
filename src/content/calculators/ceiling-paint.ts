import type { CalculatorContent } from "../../lib/calculators/types";

export const ceilingPaintContent: CalculatorContent = {
  intro: "How much paint do I need for a ceiling? Enter the length and width of one rectangular ceiling, then account for coats, paint coverage, overhead waste, and the number of whole gallons or liters to buy.",
  howItWorks: [
    { title: "Measure the ceiling", text: "Enter the room length and width. This estimate covers one rectangular ceiling plane and does not include the walls, trim, or crown molding." },
    { title: "Read the paint label", text: "Use the coverage rate for one coat on your chosen ceiling paint. Textured, porous, stained, or patched ceilings may need a different rate or primer." },
    { title: "Plan the purchase", text: "We multiply the ceiling area by the number of coats, add your overhead-work allowance, and round up to whole gallons or liters." },
  ],
  formulas: [
    { label: "Ceiling Area", expression: "room length × room width" },
    { label: "Total Coverage", expression: "ceiling area × number of coats" },
    { label: "Paint Needed", expression: "(total coverage ÷ paint coverage) × (1 + waste ÷ 100)" },
    { label: "Recommended Purchase", expression: "paint needed rounded up to the next whole gallon or liter" },
    { label: "Estimated Material Cost", expression: "recommended purchase × price per gallon or liter" },
  ],
  example: {
    description: "A 14 × 12 ft ceiling with two coats, paint rated at 350 sq ft per gallon, 15% extra waste, and paint priced at $45 per gallon.",
    steps: [
      "Ceiling area: 14 × 12 = 168 sq ft.",
      "Two coats: 168 × 2 = 336 sq ft of total coverage.",
      "Base paint: 336 ÷ 350 = 0.96 gallons.",
      "With 15% extra waste: 0.96 × 1.15 = 1.10 gallons.",
      "Round up to 2 gallons; 2 × $45 = $90 estimated paint cost.",
    ],
    conclusion: "Buy 2 gallons for this example. The estimate is for ceiling paint only, before tax and preparation supplies.",
  },
  faq: [
    { question: "How much ceiling paint should I buy?", answer: "Measure the ceiling area, multiply by the number of coats, divide by the coverage on your paint label, and add an allowance for roller loss and touch-ups. This calculator does those steps and rounds up to whole gallons or liters." },
    { question: "Why does ceiling paint need extra waste?", answer: "Overhead work can leave more paint in the roller, tray, and drop cloth, and textured ceilings can absorb more product. The default 15% is a planning starting point; adjust it for texture, repairs, and your painting method." },
    { question: "Should I subtract light fixtures or vents?", answer: "Small fixtures and vents are usually left in the estimate because they still require cut-in work and do not materially reduce a typical ceiling order. Large skylights or openings should be measured as separate areas and deducted from the ceiling area before using the calculator." },
    { question: "Do I need one or two coats?", answer: "Two coats are a common starting point for an even finish, a color change, or a repaired ceiling. Follow the paint label and account for primer separately when the surface is bare, stained, or patched." },
    { question: "What changes when I switch to metric?", answer: "Feet become meters, square feet become square meters, and US gallons become liters. Coverage and price convert with them, while the underlying estimate remains equivalent. Whole-liter rounding can produce a different purchase count than whole-gallon rounding." },
    { question: "What does the estimated cost include?", answer: "The cost is the whole paint purchase multiplied by the price you enter. It excludes primer, rollers, extension poles, tape, drop cloths, labor, delivery, and sales tax." },
  ],
  related: [
    { slug: "paint", title: "Paint Calculator", description: "Estimate paint for the four walls around the ceiling you are refreshing." },
    { slug: "drywall", title: "Drywall Calculator", description: "Estimate ceiling board before painting a new or repaired ceiling surface." },
    { slug: "wallpaper", title: "Wallpaper Calculator", description: "Plan wallpaper rolls for the room walls after the ceiling work is complete." },
  ],
};
