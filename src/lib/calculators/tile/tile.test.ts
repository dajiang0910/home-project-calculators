import assert from "node:assert/strict";
import test from "node:test";
import { calculate, formatResult, tileCalculator, updateInput, validate } from "./index";
import { getTileFields, tileDefaults, tileUnits } from "./config";
import { getCalculator, listCalculators } from "../registry";

function near(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * 1e-12, `${actual} ≠ ${expected}`);
}

test("tile is registered once and available at its stable slug", () => {
  assert.equal(getCalculator("tile"), tileCalculator);
  assert.equal(listCalculators().filter((calculator) => calculator.slug === "tile").length, 1);
});

test("tile reference: 168 sq ft, 185 tiles with waste, 16 boxes, and $560", () => {
  const result = calculate(tileDefaults);
  assert.equal(result.surfaceArea, 168);
  assert.equal(result.tileArea, 1);
  assert.equal(result.exactTileCount, 168);
  assert.equal(result.tilesNeeded, 185);
  assert.equal(result.boxesNeeded, 16);
  assert.equal(result.tilesPurchased, 192);
  assert.equal(result.estimatedCost, 560);
  assert.deepEqual(formatResult(result).map(({ label, value }) => [label, value]), [
    ["Tiles Needed", "185 tiles"],
    ["Boxes Needed", "16 boxes"],
    ["Estimated Cost", "$560.00"],
    ["Surface Area", "168 sq ft"],
    ["Area per Tile", "1 sq ft"],
  ]);
});

test("waste applies once and tile and box purchases each round up", () => {
  const base = { ...tileDefaults, roomLength: 10, roomWidth: 10, tileLength: 12, tileWidth: 12, waste: 0, tilesPerBox: 10 };
  assert.equal(calculate(base).tilesNeeded, 100);
  assert.equal(calculate(base).boxesNeeded, 10);
  assert.equal(calculate({ ...base, roomLength: 9.999 }).tilesNeeded, 100);
  assert.equal(calculate({ ...base, roomLength: 10.0000001 }).tilesNeeded, 101);
  assert.equal(calculate({ ...base, waste: 10 }).tilesNeeded, 110);
  assert.equal(calculate({ ...base, tilesPerBox: 12 }).boxesNeeded, 9);
  assert.equal(calculate({ ...base, pricePerBox: 12.5 }).estimatedCost, 125);
  assert.equal(calculate({ ...base, pricePerBox: 0 }).estimatedCost, 0);
});

test("direct metric input uses meters for the surface and centimeters for tile size", () => {
  const result = calculate({ ...tileDefaults, unitSystem: "metric", roomLength: 4, roomWidth: 3, tileLength: 30, tileWidth: 60, waste: 10, tilesPerBox: 6, pricePerBox: 40 });
  assert.equal(result.surfaceArea, 12);
  near(result.tileArea, 0.18);
  assert.equal(result.tilesNeeded, 74);
  assert.equal(result.boxesNeeded, 13);
  assert.equal(result.tilesPurchased, 78);
  assert.equal(result.estimatedCost, 520);
  assert.equal(formatResult(result)[3].value, "12 m²");
  assert.equal(getTileFields("metric").find((field) => field.name === "tileLength")?.unit, "cm");
});

test("unit switching converts room and tile dimensions while preserving the purchase", () => {
  const raw = updateInput(tileDefaults, "unitSystem", "metric");
  const checked = validate(raw);
  assert.ok(checked.valid);
  near(checked.value.roomLength, 4.2672);
  near(checked.value.roomWidth, 3.6576);
  near(checked.value.tileLength, 30.48);
  near(checked.value.tileWidth, 30.48);
  assert.equal(checked.value.waste, 10);
  assert.equal(checked.value.tilesPerBox, 12);
  assert.equal(checked.value.pricePerBox, 35);
  const result = calculate(checked.value);
  near(result.surfaceArea, 168 * tileUnits.metric.roomLengthFactor ** 2);
  assert.equal(result.tilesNeeded, 185);
  assert.equal(result.boxesNeeded, 16);
  assert.equal(result.estimatedCost, 560);
});

test("repeated unit switches preserve exact tile and box boundaries", () => {
  let raw: Readonly<Record<string, unknown>> = { ...tileDefaults, roomLength: 10, roomWidth: 10, waste: 0, tilesPerBox: 10 };
  for (let i = 0; i < 50; i++) {
    raw = updateInput(updateInput(raw, "unitSystem", "metric"), "unitSystem", "imperial");
  }
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(calculate(checked.value).tilesNeeded, 100);
  assert.equal(calculate(checked.value).boxesNeeded, 10);
});

test("defaults are fresh and numeric strings parse without mutating input", () => {
  const first = tileCalculator.createInitialInput();
  first.roomLength = 99;
  assert.equal(tileCalculator.createInitialInput().roomLength, 14);
  const raw = Object.freeze({ ...tileDefaults, roomLength: "14", waste: "0", pricePerBox: "0" });
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(checked.value.roomLength, 14);
  assert.equal(checked.value.waste, 0);
  assert.equal(checked.value.pricePerBox, 0);
  assert.equal(raw.roomLength, "14");
  assert.equal(updateInput(raw, "roomLength", "").roomLength, "");
  assert.equal(updateInput(raw, "unitSystem", "imperial"), raw);
});

test("invalid fields are rejected and invalid edits survive unit switches", () => {
  for (const name of ["roomLength", "roomWidth", "tileLength", "tileWidth", "waste", "tilesPerBox", "pricePerBox"]) {
    for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e999", "0x10", NaN, Infinity, -Infinity, null, undefined, true, [], {}, -1, 1e308]) {
      const raw = { ...tileDefaults, [name]: bad };
      const checked = validate(raw);
      assert.equal(checked.valid, false, `${name}: ${String(bad)}`);
      if (!checked.valid) assert.ok(checked.errors[name]);
      assert.equal(validate(updateInput(raw, "unitSystem", "metric")).valid, false);
    }
  }
  for (const patch of [{ roomLength: 0 }, { roomWidth: 0 }, { tileLength: 0 }, { tileWidth: 0 }, { tilesPerBox: 0 }, { tilesPerBox: 1.5 }, { waste: 101 }, { pricePerBox: 100_001 }, { unitSystem: "unknown" }]) {
    assert.equal(validate({ ...tileDefaults, ...patch }).valid, false);
  }
  for (const bad of [undefined, null, [], "input"]) assert.equal(validate(bad).valid, false);
  assert.throws(() => calculate({ ...tileDefaults, tileWidth: 0 }), RangeError);
});

test("tile definition supplies every input, content, and installation recommendations", () => {
  assert.deepEqual(tileCalculator.fields.map((field) => field.name), ["unitSystem", "roomLength", "roomWidth", "tileLength", "tileWidth", "waste", "tilesPerBox", "pricePerBox"]);
  assert.equal(tileCalculator.shoppingList?.[0].name, "Tile");
  assert.equal(tileCalculator.content?.related[0].slug, "flooring");
  assert.ok(tileCalculator.content?.faq.length);
  assert.ok(formatResult(calculate(tileDefaults)).every((item) => !/NaN|Infinity/.test(item.value)));
});
