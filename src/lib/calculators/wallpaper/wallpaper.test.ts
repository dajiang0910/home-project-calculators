import assert from "node:assert/strict";
import test from "node:test";
import { calculate, formatResult, updateInput, validate, wallpaperCalculator } from "./index";
import { getWallpaperFields, wallpaperDefaults, wallpaperUnits } from "./config";
import { getCalculator, listCalculators } from "../registry";

function near(actual: number, expected: number, relativeTolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * relativeTolerance, `${actual} ≠ ${expected}`);
}

test("wallpaper is registered once and available at its stable slug", () => {
  assert.equal(getCalculator("wallpaper"), wallpaperCalculator);
  assert.equal(listCalculators().filter((calculator) => calculator.slug === "wallpaper").length, 1);
});

test("wallpaper reference: 25 strips, 3 per roll, 9 rolls, and $360", () => {
  const result = calculate(wallpaperDefaults);
  assert.equal(result.grossWallArea, 352);
  assert.equal(result.openingArea, 45);
  assert.equal(result.netWallArea, 307);
  near(result.requiredAreaWithWaste, 337.7);
  near(result.adjustedDropLength, 102.5 / 12);
  assert.equal(result.stripsPerRoll, 3);
  assert.equal(result.stripsNeeded, 25);
  assert.equal(result.rollsNeeded, 9);
  assert.equal(result.estimatedCost, 360);
  assert.deepEqual(formatResult(result).map(({ label, value }) => [label, value]), [
    ["Rolls Needed", "9 rolls"],
    ["Estimated Cost", "$360.00"],
    ["Full-height Strips", "25 strips"],
    ["Net Wall Area", "307 sq ft"],
    ["Adjusted Drop", "8.54 ft"],
    ["Strips per Roll", "3 strips"],
  ]);
});

test("pattern repeat changes drops per roll and whole-roll purchase", () => {
  const patterned = calculate(wallpaperDefaults);
  const noRepeat = calculate({ ...wallpaperDefaults, patternRepeat: 0 });
  assert.equal(patterned.stripsNeeded, noRepeat.stripsNeeded);
  assert.equal(patterned.stripsPerRoll, 3);
  assert.equal(patterned.rollsNeeded, 9);
  assert.equal(noRepeat.adjustedDropLength, 8);
  assert.equal(noRepeat.stripsPerRoll, 4);
  assert.equal(noRepeat.rollsNeeded, 7);
});

test("waste applies once and strip and roll purchases round at real boundaries", () => {
  const base = {
    ...wallpaperDefaults,
    roomLength: 3,
    roomWidth: 1,
    wallHeight: 1,
    doors: 0,
    windows: 0,
    rollWidth: 12,
    rollLength: 8,
    patternRepeat: 0,
    waste: 0,
    pricePerRoll: 20,
  };
  assert.equal(calculate(base).stripsNeeded, 8);
  assert.equal(calculate(base).rollsNeeded, 1);
  assert.equal(calculate({ ...base, roomLength: 2.999 }).rollsNeeded, 1);
  assert.equal(calculate({ ...base, roomLength: 3.0000001 }).rollsNeeded, 2);
  assert.equal(calculate({ ...base, waste: 10 }).rollsNeeded, 2);
  assert.equal(calculate(base).estimatedCost, 20);
  assert.equal(calculate({ ...base, pricePerRoll: 0 }).estimatedCost, 0);
});

test("direct metric input calculates pattern-aligned drops and rolls", () => {
  const result = calculate({
    ...wallpaperDefaults,
    unitSystem: "metric",
    roomLength: 4,
    roomWidth: 3,
    wallHeight: 2.5,
    doors: 0,
    windows: 0,
    rollWidth: 53,
    rollLength: 10,
    patternRepeat: 53,
    waste: 10,
    pricePerRoll: 35,
  });
  assert.equal(result.netWallArea, 35);
  near(result.requiredAreaWithWaste, 38.5);
  near(result.adjustedDropLength, 2.65);
  assert.equal(result.stripsPerRoll, 3);
  assert.equal(result.stripsNeeded, 30);
  assert.equal(result.rollsNeeded, 10);
  assert.equal(result.estimatedCost, 350);
  assert.equal(formatResult(result)[3].value, "35 m²");
  assert.equal(getWallpaperFields("metric").find((field) => field.name === "rollWidth")?.unit, "cm");
});

test("unit switching converts room, roll, opening, and repeat measurements", () => {
  const raw = updateInput(wallpaperDefaults, "unitSystem", "metric");
  const checked = validate(raw);
  assert.ok(checked.valid);
  near(checked.value.roomLength, 3.6576);
  near(checked.value.wallHeight, 2.4384);
  near(checked.value.rollWidth, 52.07);
  near(checked.value.rollLength, 10.0584);
  near(checked.value.patternRepeat, 52.07);
  near(checked.value.doorWidth, 0.9144);
  assert.equal(checked.value.waste, 10);
  assert.equal(checked.value.pricePerRoll, 40);
  const result = calculate(checked.value);
  near(result.netWallArea, 307 * wallpaperUnits.metric.roomLengthFactor ** 2);
  assert.equal(result.stripsNeeded, 25);
  assert.equal(result.stripsPerRoll, 3);
  assert.equal(result.rollsNeeded, 9);
  assert.equal(result.estimatedCost, 360);
});

test("repeated unit switches preserve strip and roll boundaries", () => {
  let raw: Readonly<Record<string, unknown>> = { ...wallpaperDefaults };
  for (let i = 0; i < 50; i++) {
    raw = updateInput(updateInput(raw, "unitSystem", "metric"), "unitSystem", "imperial");
  }
  const checked = validate(raw);
  assert.ok(checked.valid);
  const result = calculate(checked.value);
  assert.equal(result.stripsNeeded, 25);
  assert.equal(result.stripsPerRoll, 3);
  assert.equal(result.rollsNeeded, 9);
});

test("defaults are fresh and numeric strings parse without mutating input", () => {
  const first = wallpaperCalculator.createInitialInput();
  first.roomLength = 99;
  assert.equal(wallpaperCalculator.createInitialInput().roomLength, 12);
  const raw = Object.freeze({ ...wallpaperDefaults, roomLength: "12", doors: "0", patternRepeat: "0", waste: "0", pricePerRoll: "0" });
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(checked.value.roomLength, 12);
  assert.equal(checked.value.doors, 0);
  assert.equal(checked.value.patternRepeat, 0);
  assert.equal(checked.value.pricePerRoll, 0);
  assert.equal(raw.roomLength, "12");
  assert.equal(updateInput(raw, "roomLength", "").roomLength, "");
  assert.equal(updateInput(raw, "unitSystem", "imperial"), raw);
});

test("invalid fields, oversized openings, and rolls shorter than one drop are rejected", () => {
  for (const name of ["roomLength", "roomWidth", "wallHeight", "rollWidth", "rollLength", "patternRepeat", "waste", "pricePerRoll", "doors", "windows", "doorWidth", "doorHeight", "windowWidth", "windowHeight"]) {
    for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e999", "0x10", NaN, Infinity, -Infinity, null, undefined, true, [], {}, -1, 1e308]) {
      const raw = { ...wallpaperDefaults, [name]: bad };
      const checked = validate(raw);
      assert.equal(checked.valid, false, `${name}: ${String(bad)}`);
      if (!checked.valid) assert.ok(checked.errors[name]);
      assert.equal(validate(updateInput(raw, "unitSystem", "metric")).valid, false);
    }
  }
  for (const patch of [{ roomLength: 0 }, { rollWidth: 0 }, { doors: 1.5 }, { windows: 10_001 }, { patternRepeat: 121 }, { waste: 101 }, { pricePerRoll: 100_001 }, { unitSystem: "unknown" }]) {
    assert.equal(validate({ ...wallpaperDefaults, ...patch }).valid, false);
  }
  assert.equal(validate({ ...wallpaperDefaults, doors: 100 }).valid, false);
  assert.equal(validate({ ...wallpaperDefaults, patternRepeat: 0, rollLength: 7.9 }).valid, false);
  assert.equal(validate({ ...wallpaperDefaults, rollLength: 8.5 }).valid, false);
  for (const bad of [undefined, null, [], "input"]) assert.equal(validate(bad).valid, false);
  assert.throws(() => calculate({ ...wallpaperDefaults, rollLength: 1 }), RangeError);
});

test("an exactly covered wall produces zero strips, rolls, and cost", () => {
  const result = calculate({
    ...wallpaperDefaults,
    roomLength: 1,
    roomWidth: 1,
    wallHeight: 1,
    doors: 1,
    doorWidth: 2,
    doorHeight: 2,
    windows: 0,
  });
  assert.equal(result.netWallArea, 0);
  assert.equal(result.stripsNeeded, 0);
  assert.equal(result.rollsNeeded, 0);
  assert.equal(result.estimatedCost, 0);
});

test("wallpaper definition supplies all inputs, content, and installation recommendations", () => {
  assert.deepEqual(wallpaperCalculator.fields.map((field) => field.name), [
    "unitSystem", "roomLength", "roomWidth", "wallHeight", "rollWidth", "rollLength", "patternRepeat", "waste", "pricePerRoll",
    "doors", "windows", "doorWidth", "doorHeight", "windowWidth", "windowHeight",
  ]);
  assert.equal(wallpaperCalculator.shoppingList?.[0].name, "Wallpaper");
  assert.equal(wallpaperCalculator.content?.related[0].slug, "paint");
  assert.ok(wallpaperCalculator.content?.faq.length);
  assert.ok(formatResult(calculate(wallpaperDefaults)).every((item) => !/NaN|Infinity/.test(item.value)));
});
