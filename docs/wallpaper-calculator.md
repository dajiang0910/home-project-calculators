# Wallpaper Calculator

Published at `/calculators/wallpaper` through the shared registry-driven route. It estimates full-height strips and purchasable wallpaper rolls for four walls of one rectangular room, using the existing calculator form, result, shopping-list, and guide components.

## Inputs and units

Defaults: US / Imperial, a 12 × 10 ft room with 8 ft walls, one 3 × 7 ft door, two 3 × 4 ft windows, a 20.5 in wide × 33 ft long roll, a 20.5 in vertical pattern repeat, 10% extra waste, and $40 per physical roll. Enter `0` pattern repeat for a plain or non-repeating design.

Metric mode uses meters for room and roll length, centimeters for roll width and pattern repeat, and m² for areas. Switching converts room and opening dimensions with 1 ft = 0.3048 m and roll width/repeat with 1 in = 2.54 cm. Editable converted values are limited to six decimal places. Counts, waste, and USD price per roll stay unchanged.

Room and opening dimensions accept 0.01–1,000 ft; roll length accepts 0.1–1,000 ft; roll width accepts 0.1–120 in; pattern repeat accepts 0–120 in, with equivalent metric limits. Door and window counts accept whole numbers from 0–10,000, extra waste accepts 0–100%, and price accepts $0–100,000 per roll. Required inputs reject blanks, malformed numbers, booleans, non-finite values, and out-of-range values. Invalid text survives unit switches. A roll too short for one adjusted drop is rejected. Direct invalid calculations throw `RangeError`.

## Calculation and rounding

- Gross wall area = 2 × (room length + room width) × wall height.
- Net wall area = gross wall area − door area − window area.
- Adjusted drop = wall height rounded upward to a whole vertical pattern repeat; with zero repeat it equals wall height.
- Strips per roll = floor(roll length ÷ adjusted drop).
- Area with extra waste = net wall area × (1 + waste ÷ 100).
- Full-height strips = ceiling(area with extra waste ÷ (roll width × wall height)).
- Rolls needed = ceiling(full-height strips ÷ strips per roll).
- Estimated cost = rolls needed × price per roll.

Strip count and roll count are rounded at separate purchase boundaries. Floating-point noise within 8 machine epsilons relative to a count is ignored; a real shortage requires the next strip or roll. Zero net wall area produces zero strips, rolls, and cost. Areas and lengths display at most two decimals and USD displays two.

Reference: a 12 × 10 × 8 ft room has 352 sq ft of walls. One door and two windows deduct 45 sq ft, leaving 307 sq ft. A 20.5 in repeat adjusts the 8 ft drop to 102.5 in (8.54 ft), so a 33 ft roll yields three complete strips. With 10% extra waste, 337.7 sq ft requires 25 full-height strips. At three strips per roll, 25 ÷ 3 = 8.33 → 9 rolls. At $40 per roll, estimated cost is $360.

## Product boundaries

This is a planning estimate, not a wall-by-wall hanging plan. It models vertical repeat but not straight, drop, half-drop, or random match offsets; starting position; opening placement; partial-strip reuse; irregular walls; sloped ceilings; murals; print-batch availability; labor; delivery; or tax. Retail terms such as single roll and double roll vary, so inputs must use the physical width, total length, and price of the package being purchased.

Shopping recommendations include Wallpaper, Wall Primer or Sizing, Wallpaper Adhesive, Smoothing Tool, Seam Roller, and Cutting & Layout Tools. Only wallpaper rolls are priced.

Contract tests cover the reference example, pattern-repeat effects, separate strip and roll rounding, waste, price, direct metric input, unit conversions and repeated switches, roll-length feasibility, opening validation, zero-area behavior, immutable defaults, formatting, content, and registration.
