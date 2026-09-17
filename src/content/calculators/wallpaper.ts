import type { CalculatorContent } from "../../lib/calculators/types";

export const wallpaperContent: CalculatorContent = {
  intro: "Plan wallpaper for four walls of a rectangular room. Enter your room and roll measurements to account for doors, windows, vertical pattern repeat, extra waste, full-height strips, and whole rolls.",
  howItWorks: [
    { title: "Measure the room", text: "Enter the room length, width, and wall height, then adjust the average door and window sizes if needed." },
    { title: "Read the roll label", text: "Use the physical roll width and length plus the vertical pattern repeat. Enter zero repeat for a plain or non-repeating design." },
    { title: "Plan whole rolls", text: "We calculate pattern-aligned drops, full-height strips, strips per roll, and the whole rolls required after extra waste." },
  ],
  formulas: [
    { label: "Net Wall Area", expression: "2 × (room length + room width) × wall height − openings" },
    { label: "Adjusted Drop", expression: "Wall height rounded up to the next full vertical pattern repeat" },
    { label: "Strips per Roll", expression: "Round down (roll length ÷ adjusted drop)" },
    { label: "Full-height Strips", expression: "Round up ((net wall area × (1 + waste ÷ 100)) ÷ strip coverage)" },
    { label: "Rolls Needed", expression: "Round up (full-height strips ÷ strips per roll)" },
    { label: "Estimated Cost", expression: "rolls needed × price per roll" },
  ],
  example: {
    description: "A 12 × 10 ft room with 8 ft walls, one 3 × 7 ft door, two 3 × 4 ft windows, 20.5 in × 33 ft rolls, a 20.5 in repeat, 10% extra waste, and a $40 roll price.",
    steps: [
      "Walls: 2 × (12 + 10) × 8 = 352 sq ft; subtract 45 sq ft of openings for 307 sq ft net.",
      "A 20.5 in repeat rounds the 8 ft wall height up to a 102.5 in (8.54 ft) drop.",
      "A 33 ft roll yields 3 complete pattern-aligned drops.",
      "After 10% extra waste, 337.7 sq ft requires 25 full-height strips at 20.5 in wide.",
      "25 ÷ 3 = 8.33 rolls; round up to 9 rolls.",
      "9 × $40 = $360 in wallpaper.",
    ],
    conclusion: "Buy 9 rolls from the same print batch. The wallpaper estimate is $360 before tax and installation supplies.",
  },
  faq: [
    { question: "How does pattern repeat affect the estimate?", answer: "Each full-height strip must begin at a compatible point in the vertical pattern. The calculator rounds the wall height up to a full repeat before finding how many strips fit in a roll. Enter zero when the design has no vertical repeat." },
    { question: "What about straight match, drop match, or random match?", answer: "The vertical repeat is modeled, but the match type and starting offset are not. Half-drop and complex matches may need more material; increase Extra Waste and follow the manufacturer's guidance." },
    { question: "Should I subtract doors and windows?", answer: "The calculator deducts their area. Openings do not always save complete strips because their placement matters, so the extra waste allowance should cover unusable offcuts and interrupted drops." },
    { question: "What is a single roll or double roll?", answer: "Retail terminology varies. Enter the physical width and total length printed on the package you will buy, and enter its actual price. The calculator treats that package as one purchasable roll." },
    { question: "Should all rolls come from the same batch?", answer: "Yes when possible. Wallpaper from different print or dye batches can have visible color variation, so check the batch code before purchasing or opening rolls." },
    { question: "What does the estimated cost include?", answer: "Only whole wallpaper rolls at the price you enter. Primer, sizing, adhesive, tools, delivery, labor, and tax are excluded." },
  ],
  related: [
    { slug: "paint", title: "Paint Calculator", description: "Compare wallpaper with a painted finish for the same four walls." },
    { slug: "drywall", title: "Drywall Calculator", description: "Estimate wallboard before preparing a new surface for wallpaper." },
  ],
};
