# Home Project Calculators Design System

The calculator pages share a compact blue and white planning UI based on `docs/design-reference/paintCalculator.png`. The system keeps business definitions independent from presentation: calculators provide fields, validation, calculation, formatted results, shopping items, and content; shared React components render those values.

## Tokens

Tokens live in `src/styles/tokens.css` and are imported by `app/globals.css`. Semantic colors use `--hpc-color-*`; spacing uses the 4px scale from `--hpc-space-1` through `--hpc-space-16`; controls are 44px high; controls use a 6px radius and cards an 8px radius. Geist Sans remains the only application font. The Calculator root forces a light theme so the page does not inherit the starter dark-mode media query.

## Page composition

`SiteHeader → Breadcrumb → CalculatorHero → CalculatorForm → ResultCard → ShoppingList → CalculatorGuide → SiteFooter` is the canonical order. `CalculatorClient` owns raw input state and the validation/calculation pipeline. It passes display-ready values into the shared components and never recalculates in JSX.

Hero art is presentation-only and lives in `public/images/calculators/`; each published calculator uses a local generated asset with no text, product branding, or business data. The art is hidden on narrow screens so it never competes with the form.

## Component rules

- `FormField` renders every definition field, including unit labels, help text, and field errors. `UnitToggle` only emits a selected value; unit conversion stays in the calculator definition.
- `ResultMetric` renders `ResultItem`; `CostEstimate` is a visual wrapper and never computes cost.
- `ShoppingList` displays the static list supplied by a definition. It must not invent quantities for tools or supplies.
- `InfoCard`, `FormulaCard`, `ExampleCard`, `FAQ`, and `RelatedCalculatorCard` consume `CalculatorContent` and preserve its text.
- New visual differences belong in presentation metadata, not in Paint or Flooring calculation types.

## Responsive behavior

The page is single column below 1024px, uses a form/results split from 1024px, and expands fields and metric cards to three columns at 1200px. Guide cards use one column below 640px, two columns from 640px, and three columns from 768px. All layouts must remain usable at 375px and at 200% zoom.

The reference screenshot guides hierarchy, blue accent usage, compact bordered cards, and the unit toggle. Its example values and any unbacked shopping quantities are not product behavior; existing calculator contracts remain authoritative.
