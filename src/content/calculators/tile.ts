import type { CalculatorContent } from "../../lib/calculators/types";

export const tileContent: CalculatorContent = {
  intro: "Plan a tile floor or wall with confidence. Enter the surface size, one tile's dimensions, and the box details to estimate whole tiles, full boxes, and material cost.",
  howItWorks: [
    { title: "Measure the surface", text: "Enter the length and width of one rectangular floor or wall section in feet or meters." },
    { title: "Measure one tile", text: "Use the nominal tile length and width from the product listing, in inches or centimeters." },
    { title: "Plan full boxes", text: "We add your waste allowance, round to whole tiles, then round again to the full boxes the store sells." },
  ],
  formulas: [
    { label: "Surface Area", expression: "Surface length × surface width" },
    { label: "Area per Tile", expression: "Tile length × tile width, converted to the surface area unit" },
    { label: "Tiles Needed", expression: "Round up ((surface area ÷ tile area) × (1 + waste ÷ 100))" },
    { label: "Boxes Needed", expression: "Round up (tiles needed ÷ tiles per box)" },
    { label: "Estimated Cost", expression: "Boxes needed × price per box" },
  ],
  example: {
    description: "A 14 × 12 ft room using 12 × 12 in tile, with 10% waste, 12 tiles per box, and a $35 box price.",
    steps: [
      "14 × 12 = 168 sq ft of surface.",
      "Each 12 × 12 in tile covers 1 sq ft, so the base layout uses 168 tiles by area.",
      "168 × 1.10 = 184.8; round up to 185 tiles.",
      "185 ÷ 12 = 15.42 boxes; round up to 16 boxes, containing 192 tiles.",
      "16 × $35 = $560 in tile boxes.",
    ],
    conclusion: "Buy 16 boxes. The tile estimate is $560 before tax and installation supplies.",
  },
  faq: [
    { question: "How much tile waste should I add?", answer: "The editable default is 10%. Simple straight layouts may need less, while diagonal, herringbone, complex rooms, fragile tile, or strong pattern matching may need more. Follow your installer or product guidance." },
    { question: "Does grout spacing reduce the number of tiles?", answer: "This planner uses nominal tile area and does not subtract grout joints. That produces a practical material estimate without assuming a layout. Use a layout plan when exact row counts and edge cuts matter." },
    { question: "Why are tiles and boxes rounded separately?", answer: "Cuts and waste are counted in whole tiles first. Because stores usually sell sealed boxes, the tile total is then rounded up to the next full box." },
    { question: "Can I calculate an irregular room or several walls?", answer: "Split the project into rectangles and add their areas. For one combined order, use the total area so box rounding happens once; plan extra waste when sections have many corners or cutouts." },
    { question: "What does the estimated cost include?", answer: "Only full boxes of tile at the price you enter. Adhesive, mortar, grout, membranes, trim, tools, delivery, labor, and tax are excluded." },
  ],
  related: [
    { slug: "flooring", title: "Flooring Calculator", description: "Estimate boxed flooring from the coverage printed on the package." },
    { slug: "paint", title: "Paint Calculator", description: "Estimate paint for the walls around your tiled surface." },
  ],
};
