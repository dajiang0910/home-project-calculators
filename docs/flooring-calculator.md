# Flooring Calculator

Published at `/calculators/flooring` through the existing registry and dynamic route. Estimates boxed flooring for one rectangular room. No shared contract, component, route, or Paint implementation changes are required.

## Inputs and units

Defaults: US / Imperial, room length 14 ft, room width 12 ft, coverage 23.8 sq ft per box, waste 10%, price $50 per box. Metric uses meters and m² per box. Currency remains USD; a box is the same package in both systems, so price and waste never change on unit switches. Convert lengths using 1 ft = 0.3048 m and coverage using 1 sq ft = 0.09290304 m². Retain conversion precision rather than rounding editable values at each switch.

Dimensions accept 0.01–1,000 ft (equivalent metric limits); coverage accepts 0.01–100,000 sq ft per box (equivalent metric limits); waste accepts 0–100%; price accepts $0–100,000 per box. Required inputs reject blanks, malformed numbers, booleans, non-finite values, and out-of-range values. Invalid text is preserved across unit changes. Direct invalid calculation calls throw RangeError.

## Calculation and display

- Floor area = length × width, in the selected area unit.
- Required area with waste = floor area × (1 + waste / 100).
- Boxes needed = ceiling(required area / coverage per box).
- Estimated cost = whole boxes needed × price per box.

Only floating-point noise within 8 machine epsilons relative to the box count is ignored at integer boundaries. Real shortages require another box. Area displays at most two decimal places; USD displays two. Never round area before calculating boxes.

Reference: 14 × 12 = 168 sq ft; adding 10% gives 184.8 sq ft; 184.8 / 23.8 = 7.7647… → 8 boxes. At the illustrative default $50/box, estimated cost is $400.

Shopping recommendations include Flooring (buy the calculated box count), Underlayment (if required), Transition Strips, Spacers, and Installation Supplies. Cost includes flooring boxes only, excluding tools, other supplies, delivery, labor, and tax. Irregular rooms should be split into rectangles and estimated separately; pattern-specific waste must follow the product requirements.

## Existing UI reuse

This checkout does not define standalone CalculatorForm, CalculatorResult, UnitToggle, WasteInput, CostEstimate, ShoppingList, or RelatedTools components. Their existing equivalents live in CalculatorClient (form, unit selector, waste field), CalculatorShell (results, cost, shopping list), and CalculatorGuide (related tools). Flooring uses those unchanged via its definition. The shopping list contract is static, so its Flooring entry refers to Boxes Needed above.

Contract tests cover the reference example, formatting, native metric inputs, conversions and repeated switches, purchase boundaries, waste, price, validation, and immutable defaults. The existing Paint test asserting that only Paint is registered becomes obsolete when Flooring is published; it is retained unchanged to honor the no-Paint-changes constraint.
