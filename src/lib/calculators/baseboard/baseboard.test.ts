import assert from "node:assert/strict";
import test from "node:test";
import { baseboardCalculator, calculate, formatResult, updateInput, validate } from "./index";
import { baseboardDefaults, baseboardUnits, getBaseboardFields } from "./config";
import { getCalculator, listCalculators } from "../registry";

function near(actual: number, expected: number, relativeTolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * relativeTolerance, `${actual} ≠ ${expected}`);
}

test("baseboard is registered once and available at its stable slug", () => {
  assert.equal(getCalculator("baseboard")?.slug, baseboardCalculator.slug);
  assert.equal(listCalculators().filter((calculator) => calculator.slug === "baseboard").length, 1);
});

test("baseboard reference: 52 ft perimeter, 49 ft net run, 7 pieces, and $126", () => {
  const result = calculate(baseboardDefaults);
  assert.equal(result.roomPerimeter, 52);
  assert.equal(result.openingLength, 3);
  assert.equal(result.netWallRun, 49);
  near(result.requiredLengthWithWaste, 53.9);
  assert.equal(result.boardLength, 8);
  assert.equal(result.piecesNeeded, 7);
  assert.equal(result.estimatedCost, 126);
  assert.deepEqual(formatResult(result).map(({ label, value }) => [label, value]), [
    ["Pieces Needed", "7 pieces"],
    ["Estimated Cost", "$126.00"],
    ["Baseboard Needed", "53.9 ft"],
    ["Net Wall Run", "49 ft"],
    ["Room Perimeter", "52 ft"],
    ["Length per Piece", "8 ft"],
  ]);
});

test("waste and full-piece rounding apply at real boundaries", () => {
  const base = { ...baseboardDefaults, roomLength: 8, roomWidth: 8, doors: 0, boardLength: 8, waste: 0 };
  assert.equal(calculate(base).piecesNeeded, 4);
  assert.equal(calculate({ ...base, roomLength: 8.0000001 }).piecesNeeded, 5);
  assert.equal(calculate({ ...base, waste: 10 }).piecesNeeded, 5);
  assert.equal(calculate({ ...base, pricePerBoard: 12.5 }).estimatedCost, 50);
  assert.equal(calculate({ ...base, pricePerBoard: 0 }).estimatedCost, 0);
});

test("zero doors ignore and hide the unused opening width", () => {
  const raw = { ...baseboardDefaults, doors: 0, doorWidth: "" };
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(calculate(checked.value).openingLength, 0);
  assert.ok(!baseboardCalculator.getFields?.(raw).some((field) => field.name === "doorWidth"));
});

test("direct metric input calculates metric run lengths and pieces", () => {
  const result = calculate({
    ...baseboardDefaults,
    unitSystem: "metric",
    roomLength: 4,
    roomWidth: 3,
    doors: 0,
    boardLength: 2.4,
    waste: 10,
    pricePerBoard: 18,
  });
  assert.equal(result.roomPerimeter, 14);
  near(result.requiredLengthWithWaste, 15.4);
  assert.equal(result.piecesNeeded, 7);
  assert.equal(result.estimatedCost, 126);
  assert.equal(formatResult(result)[2].value, "15.4 m");
  assert.equal(getBaseboardFields("metric").find((field) => field.name === "boardLength")?.unit, "m");
});

test("unit switching converts all physical dimensions while preserving counts and pricing", () => {
  const raw = updateInput(baseboardDefaults, "unitSystem", "metric");
  const checked = validate(raw);
  assert.ok(checked.valid);
  near(checked.value.roomLength, 4.2672);
  near(checked.value.roomWidth, 3.6576);
  near(checked.value.boardLength, 2.4384);
  near(checked.value.doorWidth, 0.9144);
  assert.equal(checked.value.doors, 1);
  assert.equal(checked.value.waste, 10);
  assert.equal(checked.value.pricePerBoard, 18);
  const result = calculate(checked.value);
  near(result.netWallRun, 49 * baseboardUnits.metric.lengthFactor);
  assert.equal(result.piecesNeeded, 7);
  assert.equal(result.estimatedCost, 126);
});

test("repeated unit switches preserve the full-piece boundary", () => {
  let raw: Readonly<Record<string, unknown>> = { ...baseboardDefaults, roomLength: 8, roomWidth: 8, doors: 0, boardLength: 8, waste: 0 };
  for (let i = 0; i < 50; i++) {
    raw = updateInput(updateInput(raw, "unitSystem", "metric"), "unitSystem", "imperial");
  }
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(calculate(checked.value).piecesNeeded, 4);
});

test("defaults are fresh and numeric strings parse without mutating input", () => {
  const first = baseboardCalculator.createInitialInput();
  first.roomLength = 99;
  assert.equal(baseboardCalculator.createInitialInput().roomLength, 14);
  const raw = Object.freeze({ ...baseboardDefaults, roomLength: "14", doors: "1", waste: "0", pricePerBoard: "18" });
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(checked.value.roomLength, 14);
  assert.equal(checked.value.doors, 1);
  assert.equal(checked.value.pricePerBoard, 18);
  assert.equal(raw.roomLength, "14");
  assert.equal(updateInput(raw, "roomLength", "").roomLength, "");
  assert.equal(updateInput(raw, "unitSystem", "imperial"), raw);
});

test("invalid fields, choices, and oversized openings are rejected", () => {
  for (const name of ["roomLength", "roomWidth", "doors", "doorWidth", "boardLength", "waste", "pricePerBoard"]) {
    for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e999", "0x10", NaN, Infinity, -Infinity, null, undefined, true, [], {}, -1, 1e308]) {
      const raw = { ...baseboardDefaults, [name]: bad };
      const checked = validate(raw);
      assert.equal(checked.valid, false, `${name}: ${String(bad)}`);
      if (!checked.valid) assert.ok(checked.errors[name]);
      assert.equal(validate(updateInput(raw, "unitSystem", "metric")).valid, false);
    }
  }
  for (const patch of [{ roomLength: 0 }, { boardLength: 0 }, { doors: 1.5 }, { doors: 10001 }, { waste: 101 }, { pricePerBoard: 100001 }, { unitSystem: "unknown" }]) {
    assert.equal(validate({ ...baseboardDefaults, ...patch }).valid, false);
  }
  assert.equal(validate({ ...baseboardDefaults, roomLength: 1, roomWidth: 1, doors: 1, doorWidth: 4 }).valid, true);
  assert.equal(validate({ ...baseboardDefaults, roomLength: 1, roomWidth: 1, doors: 2, doorWidth: 3 }).valid, false);
  for (const bad of [undefined, null, [], "input"]) assert.equal(validate(bad).valid, false);
  assert.throws(() => calculate({ ...baseboardDefaults, boardLength: 0 }), RangeError);
});

test("an exactly covered perimeter produces zero pieces and cost", () => {
  const result = calculate({
    ...baseboardDefaults,
    roomLength: 1,
    roomWidth: 1,
    doors: 1,
    doorWidth: 4,
  });
  assert.equal(result.netWallRun, 0);
  assert.equal(result.requiredLengthWithWaste, 0);
  assert.equal(result.piecesNeeded, 0);
  assert.equal(result.estimatedCost, 0);
});

test("engine supplies all fields and shopping recommendations", () => {
  assert.deepEqual(baseboardCalculator.fields.map((field) => field.name), [
    "unitSystem", "roomLength", "roomWidth", "boardLength", "waste", "pricePerBoard", "doors", "doorWidth",
  ]);
  assert.equal(baseboardCalculator.shoppingList?.[0].name, "Baseboard");
  assert.ok(formatResult(calculate(baseboardDefaults)).every((item) => !/NaN|Infinity/.test(item.value)));
});
