# Product brief

## Product

Home Improvement Calculator is an English-language collection of focused tools for homeowners, renters, and DIY professionals. Each calculator should answer one practical planning question quickly, explain the assumptions behind the number, and make the next action clear.

Project Buy List publishes seven calculators: paint, flooring, tile, drywall, wallpaper, ceiling paint, and baseboard. Each uses the shared calculation framework, live estimates, editable assumptions, US/metric units, material costs, and a shopping list. The current phase strengthens release checks and verifies production indexing; see the [two-week launch record](launch-observation.md).

## Information architecture

- `/` introduces the collection and links to available calculators.
- `/calculators` lists calculators and supports search and category discovery.
- `/calculators/categories/[category]` hosts published project hubs without colliding with calculator slugs.
- `/calculators/[slug]` is the canonical page for one calculator.
- `/how-we-calculate` explains shared unit, waste, rounding, cost, and testing decisions.
- `/about`, `/privacy`, `/terms`, and `/contact` provide the site trust layer.
- Painting, Flooring, Walls, Trim, Construction, Outdoor, and Roofing organize discovery without coupling formulas to the route layer. A category page is published only after it contains a tested calculator.

## Experience principles

- Use plain English labels and error messages.
- Ask only for information needed by the selected calculator.
- Show units beside inputs and results.
- Explain important assumptions and intermediate values.
- Make the primary action usable on small screens and with a keyboard.
- Keep results stable, readable, and easy to copy or act on.

## SEO and content

The calculator publication manifest owns each tool's title, description, category, keywords, discovery summary, image, hero treatment, and explicit engine/content loaders. Catalog views, canonical metadata, search, category hubs, and the generated sitemap derive from that manifest. Engines own domain behavior while longer educational guidance remains server-side page content. URLs use stable lowercase slugs so links remain durable as the catalog grows.

## Scope boundaries

The shared framework owns routing, form state, validation display, and result presentation. A calculator owns its domain inputs, validation rules, formula, units, rounding, and assumptions. New tools require a specification and contract tests before publication. The current launch work preserves the seven tools and their public URLs; expansion follows evidence from existing pages.
