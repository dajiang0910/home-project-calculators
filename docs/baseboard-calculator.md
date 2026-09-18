# Baseboard Calculator

Published at `/calculators/baseboard` through the shared registry-driven route. It estimates baseboard trim for one rectangular room with a continuous run; door casing, closets, stairs, transitions, labor, tax, and supplies are excluded from the cost estimate.

## Inputs and defaults

Defaults belong to `src/lib/calculators/baseboard/config.ts`: US units; room length 14 ft, width 12 ft; 1 door opening at 3 ft wide; 8 ft baseboard pieces; 10% waste; and $18 per piece. Room dimensions, door count, door width, stock length, waste, and price are editable. Door widths are shared averages for the entered opening count.

## Units and purchase policy

US mode uses feet and USD per piece. Metric mode uses meters and the same USD per piece price. Switching converts room, opening, and stock-piece lengths using 1 ft = 0.3048 m; door count, waste, and price stay unchanged. Converted lengths are rounded to six decimal places so repeated switches remain stable.

Pieces are sold as complete stock lengths. The recommendation adds waste once, then rounds up to the next whole piece. An 8-machine-epsilon tolerance relative to the piece count prevents floating-point noise from adding a piece at an exact boundary; a real shortage still rounds up.

## Calculation and reference example

- Room perimeter = 2 × (room length + room width).
- Opening length = number of doors × door opening width.
- Net wall run = room perimeter − opening length.
- Baseboard needed = net wall run × (1 + waste / 100).
- Pieces needed = ceiling(baseboard needed ÷ stock-piece length).
- Estimated material cost = pieces needed × price per piece.

Reference: a 14 × 12 ft room has a 52 ft perimeter. Subtract one 3 ft doorway for a 49 ft run. With 10% waste, the estimate is 53.9 ft. At 8 ft per piece, that becomes 7 pieces; at $18 per piece, estimated baseboard cost is $126.

## Validation and product boundaries

Room dimensions accept 0.01–1,000 ft (equivalent metric limits), stock-piece length accepts 0.1–100 ft, door count accepts whole numbers from 0–10,000, door width accepts 0.01–1,000 ft, waste accepts 0–100%, and price accepts $0–$100,000 per piece. Empty values, malformed numbers, booleans, non-finite values, and out-of-range values are rejected for active inputs. When the door count is zero, the unused door width is hidden and ignored. The combined door opening width cannot exceed the room perimeter; equal coverage is allowed and produces zero pieces. Direct invalid calculation calls throw `RangeError`.

The estimate does not model door or window casing, base shoe, crown molding, closets, stair runs, angled or curved walls, exact miter/coping layouts, profile-specific joins, retailer stock lengths, labor, delivery, or tax. Use the waste allowance for cuts and short leftovers. Irregular rooms should be split into wall runs and combined before piece rounding when they share one order.

The shopping list includes Baseboard, Fasteners or Adhesive, Paintable Caulk, Touch-up Paint or Finish, Miter & Coping Tools, and Measuring & Protection. Only full baseboard pieces are priced.

Contract tests cover the reference calculation, door deductions, waste and piece boundaries, price, direct metric entry, repeated unit switches, numeric parsing, invalid inputs, zero-run handling, formatting, content, and registration. Run `npm test`, `npm run lint`, and `npm run build`; verify the dynamic route and responsive layout in a browser.
