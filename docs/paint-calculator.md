# Paint Calculator (phase two)

Published URL: `/calculators/paint`, resolved through the existing dynamic route and registry. Scope: the four walls of one rectangular room; excludes ceilings, trim, labor, tax, and supplies from the cost estimate.

## Inputs and defaults

Defaults belong to `src/lib/calculators/paint/config.ts`: US units; length 14 ft, width 12 ft, height 8 ft; 1 door, 2 windows; 2 coats; 350 sq ft per US gallon per coat; 10% waste; $45 per US gallon. Doors default to 3 × 7 ft and windows to 3 × 4 ft. All values, including the shared size for each type of opening, are editable. Different-sized openings can be approximated by average dimensions. No openings abstraction or conversion system existed in phase one.

## Units and purchase policy

US mode uses feet, square feet, US gallons, and USD per gallon. Metric mode uses meters, square meters, liters, and USD per liter. Switching converts existing dimensions, coverage, and price together; counts, coats, and waste are unchanged. Empty or invalid edits remain invalid across a switch. Internally, calculations use feet and US gallons; formatted values use the selected system. Exact constants: 1 ft = 0.3048 m; 1 US gal = 3.785411784 L. Values placed back in editable inputs are rounded to four decimal places for lengths and six for coverage and price, avoiding unwieldy floating-point strings while keeping the estimate stable. Unit definitions and conversions live only in the Paint domain module, ready to extract when a second calculator actually needs them.

Purchase increments are 1 US gallon or 1 liter, rounded upward once after waste. They are planning units, not a claim about every retailer's can sizes. Metric and US purchase totals and costs can differ because the purchase increments differ. A tolerance of one millionth of a purchase unit prevents conversion and input-display rounding from adding an entire package at an otherwise exact boundary; amounts materially above the boundary still round upward.

## Formulas and reference example

- Wall area = 2 × (length + width) × wall height.
- Door area = doors × door width × door height; window area = windows × window width × window height.
- Paintable area = wall area − door area − window area.
- Base paint = paintable area × coats ÷ coverage.
- Paint needed = base paint × (1 + waste / 100).
- Recommended purchase = ceiling(paint needed / purchase increment) × purchase increment.
- Estimated material cost = recommended purchase × entered price per matching unit.

Default example: 416 sq ft walls − 21 sq ft doors − 24 sq ft windows = 371 sq ft paintable; 742 sq ft for two coats; 2.12 gal before waste; 2.332 gal with waste; 3 gal to buy; $135 paint cost. The static shopping list includes Paint, Primer (if needed), Paint Roller, Paint Brush, Painter's Tape, and Drop Cloth. Only paint is priced.

## Validation and interaction

Evaluate on first render and every edit; never submit or navigate to obtain results. Keep raw text in form state so clearing a field does not become zero. Validation parses numeric strings and rejects empty values, booleans, non-decimal text, NaN, Infinity, negatives, and out-of-range values. Counts may be zero and must be integers; when a door or window count is zero, that opening type's unused dimensions are hidden and ignored. Coats must be an integer from 1–20. Waste accepts 0–100%. Dimensions are 0.01–1,000 ft (equivalent limits in meters), opening counts 0–10,000, coverage 0.01–10,000 sq ft/gal, and price $0.01–$100,000/gal. These broad limits prevent overflow and meaningless arithmetic while supporting residential work.

Openings larger than wall area produce a correction message. Equal areas are allowed and produce zero paint and zero cost. Direct invalid calls to `calculate` throw a RangeError; the UI only calculates successful validation results. Invalid form state removes the numeric estimate and shows inline errors plus a correction summary. Labels and errors are programmatically associated; results update in a polite live region.

## Content and acceptance

English content lives in `src/content/calculators/paint.ts` and renders on the server: intro, how it works, formulas, worked example, FAQs, and related calculators. Unpublished related calculators are explicitly marked Coming soon without dead links or registry entries.

Run `npm test`, `npm run lint`, and `npm run build`. Contract tests cover the reference example, waste, rounding boundaries, price, numeric parsing, invalid inputs, zero openings, oversized openings, metric equivalence, repeated unit switches, and editable opening sizes. Verify mobile and desktop layouts and live invalid-input recovery in a browser.
