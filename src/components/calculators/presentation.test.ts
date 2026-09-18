import assert from "node:assert/strict";
import test from "node:test";
import { getCalculatorPresentation } from "./presentation";

test("published calculators have explicit presentation and unknown slugs fail loudly", () => {
  assert.equal(getCalculatorPresentation("paint").hero, "paint");
  assert.throws(() => getCalculatorPresentation("missing"), /Missing calculator presentation/);
});
