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

`src/lib/calculators/registry.ts` is the single registration point. Phase two publishes Paint after its specification and contract tests are ready. Each calculator lives in its own directory, exports one definition, and adds one registry entry. Listing and lookup helpers drive static route generation; unknown slugs, including inherited object property names, resolve to 404.

## Error and result flow

Validation returns either a typed value or a map of field names to English messages. The client does not calculate invalid input. Valid input goes through `calculate`, and `formatResult` converts domain output into display-ready labeled values with units and optional detail text.

Phase two evaluates immediately on initial render and every input change. Form state retains raw numeric strings, including empty strings. `validate` accepts unknown input and returns a parsed domain value. Domain methods retain their generic input/result types; the registry erases those types at the lookup boundary, so consumers must keep validation, calculation, and formatting paired with the same definition.

Optional field groups and numeric bounds describe form presentation. `getFields(input)` resolves unit-dependent labels and bounds; `updateInput(input, name, value)` owns domain transformations such as unit conversion. The shared client only dispatches changes. `ResultItem.emphasis`, static shopping recommendations, and result notes supply presentation data without embedding formulas in React. No second unit or openings system was introduced: Paint owns its conversions and average opening sizes because phase one had neither abstraction.

Educational content lives in `src/content/calculators/` and is referenced by the definition. The dynamic route renders `CalculatorGuide` on the server and passes it through the client as a child slot. Related links are enabled only for published registry entries. Shared calculator CSS is scoped to a module; the starter homepage and global layout are unchanged.

## Shared UI design system

Published calculators use the composition `SiteHeader`, `Breadcrumb`, `CalculatorHero`, `CalculatorForm`, `ResultCard`, `ShoppingList`, `CalculatorGuide`, and `SiteFooter`. `CalculatorForm` delegates fields to `FormField` and groups to `FormSection`; `ResultCard` delegates display rows to `ResultMetric` and cost emphasis to `CostEstimate`. Guide content is split into `InfoCard`, `FormulaCard`, `ExampleCard`, `FAQ`, and `RelatedCalculatorCard`. These components consume the existing definition and content contracts and contain no business formulas.

Visual values are centralized in `src/styles/tokens.css`, imported by `app/globals.css`. Calculator-specific presentation may identify a hero treatment or result icon, but it must not create a second spacing, color, control, or breakpoint system. The reference image is a visual source only; calculation values, SEO metadata, routes, and shopping-list semantics come from the published definition.

## Scaling rules

- Keep domain code grouped by calculator, not by UI component.
- Keep shared components generic and free of domain terminology.
- Use stable slugs and avoid route-specific imports in formulas.
- Add contract tests before registering every definition. `npm test` compiles the pure TypeScript domain modules with the existing compiler and runs Node's built-in test runner; no testing framework dependency is needed.
- Introduce a runtime schema library only when shared form generation requires it; the initial framework uses TypeScript plus calculator-owned validation.

## V2 discovery and SEO foundation

`src/lib/calculators/catalog.ts` is the lightweight discovery source for the homepage, header, directory, category hubs, search, sitemap, and calculator metadata. Calculator definitions reference the catalog metadata object so titles, descriptions, categories, and keywords have one owner. `registry.ts` remains the only runtime registration point for formula implementations; a contract test keeps catalog and registry order aligned.

The public discovery path is `Home → /calculators → /calculators/categories/[category] → /calculators/[slug]`. Category hubs live under `/calculators/categories/` because the stable calculator slug `/calculators/flooring` would otherwise conflict with a Flooring category page. Only categories with at least one published calculator are statically generated and included in the sitemap. Planned categories remain catalog data until a tested calculator makes the hub useful.

Root layout metadata, canonical URLs, sitemap, robots, and structured data use `src/lib/seo/`. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin; local development falls back to `http://localhost:3000`. The homepage emits `WebSite` and `Organization` JSON-LD. Calculator, directory, and category pages emit `BreadcrumbList` JSON-LD.

The root layout owns the shared `SiteHeader` and `SiteFooter`. Calculator pages retain their registry-driven dynamic route and shared calculator composition without duplicating global site chrome.
