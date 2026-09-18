# Calculator framework architecture

## Goals

The framework supports 50–100 calculators without duplicating routing or interaction code. Domain engines remain framework-independent TypeScript modules; React components provide the shared interaction shell.

## Runtime boundaries

`app/calculators/[slug]/page.tsx` is a Server Component. It validates the slug against the publication manifest, loads metadata and educational content, generates SEO data, and renders the server-side `CalculatorGuide`.

`CalculatorClient.tsx` is the client boundary because it owns input state and event handlers. It receives only serializable manifest fields and the already-rendered guide slot. It loads the current engine through `src/lib/calculators/runtime.ts`, so the browser does not import the registry, other engines, or guide content.

The production flow is:

```text
registry.ts (server manifest)
  ├─ metadata, discovery, hero, category
  ├─ loadContent() → CalculatorGuide (server)
  └─ loadEngine() → runtime.ts → current calculator async chunk
```

The client shows a loading state while the engine arrives. A failed load preserves the server-rendered guide and offers a reload action. Slug changes reset input state and ignore stale loader results.

## Contracts

`CalculatorEngine<TInput, TResult>` contains fields, an initial input factory, optional field visibility and input-update hooks, `validate`, `calculate`, and `formatResult`. Engines do not import catalog metadata or educational content.

`CalculatorManifest` contains the public metadata, discovery summary, image, hero treatment, and explicit engine/content loaders. `registry.ts` is the only publication manifest. `catalog.ts`, static params, category pages, sitemap, and presentation lookup derive from it.

`ResultItem` has a stable `id`, display label/value, optional detail, and semantic `kind` (`primary`, `cost`, or `metric`). UI selection and React keys use these fields rather than display labels.

## Error and result flow

Validation returns either a typed value or field-level English messages. The client never calculates invalid input. Valid input goes through the same engine's `calculate` and `formatResult` functions. Raw input strings, including empty or malformed edits, remain in form state.

`numeric.ts` owns finite-number parsing and purchase rounding. `shared.ts` owns reusable numeric validation, safe numeric conversion, and number/currency formatting. Calculator modules retain domain bounds, opening constraints, unit factors, waste rules, and purchase policy.

## Shared UI and content

Published calculators use `SiteHeader`, `Breadcrumb`, `CalculatorHero`, `CalculatorForm`, `ResultCard`, `ShoppingList`, `CalculatorGuide`, and `SiteFooter`. Components contain no business formulas. Guide content lives in `src/content/calculators/` and is loaded only from the server route through the `server-only` `content-loader.ts` boundary.

Visual values remain centralized in `src/styles/tokens.css`. Hero images and treatments come from the manifest; calculator-specific UI does not create a second spacing, color, control, or breakpoint system.

## Scaling and verification

- Keep domain code grouped by calculator and loaders explicit; do not use a variable dynamic import path.
- Add a specification and contract tests before publishing a slug.
- Use `npm test` for Node domain/contract tests, `npm run typecheck` for Next route types plus TypeScript, and `npm run test:e2e` against a production build.
- CI runs lint, typecheck, domain tests, build, and Chromium browser smoke tests. Playwright uploads traces and screenshots when a CI run fails.
- Unknown and inherited property slugs remain unavailable and resolve to 404.

The public discovery path is `Home → /calculators → /calculators/categories/[category] → /calculators/[slug]`. Only categories with published calculators are indexed. `NEXT_PUBLIC_SITE_URL` is required for production builds and is explicit in CI.
