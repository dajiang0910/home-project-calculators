# Calculator specification

## Definition shape

Every published calculator must provide:

- a unique lowercase `slug`;
- English `title`, `description`, `category`, and SEO keywords;
- a field list with labels, input type, unit, and required state;
- `createInitialInput()` for deterministic form state;
- `validate(input)` returning field-level errors or a typed value;
- `calculate(input)` as a pure function;
- `formatResult(result)` returning labeled display values.

## Validation rules

Validation must reject empty required values, non-finite numbers, invalid choices, and domain values outside the calculator's documented range. Errors should identify the field and explain how to correct it. Form components must not duplicate these rules.

## Units, precision, and rounding

Inputs and outputs must state their units. Conversion belongs at the domain boundary, not in shared form components. Calculations should retain sufficient precision internally and apply documented rounding only when producing a purchase or recommendation value.

## Paint Calculator specification (phase two)

The first concrete calculator will use imperial defaults: room length, room width, wall height, opening area, coats, coverage per gallon, and optional waste rate. It will calculate wall area, subtract openings, multiply by coats, divide by coverage, apply waste, and round the recommended gallons up to a whole purchase unit.

The result should include paintable area, total coverage area, unrounded gallons, and recommended gallons. It must reject non-positive dimensions or coverage, negative openings or waste, and openings larger than the wall area. Formula code belongs in `src/lib/calculators/paint/`; the registry entry is the only framework integration point.

## New calculator checklist

1. Write the calculator-specific inputs, units, assumptions, and rounding rules.
2. Implement pure types, validation, calculation, and result formatting.
3. Add the definition to the central registry with a stable slug.
4. Add contract and edge-case tests.
5. Verify the dynamic route, metadata, keyboard form flow, errors, and responsive result layout.
6. Run `npm run lint` and `npm run build`.
