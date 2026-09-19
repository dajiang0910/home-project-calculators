import assert from "node:assert/strict";
import test from "node:test";
import {
  baseboardExample,
  ceilingPaintExample,
  drywallExample,
  flooringExample,
  paintExample,
  tileExample,
  wallpaperExample,
} from "./examples";

test("worked examples keep the published purchase and cost baselines", () => {
  const expected = [
    [paintExample, "Buy 3 gallons", "$135.00"],
    [flooringExample, "Buy 8 boxes", "$400.00"],
    [tileExample, "Buy 16 boxes", "$560.00"],
    [drywallExample, "Buy 15 sheets", "$225.00"],
    [wallpaperExample, "Buy 9 rolls", "$360.00"],
    [ceilingPaintExample, "Buy 2 gallons", "$90.00"],
    [baseboardExample, "Buy 7 pieces", "$126.00"],
  ] as const;

  for (const [example, purchase, cost] of expected) {
    assert.ok(example.conclusion.includes(purchase));
    assert.ok(example.conclusion.includes(cost));
  }
});
