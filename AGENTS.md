<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Home Improvement Calculator conventions

- Keep calculator business logic in `src/lib/calculators` as framework-independent TypeScript modules.
- Register every published calculator once in `src/lib/calculators/registry.ts`; use the stable slug as its key.
- Keep route files and React components focused on composition, input state, validation display, and result presentation.
- Calculator definitions must expose pure `validate`, `calculate`, and `formatResult` functions. Do not put formulas in components.
- Add product and behavior decisions to `docs/` when introducing a new calculator or changing the shared contract.
- Preserve the `app/calculators/[slug]` dynamic route so URLs remain registry-driven.
- Do not add a concrete calculator to the registry until its specification and contract tests are ready.
- New calculator pages must reuse the shared Home Project Calculators design system: the dynamic route, `CalculatorClient`, `CalculatorForm`, `ResultCard`, `ShoppingList`, and `CalculatorGuide`. Add a shared component when an interaction is reusable; do not duplicate a calculator-specific form or page shell.
- Use the semantic tokens in `src/styles/tokens.css` for calculator UI. Keep unit conversion and formatting in the calculator definition, and keep presentation-only differences out of business input and result types.
