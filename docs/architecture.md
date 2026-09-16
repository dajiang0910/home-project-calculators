# Calculator framework architecture

## Goals

The framework is designed for 50–100 calculators without duplicating routing and interaction code. A calculator is a typed definition with pure functions; React components provide the shared interaction shell.

## Runtime boundaries

`app/calculators/[slug]/page.tsx` is a Server Component. It awaits the Next.js 16 `params` promise, looks up the slug, calls `notFound()` for unknown entries, and derives page metadata from the registry.

`CalculatorClient.tsx` is the client boundary because it owns input state and event handlers. It receives only the slug, then resolves the definition in the client bundle. This avoids passing functions across the Server Component boundary.

`CalculatorShell.tsx` renders shared structure for headings, fields, errors, and results. It contains no domain formulas.

## Definition contract

`CalculatorDefinition<TInput, TResult>` contains metadata, field descriptions, an initial input factory, `validate`, `calculate`, and `formatResult`. The three functions are framework-independent and can be tested without React or Next.js.

## Registry and extension flow

`src/lib/calculators/registry.ts` is the single registration point. It is intentionally empty in phase one. A future calculator lives in its own directory, exports one definition, and adds one registry entry. Listing and lookup helpers provide the foundation for catalog pages, navigation, and sitemap generation.

## Error and result flow

Validation returns either a typed value or a map of field names to English messages. The client does not calculate invalid input. Valid input goes through `calculate`, and `formatResult` converts domain output into display-ready labeled values with units and optional detail text.

## Scaling rules

- Keep domain code grouped by calculator, not by UI component.
- Keep shared components generic and free of domain terminology.
- Use stable slugs and avoid route-specific imports in formulas.
- Add contract tests for every definition as the test runner is introduced.
- Introduce a runtime schema library only when shared form generation requires it; the initial framework uses TypeScript plus calculator-owned validation.
