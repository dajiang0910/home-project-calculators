import assert from "node:assert/strict";
import test from "node:test";
import { calculatorEventNames, emitCalculatorEvent } from "./events";

test("analytics event seam exposes only the shipped calculator interaction names", () => {
  assert.deepEqual(calculatorEventNames, [
    "calculator_view", "calculator_start", "calculator_complete", "validation_error",
    "unit_change", "advanced_options_open", "assumption_change", "related_tool_click",
  ]);
  assert.doesNotThrow(() => emitCalculatorEvent("calculator_view", { slug: "paint" }));
});
