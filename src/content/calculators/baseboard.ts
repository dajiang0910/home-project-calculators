import type { CalculatorContent } from "../../lib/calculators/types";

export const baseboardContent: CalculatorContent = {
  intro: "How much baseboard do I need? Enter the length and width of your room, subtract the door openings, then add a practical allowance for miter cuts, inside corners, and spare material.",
  howItWorks: [
    { title: "Measure the room", text: "Enter the length and width of one rectangular room. The calculator turns those dimensions into the full wall perimeter." },
    { title: "Count the door openings", text: "Enter the number of doorways where baseboard will stop and the width of one opening. Door casing itself is not included in the trim run." },
    { title: "Match your trim pieces", text: "Use the full length and price of one baseboard piece. We add your waste allowance and round up to complete pieces." },
  ],
  formulas: [
    { label: "Room Perimeter", expression: "2 × (room length + room width)" },
    { label: "Net Wall Run", expression: "room perimeter − (number of doors × door opening width)" },
    { label: "Baseboard Needed", expression: "net wall run × (1 + waste ÷ 100)" },
    { label: "Pieces Needed", expression: "round up (baseboard needed ÷ length per piece)" },
    { label: "Estimated Cost", expression: "pieces needed × price per piece" },
  ],
  example: {
    description: "A 14 × 12 ft room with one 3 ft doorway, 8 ft baseboard pieces, 10% waste, and a price of $18 per piece.",
    steps: [
      "Room perimeter: 2 × (14 + 12) = 52 linear ft.",
      "Subtract one 3 ft doorway: 52 − 3 = 49 linear ft of baseboard run.",
      "Add 10% waste: 49 × 1.10 = 53.9 linear ft needed.",
      "53.9 ÷ 8 = 6.7375 pieces; round up to 7 pieces.",
      "7 × $18 = $126 estimated baseboard cost.",
    ],
    conclusion: "Buy 7 pieces. The baseboard estimate is $126 before tax, fasteners, finishing materials, and installation.",
  },
  faq: [
    { question: "Should I subtract door openings?", answer: "Yes. Baseboard typically stops at the door casing, so enter each opening where trim will not run. Do not subtract the width of the casing itself unless your measurement already excludes it." },
    { question: "How much baseboard waste should I add?", answer: "The default is 10%. Straight walls with few corners may need less, while many inside corners, outside corners, angled walls, short leftovers, or a first-time installation may need more. The allowance covers cuts and spare material, not additional rooms." },
    { question: "Does the calculator include door casing or window trim?", answer: "No. It estimates the baseboard run along the floor only. Door and window casing, crown molding, shoe molding, stair trim, and transitions should be measured separately." },
    { question: "What if my room is not rectangular?", answer: "Divide the room into wall runs or rectangles, add the baseboard lengths together, and use one combined order when possible. A detailed layout is better for alcoves, closets, bay windows, and stair walls." },
    { question: "Why round to full pieces?", answer: "Baseboard is normally sold in full lengths. The calculator adds waste before dividing by your stock length so the recommendation reflects complete pieces available to buy." },
    { question: "What does the estimated cost include?", answer: "Only the full baseboard pieces at the price you enter. Fasteners, adhesive, caulk, paint or stain, tools, delivery, labor, and tax are excluded." },
  ],
  related: [
    { slug: "flooring", title: "Flooring Calculator", description: "Plan the floor area and flooring boxes for the same room." },
    { slug: "paint", title: "Paint Calculator", description: "Estimate paint for the four walls after the trim measurements are complete." },
    { slug: "ceiling-paint", title: "Ceiling Paint Calculator", description: "Estimate paint for the ceiling before finishing the room trim." },
  ],
};
