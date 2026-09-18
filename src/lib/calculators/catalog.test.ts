import assert from "node:assert/strict";
import test from "node:test";
import {
  calculatorCatalog,
  getCalculatorCategory,
  listActiveCalculatorCategories,
  listCalculatorsByCategory,
} from "./catalog";
import { listCalculators } from "./registry";

test("catalog and registry publish the same calculators in the same order", () => {
  assert.deepEqual(
    calculatorCatalog.map((calculator) => calculator.slug),
    listCalculators().map((calculator) => calculator.slug),
  );

  for (const calculator of listCalculators()) {
    const catalogEntry = calculatorCatalog.find((entry) => entry.slug === calculator.slug);
    assert.ok(catalogEntry);
    assert.equal(calculator.metadata, catalogEntry.metadata);
  }
});

test("only categories with published calculators become indexable hubs", () => {
  assert.deepEqual(
    listActiveCalculatorCategories().map((category) => category.slug),
    ["painting", "flooring", "walls", "trim"],
  );
  assert.deepEqual(
    listCalculatorsByCategory("walls").map((calculator) => calculator.slug),
    ["drywall", "wallpaper"],
  );
  assert.equal(getCalculatorCategory("construction")?.plannedTools[0], "Concrete Calculator");
  assert.equal(getCalculatorCategory("missing"), undefined);
});
