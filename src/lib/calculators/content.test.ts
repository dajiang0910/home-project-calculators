import assert from "node:assert/strict";
import test from "node:test";
import { baseboardContent } from "../../content/calculators/baseboard";
import { ceilingPaintContent } from "../../content/calculators/ceiling-paint";
import { drywallContent } from "../../content/calculators/drywall";
import { flooringContent } from "../../content/calculators/flooring";
import { paintContent } from "../../content/calculators/paint";
import { tileContent } from "../../content/calculators/tile";
import { wallpaperContent } from "../../content/calculators/wallpaper";

test("published guide content remains complete outside client engine modules", () => {
  const contents = [paintContent, flooringContent, tileContent, drywallContent, wallpaperContent, ceilingPaintContent, baseboardContent];
  assert.equal(contents.length, 7);
  for (const content of contents) {
    assert.ok(content.intro);
    assert.ok(content.howItWorks.length);
    assert.ok(content.formulas.length);
    assert.ok(content.example.steps.length);
    assert.ok(content.faq.length);
    assert.ok(content.related.length);
  }
});
