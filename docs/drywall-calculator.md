# Drywall Calculator

Published at `/calculators/drywall` through the shared registry-driven route. It estimates full drywall sheets for one rectangular room and uses the existing calculator form, result, shopping-list, and guide components without a calculator-specific page shell.

## Inputs and units

Defaults: US / Imperial, walls plus ceiling, a 12 × 10 ft room with 8 ft walls, one 3 × 7 ft door, two 3 × 4 ft windows, 4 × 8 ft sheets, 10% waste, and $15 per sheet. The project selector supports walls plus ceiling, walls only, or ceiling only. Openings are deducted only when walls are selected.

Metric mode uses meters and m². Switching converts room, sheet, door, and window dimensions with 1 ft = 0.3048 m, limiting editable converted values to six decimal places. Counts, project selection, waste, and USD price per sheet stay unchanged.

Room and opening dimensions accept 0.01–1,000 ft and sheet dimensions accept 0.1–100 ft, with equivalent metric limits. Door and window counts accept whole numbers from 0–10,000, waste accepts 0–100%, and price accepts $0–100,000 per sheet. Required active inputs reject blanks, malformed numbers, booleans, non-finite values, and out-of-range values. Ceiling-only mode hides and ignores wall height and all opening inputs; a zero door or window count hides and ignores that opening type's dimensions. Invalid text survives unit switches. Direct invalid calculations throw `RangeError`.

## Calculation and rounding

- Gross wall area = 2 × (room length + room width) × wall height.
- Opening area = total door area + total window area.
- Drywall area = selected wall area − openings + selected ceiling area.
- Area with waste = drywall area × (1 + waste ÷ 100).
- Sheet area = sheet length × sheet width.
- Sheets needed = ceiling(area with waste ÷ sheet area).
- Estimated cost = sheets needed × price per sheet.

Only floating-point noise within 8 machine epsilons relative to the sheet count is ignored at exact whole-sheet boundaries. A real shortage requires another sheet. Zero net area produces zero sheets and zero cost. Areas display at most two decimal places and USD displays two; no area is rounded before calculating sheets.

Reference: a 12 × 10 × 8 ft room has 352 sq ft of walls. One door and two windows deduct 45 sq ft; the 120 sq ft ceiling brings drywall area to 427 sq ft. Adding 10% gives 469.7 sq ft. Dividing by 32 sq ft per 4 × 8 sheet gives 14.68 → 15 sheets. At $15 per sheet, estimated cost is $225.

## Product boundaries

This is an area-based planning estimate. It does not create a panel layout or model sheet orientation, stud spacing, seam placement, staggered joints, unusable offcuts, specialty board, thickness, multi-layer assemblies, labor, delivery, or tax. The waste input provides a planning margin but does not replace a layout. Door and window openings larger than the wall area are rejected when walls are included.

Shopping recommendations include Drywall Sheets, Joint Tape, Joint Compound, Drywall Screws or Nails, Corner Bead, and Tools & Safety Gear. Only drywall sheets are priced because quantities for finishing materials and fasteners depend on the assembly and installation method.

Contract tests cover the reference example, project modes, opening deductions, waste and sheet rounding, zero-area behavior, cost, direct metric input, unit conversions and repeated switches, validation, immutable defaults, formatting, content, and registration.
