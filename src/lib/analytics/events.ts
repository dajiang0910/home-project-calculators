export const calculatorEventNames = [
  "calculator_view",
  "calculator_start",
  "calculator_complete",
  "validation_error",
  "unit_change",
  "advanced_options_open",
  "assumption_change",
  "related_tool_click",
] as const;

export type CalculatorEventName = (typeof calculatorEventNames)[number];
export type CalculatorEventPayload = {
  slug: string;
  unitSystem?: "imperial" | "metric";
  field?: string;
  group?: string;
  targetSlug?: string;
};

export type CalculatorEventDetail = CalculatorEventPayload & { name: CalculatorEventName };

/**
 * Local-only analytics seam. It intentionally emits no network request and
 * excludes calculator measurements, prices, results, and free-form input.
 */
export function emitCalculatorEvent(name: CalculatorEventName, payload: CalculatorEventPayload): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CalculatorEventDetail>("calculator_event", {
    detail: { name, ...payload },
  }));
}
