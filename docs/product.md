# Product brief

## Product

Home Improvement Calculator is an English-language collection of focused tools for homeowners, renters, and DIY professionals. Each calculator should answer one practical planning question quickly, explain the assumptions behind the number, and make the next action clear.

The first phase established the shared page and calculation framework. Phase two publishes the [Paint Calculator](paint-calculator.md) at `/calculators/paint` with live estimates, editable assumptions, US/metric units, a paint budget, and a basic shopping list.

## Information architecture

- `/` introduces the collection and links to available calculators.
- `/calculators` will list calculators and support category discovery.
- `/calculators/[slug]` is the canonical page for one calculator.
- Categories such as Painting, Flooring, Roofing, Landscaping, and General Home Projects organize discovery without coupling formulas to the route layer.

## Experience principles

- Use plain English labels and error messages.
- Ask only for information needed by the selected calculator.
- Show units beside inputs and results.
- Explain important assumptions and intermediate values.
- Make the primary action usable on small screens and with a keyboard.
- Keep results stable, readable, and easy to copy or act on.

## SEO and content

Each calculator definition owns its title, description, category, and keywords. The route uses those values for metadata, while longer educational guidance belongs beside the calculator in page content. URLs use stable lowercase slugs so links remain durable as the catalog grows.

## Scope boundaries

The shared framework owns routing, form state, validation display, and result presentation. A calculator owns its domain inputs, validation rules, formula, units, rounding, and assumptions. The first phase does not publish a calculator or alter the existing starter home page.
