import assert from "node:assert/strict";
import test from "node:test";
import { convertNumericFields, formatCurrency, formatNumber, validateNumericFields } from "./shared";

const fields = [
  { name: "length", label: "Length", type: "number" as const, min: 1, max: 10 },
  { name: "count", label: "Count", type: "number" as const, min: 0, step: 1 },
];

test("shared numeric validation parses values and reports mechanical constraints", () => {
  assert.deepEqual(validateNumericFields({ length: "4.5", count: "2" }, fields), { parsed: { length: 4.5, count: 2 }, errors: {} });
  assert.equal(validateNumericFields({ length: "", count: "1.5" }, fields).errors.length, "Enter a valid number for length.");
  assert.equal(validateNumericFields({ length: "0", count: "1.5" }, fields).errors.length, "Length must be at least 1.");
  assert.equal(validateNumericFields({ length: "4", count: "1.5" }, fields).errors.count, "Enter a whole number for count.");
});

test("shared conversion preserves invalid edits and applies optional precision", () => {
  const converted = convertNumericFields({ length: "2", count: "" }, [{ name: "length" }, { name: "count" }], (value) => value * 2.54, 2);
  assert.deepEqual(converted, { length: 5.08, count: "" });
});

test("shared formatting uses the calculator display conventions", () => {
  assert.equal(formatNumber(12.345), "12.35");
  assert.equal(formatCurrency(12.5), "$12.50");
});
