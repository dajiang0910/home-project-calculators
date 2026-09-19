import type { CalculatorContent } from "../../lib/calculators/types";
import { flooringExample } from "./examples";

export const flooringContent: CalculatorContent = {
  intro: "Plan your next floor with confidence. Enter your room size and box coverage to estimate flooring, allow for waste, and see how many boxes to buy.",
  howItWorks: [
    { title: "Measure your floor", text: "Enter the length and width of a rectangular room in feet or meters." },
    { title: "Check your flooring box", text: "Enter coverage per box, your waste allowance, and the price of one box." },
    { title: "Plan your purchase", text: "We add waste, round up to full boxes, and multiply by your box price." },
  ],
  formulas: [
    { label: "Floor Area", expression: "Room length × room width" },
    { label: "Required Area With Waste", expression: "Floor area × (1 + waste ÷ 100)" },
    { label: "Boxes Needed", expression: "Round up (required area ÷ coverage per box)" },
    { label: "Estimated Cost", expression: "Boxes needed × price per box" },
  ],
  example: flooringExample,
  faq: [
    { question: "How much waste should I allow?", answer: "The editable default is 10%. Cuts, layout, and patterns affect waste; use the allowance recommended for your product and installation." },
    { question: "Does switching units change the number of boxes?", answer: "No. We convert room dimensions and coverage together. The same physical box keeps the same price in USD." },
    { question: "Can I estimate an irregular room?", answer: "Split it into rectangles and estimate each section separately. Rounding each section can produce more spare boxes than a combined order." },
    { question: "What does the cost include?", answer: "Full boxes of flooring only. Underlayment, transitions, tools, adhesive, labor, delivery, and tax are excluded." },
  ],
  related: [
    { slug: "paint", title: "Paint Calculator", description: "Estimate paint and material cost for the walls around your new floor." },
    { slug: "tile", title: "Tile Calculator", description: "Estimate individual tiles, full boxes, waste, and material cost." },
    { slug: "baseboard", title: "Baseboard Calculator", description: "Estimate trim pieces around the perimeter of the same room." },
  ],
};
