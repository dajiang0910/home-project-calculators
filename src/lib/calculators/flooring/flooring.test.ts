import assert from "node:assert/strict";
import test from "node:test";
import { calculate, flooringCalculator, formatResult, updateInput, validate } from "./index";
import { flooringDefaults, flooringUnits, getFlooringFields } from "./config";
import { getCalculator, listCalculators } from "../registry";

function near(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * 1e-12, `${actual} ≠ ${expected}`);
}

test("flooring is registered once and unknown slugs remain unavailable", () => {
  assert.equal(getCalculator("flooring")?.slug, flooringCalculator.slug);
  assert.equal(listCalculators().filter((calculator) => calculator.slug === "flooring").length, 1);
  assert.equal(getCalculator("paint")?.slug, "paint");
  for (const slug of ["missing", "constructor", "toString", "__proto__"]) {
    assert.equal(getCalculator(slug), undefined);
  }
});

test("flooring reference: 168 sq ft, 184.8 sq ft with waste, 8 boxes", () => {
  const result = calculate(flooringDefaults);
  assert.equal(result.floorArea, 168);
  near(result.requiredAreaWithWaste, 184.8);
  assert.equal(result.boxesNeeded, 8);
  assert.equal(result.estimatedCost, 400);
  assert.deepEqual(formatResult(result).map(({ label, value }) => [label, value]), [
    ["Boxes Needed", "8 boxes"], ["Estimated Cost", "$400.00"],
    ["Floor Area", "168 sq ft"], ["Required Area With Waste", "184.8 sq ft"],
  ]);
});

test("flooring waste applies once, boxes round up, cost prices full boxes", () => {
  const base = { ...flooringDefaults, roomLength: 10, roomWidth: 10, coveragePerBox: 25, waste: 0 };
  assert.equal(calculate(base).boxesNeeded, 4);
  assert.equal(calculate({ ...base, roomLength: 9.999 }).boxesNeeded, 4);
  assert.equal(calculate({ ...base, roomLength: 10.0000001 }).boxesNeeded, 5);
  assert.equal(calculate({ ...base, waste: 10 }).boxesNeeded, 5);
  assert.equal(calculate({ ...base, waste: 100 }).boxesNeeded, 8);
  assert.equal(calculate({ ...base, pricePerBox: 12.5 }).estimatedCost, 50);
  assert.equal(calculate({ ...base, pricePerBox: 0 }).estimatedCost, 0);
  assert.equal(calculate({ ...base, coveragePerBox: 1000 }).boxesNeeded, 1);
  assert.equal(formatResult(calculate({ ...base, coveragePerBox: 1000 }))[0].value, "1 box");
});

test("flooring supports directly entered metric measurements", () => {
  const result = calculate({ ...flooringDefaults, unitSystem: "metric", roomLength: 4, roomWidth: 3, coveragePerBox: 2, pricePerBox: 40 });
  assert.equal(result.floorArea, 12);
  near(result.requiredAreaWithWaste, 13.2);
  assert.equal(result.boxesNeeded, 7);
  assert.equal(result.estimatedCost, 280);
  assert.equal(formatResult(result)[2].value, "12 m²");
  assert.equal(getFlooringFields("metric").find((field) => field.name === "coveragePerBox")?.unit, "m² / box");
});

test("flooring switching converts lengths and coverage but preserves price, waste, and purchase", () => {
  const raw = updateInput(flooringDefaults, "unitSystem", "metric");
  const checked = validate(raw);
  assert.ok(checked.valid);
  near(checked.value.roomLength, 4.2672);
  near(checked.value.roomWidth, 3.6576);
  near(checked.value.coveragePerBox, 23.8 * flooringUnits.metric.areaFactor);
  assert.equal(checked.value.pricePerBox, 50);
  assert.equal(checked.value.waste, 10);
  const result = calculate(checked.value);
  near(result.floorArea, 168 * flooringUnits.metric.areaFactor);
  assert.equal(result.boxesNeeded, 8);
  assert.equal(result.estimatedCost, 400);
});

test("flooring repeated switches preserve exact box boundaries", () => {
  let raw: Readonly<Record<string, unknown>> = { ...flooringDefaults, roomLength: 10, roomWidth: 10, coveragePerBox: 25, waste: 0 };
  for (let i = 0; i < 50; i++) {
    for (const system of ["metric", "imperial"]) {
      raw = updateInput(raw, "unitSystem", system);
      const checked = validate(raw);
      assert.ok(checked.valid);
      assert.equal(calculate(checked.value).boxesNeeded, 4);
      assert.equal(calculate(checked.value).estimatedCost, 200);
    }
  }
});

test("flooring defaults are fresh; numeric strings parse without mutating input", () => {
  const first = flooringCalculator.createInitialInput();
  first.roomLength = 99;
  assert.equal(flooringCalculator.createInitialInput().roomLength, 14);
  const raw = Object.freeze({ ...flooringDefaults, roomLength: "14", pricePerBox: "0", waste: "0" });
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(checked.value.roomLength, 14);
  assert.equal(checked.value.pricePerBox, 0);
  assert.equal(raw.roomLength, "14");
  assert.equal(updateInput(raw, "roomLength", "").roomLength, "");
  assert.equal(updateInput(raw, "unitSystem", "imperial"), raw);
});

test("flooring rejects invalid fields and preserves invalid edits across switches", () => {
  for (const name of ["roomLength", "roomWidth", "coveragePerBox", "waste", "pricePerBox"]) {
    for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e999", "0x10", NaN, Infinity, -Infinity, null, undefined, true, [], {}, -1, 1e308]) {
      const raw = { ...flooringDefaults, [name]: bad };
      const checked = validate(raw);
      assert.equal(checked.valid, false, `${name}: ${String(bad)}`);
      if (!checked.valid) assert.ok(checked.errors[name]);
      assert.equal(validate(updateInput(raw, "unitSystem", "metric")).valid, false);
    }
  }
  for (const patch of [{ roomLength: 0 }, { roomWidth: 0 }, { coveragePerBox: 0 }, { roomLength: 0.001 }, { waste: 101 }, { pricePerBox: 100001 }, { unitSystem: "unknown" }]) {
    assert.equal(validate({ ...flooringDefaults, ...patch }).valid, false);
  }
  for (const bad of [undefined, null, [], "input"]) assert.equal(validate(bad).valid, false);
  assert.throws(() => calculate({ ...flooringDefaults, coveragePerBox: 0 }), RangeError);
});

test("flooring engine supplies all inputs and shopping recommendations", () => {
  assert.deepEqual(flooringCalculator.fields.map((field) => field.name), ["unitSystem", "roomLength", "roomWidth", "coveragePerBox", "waste", "pricePerBox"]);
  assert.equal(flooringCalculator.shoppingList?.[0].name, "Flooring");
  assert.ok(formatResult(calculate(flooringDefaults)).every((item) => !/NaN|Infinity/.test(item.value)));
});
