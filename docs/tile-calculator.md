# Tile Calculator

Published at `/calculators/tile` through the shared registry-driven route. It estimates material for one rectangular floor or wall section; presentation is provided entirely by the shared calculator components.

## Inputs and units

Defaults: US / Imperial, surface 14 × 12 ft, tile 12 × 12 in, 10% waste, 12 tiles per box, and $35 per box. Metric uses meters for the surface and centimeters for tile dimensions. Switching units converts existing physical dimensions using 1 ft = 0.3048 m and 1 in = 2.54 cm, then limits editable converted dimensions to six decimal places. Waste, tiles per box, and USD price per box do not change.

Surface dimensions accept 0.01–1,000 ft and tile dimensions accept 0.1–120 in, with equivalent metric limits. Waste accepts 0–100%, tiles per box accepts whole numbers from 1–100,000, and price accepts $0–100,000 per box. Required inputs reject blanks, malformed numbers, booleans, non-finite values, and out-of-range values. Invalid text is preserved when units change. Direct invalid calculation calls throw `RangeError`.

## Calculation and rounding

- Surface area = surface length × surface width.
- Tile area = tile length × tile width, converted to sq ft or m².
- Exact tile count = surface area ÷ tile area.
- Tiles needed = ceiling(exact tile count × (1 + waste ÷ 100)).
- Boxes needed = ceiling(tiles needed ÷ tiles per box).
- Tiles purchased = boxes needed × tiles per box.
- Estimated cost = boxes needed × price per box.

Tile count and box count are rounded upward at separate purchase boundaries. Floating-point noise within 8 machine epsilons relative to either count is ignored, but a real shortage always requires the next tile or box. Areas display at most two decimals and USD displays two; no area is rounded before material quantities are calculated.

Reference: a 14 × 12 ft surface is 168 sq ft. A 12 × 12 in tile covers 1 sq ft, so 10% waste produces 184.8 → 185 tiles. At 12 tiles per box, that is 15.42 → 16 boxes, containing 192 tiles. At $35 per box, estimated tile cost is $560.

## Product boundaries

The calculator intentionally does not model grout-joint area, exact row layout, partial edge pieces, obstacles, pattern-specific cuts, dye-lot availability, labor, delivery, or tax. The editable waste allowance carries the planning margin. Irregular projects should be divided into rectangles and combined before box rounding when they will share one order.

Shopping recommendations include Tile, Mortar or Adhesive, Grout, Tile Spacers, Backer Board or Membrane, and Installation Supplies. Only tile boxes are priced.

Contract tests cover the reference example, separate tile and box rounding, waste and price behavior, direct metric entry, unit conversions and repeated switches, validation, immutable defaults, formatting, content, and registration.
