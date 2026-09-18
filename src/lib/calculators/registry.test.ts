import assert from "node:assert/strict";
import test from "node:test";
import { getCalculator, listCalculators } from "./registry";

test("published calculators are registered once and unknown slugs remain unavailable", () => {
  assert.deepEqual(listCalculators().map((calculator) => calculator.slug), ["paint", "flooring", "tile", "drywall", "wallpaper", "ceiling-paint", "baseboard"]);
  assert.equal(getCalculator("paint")?.slug, "paint");
  assert.equal(getCalculator("flooring")?.slug, "flooring");
  assert.equal(getCalculator("tile")?.slug, "tile");
  assert.equal(getCalculator("drywall")?.slug, "drywall");
  assert.equal(getCalculator("wallpaper")?.slug, "wallpaper");
  assert.equal(getCalculator("ceiling-paint")?.slug, "ceiling-paint");
  assert.equal(getCalculator("baseboard")?.slug, "baseboard");
  for (const slug of ["missing", "constructor", "toString", "__proto__"]) {
    assert.equal(getCalculator(slug), undefined);
  }
});

test("every published manifest has a server-side guide content loader", () => {
  assert.ok(listCalculators().every((calculator) => typeof calculator.loadContent === "function"));
});

test("each loaded engine returns uniquely identified semantic result items", async () => {
  const manifests = listCalculators();
  const engines = await Promise.all(manifests.map((calculator) => calculator.loadEngine()));
  for (const [index, engine] of engines.entries()) {
    assert.equal(engine.slug, manifests[index].slug);
    const validation = engine.validate(engine.createInitialInput());
    assert.equal(validation.valid, true);
    if (!validation.valid) continue;
    const calculate = engine.calculate as (input: unknown) => unknown;
    const formatResult = engine.formatResult as (result: unknown) => readonly { id: string; kind: string }[];
    const items = formatResult(calculate(validation.value));
    assert.equal(new Set(items.map((item) => item.id)).size, items.length);
    assert.ok(items.every((item) => ["primary", "cost", "metric"].includes(item.kind)));
  }
});
