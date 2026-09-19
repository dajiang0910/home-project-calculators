# Project Buy List

Home improvement calculators and material planning tools for quantities, waste, purchase packages, and estimated cost. The application uses Next.js 16, React 19, strict TypeScript, and a shared calculator UI.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Development and tests use that origin when `NEXT_PUBLIC_SITE_URL` is absent. Production builds require an HTTP(S) site origin:

```bash
$env:NEXT_PUBLIC_SITE_URL = "https://projectbuylist.com"
npm run build
npm run start
```

## Calculator architecture

Each published slug has one manifest entry in [`src/lib/calculators/registry.ts`](src/lib/calculators/registry.ts). The entry owns metadata, discovery fields, hero presentation, and explicit loaders for the calculator engine and server-side guide content.

The engine in `src/lib/calculators/<slug>/` is a pure TypeScript module. It owns fields, defaults, validation, unit conversion, formulas, result formatting, shopping recommendations, and notes. It must not import catalog data or guide content. The client loads only the current engine through [`src/lib/calculators/runtime.ts`](src/lib/calculators/runtime.ts); the route loads the guide on the server.

The dynamic route remains `/calculators/[slug]`. Catalog pages, category hubs, static params, sitemap entries, and hero presentation derive from the registry. Shared UI lives under `src/components/calculators/`; formulas do not belong in React components.

To add a calculator:

1. Write its specification in `docs/` with units, assumptions, bounds, and rounding rules.
2. Implement the engine and contract/edge-case tests.
3. Add the explicit engine and content loaders plus manifest metadata to `registry.ts`.
4. Verify the route, SEO, search, validation, unit switching, responsive layout, and browser flow.
5. Run the full verification commands below before publishing the slug.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright tests run against the production server in Chromium desktop and mobile profiles. CI uploads the Playwright report, screenshots, and traces when a browser test fails.
