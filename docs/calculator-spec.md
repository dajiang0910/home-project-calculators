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

The implemented [Paint specification](paint-calculator.md) defines editable defaults, door/window assumptions, US and metric units, coverage and price conversion, purchase rounding, the paint-only cost estimate, static shopping recommendations, and validation limits. Formula code lives in `src/lib/calculators/paint/`; the definition is published once in the registry and rendered through the existing dynamic route.

## New calculator checklist

1. Write the calculator-specific inputs, units, assumptions, and rounding rules.
2. Implement pure types, validation, calculation, and result formatting.
3. Add and pass contract and edge-case tests.
4. Add the definition to the central registry with a stable slug.
5. Verify the dynamic route, metadata, keyboard form flow, errors, and responsive result layout.
6. Run `npm run lint` and `npm run build`.
