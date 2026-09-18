# Calculator specification

## Published calculator shape

Every published calculator must provide:

- a unique lowercase `slug`;
- a manifest entry with English title, description, category, SEO keywords, summary, image, and hero treatment;
- an explicit engine loader and server-side content loader;
- a field list with labels, input type, unit, and required state;
- `createInitialInput()` for deterministic form state;
- `validate(input)` returning field-level errors or a typed value;
- `calculate(input)` as a pure function;
- `formatResult(result)` returning display values with stable `id` and semantic `kind` (`primary`, `cost`, or `metric`).

The engine must not import catalog metadata or educational content. The manifest in `src/lib/calculators/registry.ts` is the only publication entry; discovery data is derived from it, and `src/lib/calculators/runtime.ts` owns the explicit client-safe engine loaders.

## Validation rules

Validation must reject empty required values, non-finite numbers, invalid choices, and domain values outside the calculator's documented range. Errors should identify the field and explain how to correct it. Form components must not duplicate these rules.

## Units, precision, and rounding

Inputs and outputs must state their units. Conversion belongs at the domain boundary, not in shared form components. Calculations should retain sufficient precision internally and apply documented rounding only when producing a purchase or recommendation value.

## Paint Calculator specification (phase two)

The implemented [Paint specification](paint-calculator.md) defines editable defaults, door/window assumptions, US and metric units, coverage and price conversion, purchase rounding, the paint-only cost estimate, static shopping recommendations, and validation limits. Formula code lives in `src/lib/calculators/paint/`; the definition is published once in the registry and rendered through the existing dynamic route.

## Tile Calculator specification

The implemented [Tile specification](tile-calculator.md) defines surface and tile dimensions, US and metric input conventions, waste, whole-tile and full-box rounding, box pricing, validation limits, and excluded layout assumptions. Formula code lives in `src/lib/calculators/tile/`; the definition is published once in the registry and rendered through the shared dynamic route.

## Drywall Calculator specification

The implemented [Drywall specification](drywall-calculator.md) defines selectable wall and ceiling coverage, opening deductions, sheet dimensions, US and metric inputs, waste, full-sheet rounding, sheet pricing, validation limits, and excluded layout assumptions. Formula code lives in `src/lib/calculators/drywall/`; the definition is published once in the registry and rendered through the shared dynamic route.

## Wallpaper Calculator specification

The implemented [Wallpaper specification](wallpaper-calculator.md) defines room and opening measurements, physical roll dimensions, vertical pattern repeat, extra waste, separate strip and roll rounding, roll pricing, US and metric inputs, validation limits, and excluded match/layout assumptions. Formula code lives in `src/lib/calculators/wallpaper/`; the definition is published once in the registry and rendered through the shared dynamic route.

## Ceiling Paint Calculator specification

The implemented [Ceiling Paint specification](ceiling-paint-calculator.md) defines a rectangular ceiling surface, coats, paint coverage, overhead-work waste, whole-gallon or whole-liter purchase rounding, price conversion, US and metric inputs, validation limits, and excluded fixture/layout assumptions. Formula code lives in `src/lib/calculators/ceiling-paint/`; the definition is published once in the registry and rendered through the shared dynamic route.

## Baseboard Calculator specification

The implemented [Baseboard specification](baseboard-calculator.md) defines a rectangular room perimeter, door-opening deductions, stock piece length, cut waste, whole-piece rounding, piece pricing, US and metric inputs, validation limits, and excluded trim/layout assumptions. Formula code lives in `src/lib/calculators/baseboard/`; the definition is published once in the registry and rendered through the shared dynamic route.

## New calculator checklist

1. Write the calculator-specific inputs, units, assumptions, and rounding rules.
2. Implement pure types, validation, calculation, and result formatting.
3. Add and pass contract and edge-case tests, including stable result ids/kinds.
4. Add one manifest entry and explicit engine/content loaders to the central registry; do not add a second catalog entry.
5. Verify the dynamic route, category hub, sitemap entry, metadata, search flow, errors, unit conversion, and responsive result layout.
6. Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and the relevant Playwright smoke tests.
