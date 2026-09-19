import type { CalculatorContent } from "../../lib/calculators/types";
import { wallpaperExample } from "./examples";

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
  example: wallpaperExample,
  faq: [
    { question: "How does pattern repeat affect the estimate?", answer: "Each full-height strip must begin at a compatible point in the vertical pattern. The calculator rounds the wall height up to a full repeat before finding how many strips fit in a roll. Enter zero when the design has no vertical repeat." },
    { question: "What about straight match, drop match, or random match?", answer: "The vertical repeat is modeled, but the match type, starting offset, and per-drop trim are not. Do not treat Extra Waste as a substitute for a half-drop or complex-pattern layout; follow the manufacturer's guidance and confirm the required rolls." },
    { question: "Should I subtract doors and windows?", answer: "The calculator deducts their area, but openings do not always save complete strips because placement matters. A percentage allowance cannot replace measuring each drop and planning how offcuts will be reused." },
    { question: "What is a single roll or double roll?", answer: "Retail terminology varies. Enter the physical width and total length printed on the package you will buy, and enter its actual price. The calculator treats that package as one purchasable roll." },
    { question: "Should all rolls come from the same batch?", answer: "Yes when possible. Wallpaper from different print or dye batches can have visible color variation, so check the batch code before purchasing or opening rolls." },
    { question: "What does the estimated cost include?", answer: "Only whole wallpaper rolls at the price you enter. Primer, sizing, adhesive, tools, delivery, labor, and tax are excluded." },
  ],
  related: [
    { slug: "paint", title: "Paint Calculator", description: "Compare wallpaper with a painted finish for the same four walls." },
    { slug: "drywall", title: "Drywall Calculator", description: "Estimate wallboard before preparing a new surface for wallpaper." },
  ],
};
