import type { CalculatorContent } from "../../lib/calculators/types";

export const paintContent: CalculatorContent = {
  intro: "How much paint do I need? Start with your room measurements. This room paint calculator subtracts doors and windows, accounts for each coat and a little extra, then turns the estimate into a purchase quantity and paint budget.",
  howItWorks: [
    { title: "Measure the room", text: "Enter the length, width, and wall height. This estimate covers four rectangular walls. Count the doors and windows you will not paint; adjust their average sizes if needed." },
    { title: "Check the paint label", text: "Use the coverage rate for one coat on your chosen product. Two coats and 10% waste are starting assumptions; porous or textured walls may need more paint." },
    { title: "Plan your purchase", text: "Read the paint needed including waste, then buy the rounded amount. Gallons and liters are rounded up to whole units. Match that amount to the cans available at your store." },
  ],
  formulas: [
    { label: "Wall Area", expression: "2 × (room length + room width) × wall height" },
    { label: "Door Area", expression: "number of doors × door width × door height" },
    { label: "Window Area", expression: "number of windows × window width × window height" },
    { label: "Paintable Area", expression: "wall area − door area − window area" },
    { label: "Paint Needed", expression: "(paintable area × coats ÷ coverage) × (1 + waste % ÷ 100)" },
    { label: "Recommended Purchase", expression: "paint needed rounded up to the next whole gallon or liter" },
    { label: "Estimated Material Cost", expression: "recommended purchase × price per gallon or liter" },
  ],
  example: {
    description: "A 14 × 12 ft room with 8 ft walls, one 3 × 7 ft door, and two 3 × 4 ft windows. Use two coats, 350 sq ft per gallon, 10% waste, and paint priced at $45 per gallon.",
    steps: [
      "Walls: 2 × (14 + 12) × 8 = 416 sq ft.",
      "Openings: (1 × 3 × 7) + (2 × 3 × 4) = 45 sq ft.",
      "Paintable area: 416 − 45 = 371 sq ft.",
      "Two coats: 371 × 2 ÷ 350 = 2.12 gallons.",
      "With 10% waste: 2.12 × 1.10 = 2.332 gallons.",
    ],
    conclusion: "Buy 3 gallons. At $45 per gallon, the estimated paint cost is $135, before tax and supplies.",
  },
  faq: [
    { question: "How much wall area does a gallon of paint cover?", answer: "This paint coverage calculator starts at 350 sq ft per gallon for one coat. Actual coverage depends on the product, wall texture, and how it is applied. Replace the default with the coverage printed on your paint can." },
    { question: "Should I subtract doors and windows?", answer: "Yes, if you are not painting them with the wall paint. The calculator subtracts 21 sq ft per door and 12 sq ft per window by default. Open Door & window sizes to enter the average dimensions for your room. Set a count to zero when there are none." },
    { question: "Does this include ceilings, trim, and primer?", answer: "It covers walls only. Ceilings and trim often need a different finish, and primer has its own coverage rate. Primer appears on the shopping list as an optional preparation item; its quantity and price are not included in this estimate." },
    { question: "Why add waste and round the purchase up?", answer: "Paint remains on rollers, brushes, and trays, and you may want some for touch-ups. The waste allowance adds that margin before the purchase quantity is rounded up. For example, 2.37 gallons becomes a recommendation to buy 3 gallons." },
    { question: "What changes when I switch to metric?", answer: "Feet become meters, square feet become square meters, and US gallons become liters. Coverage and the USD price per unit convert too. The underlying paint requirement stays equivalent, but the rounded purchase and cost can change because one gallon and one liter are different purchase increments." },
    { question: "What is included in the material cost?", answer: "The cost is the rounded paint purchase multiplied by your entered price. It excludes primer, tools, tape, drop cloths, labor, and sales tax. Prices are entered by you and are not fetched from retailers." },
  ],
  related: [
    { slug: "flooring", title: "Flooring Calculator", description: "Plan floor area, waste, and the number of flooring boxes to buy." },
    { slug: "drywall", title: "Drywall Calculator", description: "Estimate sheets and material cost before preparing walls for paint." },
  ],
};
