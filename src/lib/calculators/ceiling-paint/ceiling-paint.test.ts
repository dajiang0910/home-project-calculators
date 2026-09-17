import assert from "node:assert/strict";
import test from "node:test";
import { calculate, ceilingPaintCalculator, formatResult, updateInput, validate } from "./index";
import { ceilingPaintDefaults, ceilingPaintUnits, getCeilingPaintFields } from "./config";
import { getCalculator, listCalculators } from "../registry";

function near(actual: number, expected: number, relativeTolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * relativeTolerance, `${actual} ≠ ${expected}`);
}

test("ceiling paint is registered once and available at its stable slug", () => {
  assert.equal(getCalculator("ceiling-paint"), ceilingPaintCalculator);
  assert.equal(listCalculators().filter((calculator) => calculator.slug === "ceiling-paint").length, 1);
});

test("ceiling reference: 168 sq ft, 1.104 gal needed, 2 gallons, and $90", () => {
  const result = calculate(ceilingPaintDefaults);
  assert.equal(result.ceilingArea, 168);
  assert.equal(result.totalCoverageArea, 336);
  near(result.paintNeeded, 1.104);
  assert.equal(result.recommendedPurchase, 2);
  assert.equal(result.estimatedCost, 90);
  assert.deepEqual(formatResult(result).map(({ label, value }) => [label, value]), [
    ["Recommended Purchase", "2 gal"],
    ["Estimated Material Cost", "$90.00"],
    ["Paint Needed", "1.1 gal"],
    ["Ceiling Area", "168 sq ft"],
    ["Total Coverage", "336 sq ft"],
    ["Paint Coverage", "350 sq ft / gal"],
  ]);
});

test("coats and waste apply once, and purchase and cost round at real boundaries", () => {
  const base = { ...ceilingPaintDefaults, roomLength: 10, roomWidth: 10, coats: 1, coverage: 100, waste: 0 };
  assert.equal(calculate(base).paintNeeded, 1);
  assert.equal(calculate(base).recommendedPurchase, 1);
  assert.equal(calculate({ ...base, roomLength: 10.0000001 }).recommendedPurchase, 2);
  assert.equal(calculate({ ...base, waste: 10 }).recommendedPurchase, 2);
  assert.equal(calculate({ ...base, coats: 2 }).recommendedPurchase, 2);
  assert.equal(calculate({ ...base, pricePerUnit: 32.5 }).estimatedCost, 32.5);
  assert.equal(calculate({ ...base, pricePerUnit: 0.01 }).estimatedCost, 0.01);
});

test("direct metric input calculates metric area, coverage, liters, and cost", () => {
  const result = calculate({
    ...ceilingPaintDefaults,
    unitSystem: "metric",
    roomLength: 4,
    roomWidth: 3,
    coats: 2,
    coverage: 10,
    waste: 10,
    pricePerUnit: 20,
  });
  assert.equal(result.ceilingArea, 12);
  assert.equal(result.totalCoverageArea, 24);
  near(result.paintNeeded, 2.64);
  assert.equal(result.recommendedPurchase, 3);
  assert.equal(result.estimatedCost, 60);
  assert.equal(formatResult(result)[3].value, "12 m²");
  assert.equal(getCeilingPaintFields("metric").find((field) => field.name === "coverage")?.unit, "m² / L");
});

test("unit switching converts dimensions, coverage, and price while preserving the estimate", () => {
  const raw = updateInput(ceilingPaintDefaults, "unitSystem", "metric");
  const checked = validate(raw);
  assert.ok(checked.valid);
  near(checked.value.roomLength, 4.2672);
  near(checked.value.roomWidth, 3.6576);
  near(checked.value.coverage, 350 * ceilingPaintUnits.metric.areaFactor / ceilingPaintUnits.metric.volumeFactor, 1e-6);
  near(checked.value.pricePerUnit, 45 / ceilingPaintUnits.metric.volumeFactor, 1e-6);
  assert.equal(checked.value.coats, 2);
  assert.equal(checked.value.waste, 15);
  const result = calculate(checked.value);
  near(result.ceilingArea, 168 * ceilingPaintUnits.metric.areaFactor);
  near(result.paintNeeded, 1.104 * ceilingPaintUnits.metric.volumeFactor, 1e-6);
  assert.equal(result.recommendedPurchase, 5);
});

test("repeated unit switches preserve the purchase boundary", () => {
  let raw: Readonly<Record<string, unknown>> = { ...ceilingPaintDefaults, roomLength: 10, roomWidth: 10, coats: 1, coverage: 100, waste: 0 };
  for (let i = 0; i < 50; i++) {
    raw = updateInput(updateInput(raw, "unitSystem", "metric"), "unitSystem", "imperial");
  }
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(calculate(checked.value).recommendedPurchase, 1);
});

test("defaults are fresh and numeric strings parse without mutating input", () => {
  const first = ceilingPaintCalculator.createInitialInput();
  first.roomLength = 99;
  assert.equal(ceilingPaintCalculator.createInitialInput().roomLength, 14);
  const raw = Object.freeze({ ...ceilingPaintDefaults, roomLength: "14", coats: "2", waste: "0", pricePerUnit: "45" });
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(checked.value.roomLength, 14);
  assert.equal(checked.value.coats, 2);
  assert.equal(checked.value.pricePerUnit, 45);
  assert.equal(raw.roomLength, "14");
  assert.equal(updateInput(raw, "roomLength", "").roomLength, "");
  assert.equal(updateInput(raw, "unitSystem", "imperial"), raw);
});

test("invalid fields and choices are rejected", () => {
  for (const name of ["roomLength", "roomWidth", "coats", "coverage", "waste", "pricePerUnit"]) {
    for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e999", "0x10", NaN, Infinity, -Infinity, null, undefined, true, [], {}, -1, 1e308]) {
      const raw = { ...ceilingPaintDefaults, [name]: bad };
      const checked = validate(raw);
      assert.equal(checked.valid, false, `${name}: ${String(bad)}`);
      if (!checked.valid) assert.ok(checked.errors[name]);
      assert.equal(validate(updateInput(raw, "unitSystem", "metric")).valid, false);
    }
  }
  for (const patch of [{ roomLength: 0 }, { roomWidth: 0 }, { coats: 1.5 }, { coats: 21 }, { waste: 101 }, { pricePerUnit: 100001 }, { unitSystem: "unknown" }]) {
    assert.equal(validate({ ...ceilingPaintDefaults, ...patch }).valid, false);
  }
  for (const bad of [undefined, null, [], "input"]) assert.equal(validate(bad).valid, false);
  assert.throws(() => calculate({ ...ceilingPaintDefaults, coverage: 0 }), RangeError);
});

test("definition supplies all fields, content, and shopping recommendations", () => {
  assert.deepEqual(ceilingPaintCalculator.fields.map((field) => field.name), [
    "unitSystem", "roomLength", "roomWidth", "coats", "coverage", "waste", "pricePerUnit",
  ]);
  assert.equal(ceilingPaintCalculator.shoppingList?.[0].name, "Ceiling Paint");
  assert.equal(ceilingPaintCalculator.content?.related[0].slug, "paint");
  assert.ok(ceilingPaintCalculator.content?.faq.length);
  assert.ok(formatResult(calculate(ceilingPaintDefaults)).every((item) => !/NaN|Infinity/.test(item.value)));
});
