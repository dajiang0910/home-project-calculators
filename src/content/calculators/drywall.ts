import type { CalculatorContent } from "../../lib/calculators/types";
import { drywallExample } from "./examples";

export const drywallContent: CalculatorContent = {
  intro: "Plan drywall for a rectangular room without guesswork. Choose walls, ceiling, or both; subtract doors and windows; then estimate full sheets and material cost with a waste allowance.",
  howItWorks: [
    { title: "Choose the surfaces", text: "Select walls, the ceiling, or both, then enter the room dimensions in feet or meters." },
    { title: "Match your sheets", text: "Enter the length and width of the drywall sheets available for your project, plus the average door and window sizes." },
    { title: "Plan the purchase", text: "We deduct wall openings, add waste, divide by sheet coverage, and round up to full sheets." },
  ],
  formulas: [
    { label: "Wall Area", expression: "2 × (room length + room width) × wall height" },
    { label: "Opening Area", expression: "door area + window area" },
    { label: "Drywall Area", expression: "selected wall area − openings + selected ceiling area" },
    { label: "Area With Waste", expression: "drywall area × (1 + waste ÷ 100)" },
    { label: "Sheets Needed", expression: "Round up (area with waste ÷ area per sheet)" },
    { label: "Estimated Cost", expression: "sheets needed × price per sheet" },
  ],
  example: drywallExample,
  faq: [
    { question: "How much drywall waste should I allow?", answer: "The editable default is 10%. Simple rooms with a planned layout may need less; many corners, small sections, damaged sheets, or difficult access may require more." },
    { question: "Should I subtract doors and windows?", answer: "This calculator deducts them when walls are selected. For small openings, some installers leave them in the estimate because offcuts may not fit elsewhere; raise the waste allowance if your layout produces unusable pieces." },
    { question: "Which drywall sheet size should I use?", answer: "Enter the exact sheet length and width you expect to buy. Larger sheets can reduce seams but are heavier and may be difficult to move into the room. Confirm available sizes, thickness, and board type with your supplier." },
    { question: "Why can an area estimate differ from a sheet layout?", answer: "Area division assumes offcuts can be reused efficiently. Real layouts depend on framing, sheet orientation, seam placement, openings, and handling. The waste allowance adds a planning margin but does not replace a panel layout." },
    { question: "Does the cost include finishing materials or labor?", answer: "No. The estimate prices full drywall sheets only. Tape, compound, fasteners, corner bead, tools, delivery, labor, and tax are excluded." },
  ],
  related: [
    { slug: "paint", title: "Paint Calculator", description: "Estimate paint after the drywall is finished and ready for coating." },
    { slug: "wallpaper", title: "Wallpaper Calculator", description: "Estimate rolls for a finished wall surface, including pattern repeat." },
    { slug: "ceiling-paint", title: "Ceiling Paint Calculator", description: "Estimate paint for a new or repaired rectangular ceiling." },
    { slug: "flooring", title: "Flooring Calculator", description: "Plan the floor area, waste, boxes, and material cost for the same room." },
    { slug: "baseboard", title: "Baseboard Calculator", description: "Estimate trim pieces after the wallboard is installed." },
  ],
};
