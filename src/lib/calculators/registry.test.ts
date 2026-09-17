import assert from "node:assert/strict";
import test from "node:test";
import { getCalculator, listCalculators } from "./registry";

test("published calculators are registered once and unknown slugs remain unavailable", () => {
  assert.deepEqual(listCalculators().map((calculator) => calculator.slug), ["paint", "flooring", "tile", "drywall", "wallpaper"]);
  assert.equal(getCalculator("paint")?.slug, "paint");
  assert.equal(getCalculator("flooring")?.slug, "flooring");
  assert.equal(getCalculator("tile")?.slug, "tile");
  assert.equal(getCalculator("drywall")?.slug, "drywall");
  assert.equal(getCalculator("wallpaper")?.slug, "wallpaper");
  for (const slug of ["missing", "constructor", "toString", "__proto__"]) {
    assert.equal(getCalculator(slug), undefined);
  }
});
