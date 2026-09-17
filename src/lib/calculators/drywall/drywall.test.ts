import assert from "node:assert/strict";
import test from "node:test";
import { calculate, drywallCalculator, formatResult, updateInput, validate } from "./index";
import { drywallDefaults, drywallUnits, getDrywallFields } from "./config";
import { getCalculator, listCalculators } from "../registry";

function near(actual: number, expected: number, relativeTolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * relativeTolerance, `${actual} ≠ ${expected}`);
}

test("drywall is registered once and available at its stable slug", () => {
  assert.equal(getCalculator("drywall"), drywallCalculator);
  assert.equal(listCalculators().filter((calculator) => calculator.slug === "drywall").length, 1);
});

test("drywall reference: 427 sq ft, 469.7 with waste, 15 sheets, and $225", () => {
  const result = calculate(drywallDefaults);
  assert.equal(result.grossWallArea, 352);
  assert.equal(result.openingArea, 45);
  assert.equal(result.netWallArea, 307);
  assert.equal(result.ceilingArea, 120);
  assert.equal(result.drywallArea, 427);
  near(result.requiredAreaWithWaste, 469.7);
  assert.equal(result.sheetArea, 32);
  assert.equal(result.sheetsNeeded, 15);
  assert.equal(result.estimatedCost, 225);
  assert.deepEqual(formatResult(result).map(({ label, value }) => [label, value]), [
    ["Sheets Needed", "15 sheets"],
    ["Estimated Cost", "$225.00"],
    ["Drywall Area", "427 sq ft"],
    ["Area With Waste", "469.7 sq ft"],
    ["Coverage per Sheet", "32 sq ft"],
  ]);
});

test("project modes include the requested surfaces and deduct openings only from walls", () => {
  const walls = calculate({ ...drywallDefaults, projectType: "walls" });
  assert.equal(walls.drywallArea, 307);
  assert.equal(walls.ceilingArea, 0);
  assert.equal(walls.sheetsNeeded, 11);
  const ceiling = calculate({ ...drywallDefaults, projectType: "ceiling" });
  assert.equal(ceiling.grossWallArea, 0);
  assert.equal(ceiling.openingArea, 0);
  assert.equal(ceiling.drywallArea, 120);
  assert.equal(ceiling.sheetsNeeded, 5);
  assert.equal(calculate({ ...drywallDefaults, projectType: "walls", doors: 0, windows: 0, waste: 0 }).drywallArea, 352);
});

test("waste applies once, sheets round up at real boundaries, and cost prices full sheets", () => {
  const base = { ...drywallDefaults, projectType: "ceiling" as const, roomLength: 8, roomWidth: 8, sheetLength: 8, sheetWidth: 4, waste: 0 };
  assert.equal(calculate(base).sheetsNeeded, 2);
  assert.equal(calculate({ ...base, roomLength: 7.999 }).sheetsNeeded, 2);
  assert.equal(calculate({ ...base, roomLength: 8.0000001 }).sheetsNeeded, 3);
  assert.equal(calculate({ ...base, waste: 10 }).sheetsNeeded, 3);
  assert.equal(calculate({ ...base, waste: 100 }).sheetsNeeded, 4);
  assert.equal(calculate({ ...base, pricePerSheet: 12.5 }).estimatedCost, 25);
  assert.equal(calculate({ ...base, pricePerSheet: 0 }).estimatedCost, 0);
});

test("direct metric input calculates metric surface and sheet areas", () => {
  const result = calculate({
    ...drywallDefaults,
    unitSystem: "metric",
    projectType: "walls",
    roomLength: 4,
    roomWidth: 3,
    wallHeight: 2.5,
    doors: 0,
    windows: 0,
    sheetLength: 2.4,
    sheetWidth: 1.2,
    waste: 10,
    pricePerSheet: 18,
  });
  assert.equal(result.drywallArea, 35);
  near(result.requiredAreaWithWaste, 38.5);
  near(result.sheetArea, 2.88);
  assert.equal(result.sheetsNeeded, 14);
  assert.equal(result.estimatedCost, 252);
  assert.equal(formatResult(result)[2].value, "35 m²");
  assert.equal(getDrywallFields("metric").find((field) => field.name === "sheetLength")?.unit, "m");
});

test("unit switching converts every physical dimension while preserving the purchase", () => {
  const raw = updateInput(drywallDefaults, "unitSystem", "metric");
  const checked = validate(raw);
  assert.ok(checked.valid);
  near(checked.value.roomLength, 3.6576);
  near(checked.value.roomWidth, 3.048);
  near(checked.value.wallHeight, 2.4384);
  near(checked.value.sheetLength, 2.4384);
  near(checked.value.sheetWidth, 1.2192);
  near(checked.value.doorWidth, 0.9144);
  near(checked.value.windowHeight, 1.2192);
  assert.equal(checked.value.projectType, "walls-ceiling");
  assert.equal(checked.value.waste, 10);
  assert.equal(checked.value.pricePerSheet, 15);
  const result = calculate(checked.value);
  near(result.drywallArea, 427 * drywallUnits.metric.lengthFactor ** 2);
  assert.equal(result.sheetsNeeded, 15);
  assert.equal(result.estimatedCost, 225);
});

test("repeated unit switches preserve exact sheet boundaries", () => {
  let raw: Readonly<Record<string, unknown>> = {
    ...drywallDefaults,
    projectType: "ceiling",
    roomLength: 8,
    roomWidth: 8,
    sheetLength: 8,
    sheetWidth: 4,
    waste: 0,
  };
  for (let i = 0; i < 50; i++) {
    raw = updateInput(updateInput(raw, "unitSystem", "metric"), "unitSystem", "imperial");
  }
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(calculate(checked.value).sheetsNeeded, 2);
});

test("defaults are fresh and numeric strings parse without mutating input", () => {
  const first = drywallCalculator.createInitialInput();
  first.roomLength = 99;
  assert.equal(drywallCalculator.createInitialInput().roomLength, 12);
  const raw = Object.freeze({ ...drywallDefaults, roomLength: "12", doors: "0", waste: "0", pricePerSheet: "0" });
  const checked = validate(raw);
  assert.ok(checked.valid);
  assert.equal(checked.value.roomLength, 12);
  assert.equal(checked.value.doors, 0);
  assert.equal(checked.value.pricePerSheet, 0);
  assert.equal(raw.roomLength, "12");
  assert.equal(updateInput(raw, "roomLength", "").roomLength, "");
  assert.equal(updateInput(raw, "unitSystem", "imperial"), raw);
});

test("invalid fields, choices, and oversized openings are rejected", () => {
  for (const name of ["roomLength", "roomWidth", "wallHeight", "sheetLength", "sheetWidth", "waste", "pricePerSheet", "doors", "windows", "doorWidth", "doorHeight", "windowWidth", "windowHeight"]) {
    for (const bad of ["", " ", "abc", "NaN", "Infinity", "1e999", "0x10", NaN, Infinity, -Infinity, null, undefined, true, [], {}, -1, 1e308]) {
      const raw = { ...drywallDefaults, [name]: bad };
      const checked = validate(raw);
      assert.equal(checked.valid, false, `${name}: ${String(bad)}`);
      if (!checked.valid) assert.ok(checked.errors[name]);
      assert.equal(validate(updateInput(raw, "unitSystem", "metric")).valid, false);
    }
  }
  for (const patch of [{ roomLength: 0 }, { sheetWidth: 0 }, { doors: 1.5 }, { windows: 10_001 }, { waste: 101 }, { pricePerSheet: 100_001 }, { unitSystem: "unknown" }, { projectType: "floor" }]) {
    assert.equal(validate({ ...drywallDefaults, ...patch }).valid, false);
  }
  assert.equal(validate({ ...drywallDefaults, doors: 100 }).valid, false);
  assert.equal(validate({ ...drywallDefaults, projectType: "ceiling", doors: 100 }).valid, true);
  for (const bad of [undefined, null, [], "input"]) assert.equal(validate(bad).valid, false);
  assert.throws(() => calculate({ ...drywallDefaults, sheetWidth: 0 }), RangeError);
});

test("an exactly covered wall can require zero drywall", () => {
  const result = calculate({
    ...drywallDefaults,
    projectType: "walls",
    roomLength: 1,
    roomWidth: 1,
    wallHeight: 1,
    doors: 1,
    doorWidth: 2,
    doorHeight: 2,
    windows: 0,
  });
  assert.equal(result.drywallArea, 0);
  assert.equal(result.sheetsNeeded, 0);
  assert.equal(result.estimatedCost, 0);
});

test("drywall definition supplies all inputs, content, and installation recommendations", () => {
  assert.deepEqual(drywallCalculator.fields.map((field) => field.name), [
    "unitSystem", "projectType", "roomLength", "roomWidth", "wallHeight", "sheetLength", "sheetWidth", "waste", "pricePerSheet",
    "doors", "windows", "doorWidth", "doorHeight", "windowWidth", "windowHeight",
  ]);
  assert.equal(drywallCalculator.shoppingList?.[0].name, "Drywall Sheets");
  assert.equal(drywallCalculator.content?.related[0].slug, "paint");
  assert.ok(drywallCalculator.content?.faq.length);
  assert.ok(formatResult(calculate(drywallDefaults)).every((item) => !/NaN|Infinity/.test(item.value)));
});
