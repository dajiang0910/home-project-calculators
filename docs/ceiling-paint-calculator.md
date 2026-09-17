# Ceiling Paint Calculator

Published at `/calculators/ceiling-paint` through the shared registry-driven route. It estimates paint for one rectangular ceiling surface; walls, trim, crown molding, labor, tax, and supplies are excluded from the cost estimate.

## Inputs and defaults

Defaults belong to `src/lib/calculators/ceiling-paint/config.ts`: US units; ceiling length 14 ft, width 12 ft; 2 coats; 350 sq ft per US gallon per coat; 15% extra waste; and $45 per US gallon. The length, width, coat count, coverage, waste, and price are editable. The calculator intentionally does not model doors or windows because they belong to the walls, not the ceiling plane.

## Units and purchase policy

US mode uses feet, square feet, US gallons, and USD per gallon. Metric mode uses meters, square meters, liters, and USD per liter. Switching converts the two dimensions, coverage, and price; coats and waste are unchanged. The exact constants are 1 ft = 0.3048 m, 1 sq ft = 0.09290304 m², and 1 US gal = 3.785411784 L. Converted editable values are rounded to four decimal places for lengths and six for coverage and price.

Purchase increments are one US gallon or one liter. The recommendation rounds up once after adding waste. An 8-machine-epsilon tolerance relative to the purchase count prevents conversion noise from adding a package at an exact boundary; a real shortage still rounds up.

## Calculation and reference example

- Ceiling area = room length × room width.
- Total coverage = ceiling area × coats.
- Paint needed = (total coverage ÷ coverage per unit) × (1 + waste ÷ 100).
- Recommended purchase = paint needed rounded up to the next whole gallon or liter.
- Estimated material cost = recommended purchase × entered price per unit.

Reference: a 14 × 12 ft ceiling is 168 sq ft. Two coats require 336 sq ft of coverage. At 350 sq ft per gallon and 15% waste, the estimate is 1.104 gallons, so the recommendation is 2 gallons. At $45 each, estimated ceiling paint cost is $90.

## Validation and product boundaries

Dimensions accept 0.01–1,000 ft (equivalent metric limits), coats accept whole numbers from 1–20, coverage accepts 0.01–10,000 sq ft/gal (equivalent metric limits), waste accepts 0–100%, and price accepts $0.01–$100,000 per gallon (equivalent per-liter limits). Empty values, malformed numbers, booleans, non-finite values, and out-of-range values are rejected. Direct invalid calculation calls throw `RangeError`.

The estimate does not model skylights, large cutouts, fixture deductions, texture-specific coverage, primer, wall or trim paint, exact retailer can sizes, labor, delivery, or tax. Use the waste allowance for roller loss, cut-in work, texture, touch-ups, and overhead conditions. Large openings should be measured separately and deducted before entering the surface area.

The shopping list includes Ceiling Paint, Primer, Extension Pole & Roller, Angled Brush, Painter's Tape, and Drop Cloth. Only the rounded ceiling-paint purchase is priced.

Contract tests cover the reference calculation, coats and waste, purchase boundaries, price, direct metric entry, repeated unit switches, numeric parsing, invalid inputs, formatting, content, and registration. Run `npm test`, `npm run lint`, and `npm run build`; verify the dynamic route and responsive layout in a browser.
