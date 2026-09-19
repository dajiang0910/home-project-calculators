import assert from "node:assert/strict";
import test from "node:test";
import { multiplyCurrency } from "./numeric";

test("currency multiplication rounds the final total rather than binary floating-point output", () => {
  assert.equal(multiplyCurrency(9, 0.045), 0.41);
  assert.equal(multiplyCurrency(3, 45), 135);
  assert.equal(multiplyCurrency(0, 1000), 0);
});

test("currency multiplication supports decimal exponent notation", () => {
  assert.equal(multiplyCurrency(2, 1e-3), 0);
  assert.equal(multiplyCurrency(5, 1.25e2), 625);
});

test("currency multiplication rejects unsafe inputs", () => {
  assert.throws(() => multiplyCurrency(1.5, 10), RangeError);
  assert.throws(() => multiplyCurrency(1, Number.NaN), RangeError);
  assert.throws(() => multiplyCurrency(1, -1), RangeError);
});
