import assert from "node:assert/strict";
import test from "node:test";
import { calculate, formatResult, paintCalculator, updateInput, validate } from "./index";
import { paintDefaults } from "./config";
import { LITERS_PER_GALLON, SQUARE_METERS_PER_SQUARE_FOOT } from "./units";
import { getCalculator, listCalculators } from "../registry";

function near(actual: number, expected: number, relativeTolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * relativeTolerance, `${actual} ≠ ${expected}`);
}

test("only paint is published and unknown slugs cannot resolve inherited properties", () => {
  assert.deepEqual(listCalculators().map((calculator) => calculator.slug), ["paint"]);
  assert.equal(getCalculator("paint"), paintCalculator);
  for (const slug of ["flooring", "missing", "constructor", "toString", "__proto__"]) {
    assert.equal(getCalculator(slug), undefined);
  }
});

test("reference room: openings, coats, waste, purchase, and cost", () => {
  const result = calculate({ ...paintDefaults });
  assert.equal(result.wallArea, 416);
  assert.equal(result.doorArea, 21);
  assert.equal(result.windowArea, 24);
  assert.equal(result.paintableArea, 371);
  assert.equal(result.totalCoverageArea, 742);
  near(result.baseGallons, 2.12);
  near(result.paintNeeded, 2.332);
  assert.equal(result.recommendedPurchase, 3);
  assert.equal(result.estimatedCost, 135);
});

test("defaults are fresh and numeric strings are validated without mutating input", () => {
  const initial = paintCalculator.createInitialInput();
  initial.roomLength = 99;
  assert.equal(paintCalculator.createInitialInput().roomLength, 14);
  const raw = Object.freeze({ ...paintDefaults, roomLength: "14", doors: "0", waste: "0" });
  const valid = validate(raw);
  assert.ok(valid.valid);
  assert.equal(valid.value.roomLength, 14);
  assert.equal(valid.value.doors, 0);
  assert.equal(raw.roomLength, "14");
});

test("zero openings, editable sizes, and no waste", () => {
  const noOpenings = calculate({ ...paintDefaults, doors: 0, windows: 0, waste: 0 });
  assert.equal(noOpenings.paintableArea, 416);
  near(noOpenings.paintNeeded, 832 / 350);
  const custom = calculate({ ...paintDefaults, doorWidth: 4, doorHeight: 8, windowWidth: 5, windowHeight: 4 });
  assert.equal(custom.doorArea, 32);
  assert.equal(custom.windowArea, 40);
  assert.equal(custom.paintableArea, 344);
  const zero = calculate({ ...paintDefaults, doors: -0, windows: -0 });
  assert.equal(zero.doorArea, 0);
  assert.equal(zero.windowArea, 0);
});

test("waste is applied once before rounding; cost uses the purchased amount", () => {
  const input = { ...paintDefaults, roomLength: 10, roomWidth: 10, wallHeight: 10, doors: 0, windows: 0, coats: 1, coverage: 200, waste: 0 };
  assert.equal(calculate(input).recommendedPurchase, 2);
  const extra = calculate({ ...input, waste: 10, pricePerUnit: 60 });
  near(extra.paintNeeded, 2.2);
  assert.equal(extra.recommendedPurchase, 3);
  assert.equal(extra.estimatedCost, 180);
  assert.equal(calculate({ ...input, waste: 100 }).paintNeeded, 4);
});

test("purchase rounding at, below, and above a package boundary", () => {
  const input = { ...paintDefaults, roomLength: 10, roomWidth: 10, wallHeight: 10, doors: 0, windows: 0, coats: 1, coverage: 200, waste: 0 };
  assert.equal(calculate(input).recommendedPurchase, 2);
  assert.equal(calculate({ ...input, coverage: 200.01 }).recommendedPurchase, 2);
  assert.equal(calculate({ ...input, coverage: 199.99 }).recommendedPurchase, 3);
  assert.equal(calculate({ ...input, coverage: 400 / 2.37 }).recommendedPurchase, 3);
});

test("metric switching preserves dimensions, coverage, underlying paint, and unit price", () => {
  const raw = updateInput(paintDefaults, "unitSystem", "metric");
  const checked = validate(raw);
  assert.ok(checked.valid);
  near(checked.value.roomLength, 4.2672);
  assert.equal(checked.value.coverage, 8.589835);
  assert.equal(checked.value.pricePerUnit, 11.887742);
  const result = calculate(checked.value);
  near(result.paintableArea, 371);
  near(result.paintGallons, 2.332, 1e-6);
  near(result.paintNeeded, 2.332 * LITERS_PER_GALLON, 1e-6);
  assert.equal(result.recommendedPurchase, 9);
  near(result.estimatedCost, 9 * 45 / LITERS_PER_GALLON, 1e-6);
  const display = formatResult(result);
  assert.equal(display.find((item) => item.label === "Paintable Area")?.value, "34.47 m²");
  assert.equal(display.find((item) => item.label === "Recommended Purchase")?.value, "9 L");
});

test("a directly entered metric room calculates with metric coverage and price", () => {
  const result = calculate({ ...paintDefaults, unitSystem: "metric", roomLength: 4, roomWidth: 3, wallHeight: 2.5, doors: 0, windows: 0, coats: 2, coverage: 10, waste: 10, pricePerUnit: 12 });
  near(result.paintableArea * SQUARE_METERS_PER_SQUARE_FOOT, 35);
  near(result.paintNeeded, 7.7);
  assert.equal(result.recommendedPurchase, 8);
  assert.equal(result.estimatedCost, 96);
});

test("repeated unit switches preserve results, including exact package boundaries", () => {
  let raw: Readonly<Record<string, unknown>> = { ...paintDefaults, doors: 0, windows: 0, roomLength: 10, roomWidth: 10, wallHeight: 10, coats: 1, coverage: 200, waste: 0 };
  for (let i = 0; i < 20; i++) {
    raw = updateInput(updateInput(raw, "unitSystem", "metric"), "unitSystem", "imperial");
  }
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(calculate(checked.value).recommendedPurchase, 2);
  near(checked.value.pricePerUnit, 45, 1e-6);
});

test("cleared or invalid values stay invalid when switching units", () => {
  for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e999", -1]) {
    const raw = updateInput({ ...paintDefaults, coverage: bad }, "unitSystem", "metric");
    assert.equal(validate(raw).valid, false);
  }
  const raw = updateInput(paintDefaults, "roomLength", "");
  assert.equal(raw.roomLength, "");
});

test("validation rejects missing, malformed, non-finite, non-positive, and excessive values", () => {
  for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e309", "0x10", NaN, Infinity, -Infinity, null, undefined, true, [], {}, 0, -1, 1e308, 0.000001]) {
    const checked = validate({ ...paintDefaults, roomLength: bad });
    assert.equal(checked.valid, false, String(bad));
    if (!checked.valid) assert.ok(checked.errors.roomLength);
  }
  for (const patch of [{ coverage: 0 }, { pricePerUnit: 0 }, { pricePerUnit: -1 }, { coats: 0 }, { coats: 1.5 }, { coats: 21 }, { doors: -1 }, { windows: 1.5 }, { waste: -1 }, { waste: 101 }, { unitSystem: "unknown" }]) {
    assert.equal(validate({ ...paintDefaults, ...patch }).valid, false);
  }
  for (const bad of [undefined, null, [], "input"]) assert.equal(validate(bad).valid, false);
  assert.throws(() => calculate({ ...paintDefaults, coverage: 0 }), RangeError);
});

test("oversized openings are rejected; an exactly covered wall yields zero", () => {
  assert.equal(validate({ ...paintDefaults, doors: 100 }).valid, false);
  const result = calculate({ ...paintDefaults, roomLength: 1, roomWidth: 1, wallHeight: 1, doors: 1, doorWidth: 2, doorHeight: 2, windows: 0 });
  assert.equal(result.paintNeeded, 0);
  assert.equal(result.recommendedPurchase, 0);
  assert.equal(result.estimatedCost, 0);
});

test("the published definition exposes all results, content, and six shopping recommendations", () => {
  const display = formatResult(calculate({ ...paintDefaults }));
  assert.deepEqual(new Set(display.map((item) => item.label)), new Set(["Wall Area", "Door Area", "Window Area", "Paintable Area", "Paint Needed", "Recommended Purchase", "Estimated Material Cost"]));
  assert.equal(display.find((item) => item.label === "Estimated Material Cost")?.value, "$135.00");
  assert.ok(display.every((item) => !/NaN|Infinity/.test(item.value)));
  assert.deepEqual(paintCalculator.shoppingList?.map((item) => item.name), ["Paint", "Primer", "Paint Roller", "Paint Brush", "Painter's Tape", "Drop Cloth"]);
  assert.ok(paintCalculator.content?.faq.length);
});
