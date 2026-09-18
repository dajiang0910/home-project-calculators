import type { CalculatorField, CalculatorFormInput, ValidationErrors } from "./types";
import { parseFiniteNumber } from "./numeric";

type NumericField = Pick<CalculatorField, "name" | "label" | "type" | "min" | "max" | "step" | "unit"> & {
  integer?: boolean;
};

export type NumericValidation = {
  parsed: Readonly<Record<string, number>>;
  errors: ValidationErrors;
};

/** Parse and apply the mechanical numeric constraints shared by calculators. */
export function validateNumericFields(
  input: CalculatorFormInput,
  fields: readonly NumericField[],
  options?: { error?: (field: NumericField, reason: "invalid" | "min" | "max" | "integer", value?: number) => string },
): NumericValidation {
  const parsed: Record<string, number> = {};
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (field.type !== "number") continue;
    const value = parseFiniteNumber(input[field.name]);
    const reason = value === undefined
      ? "invalid"
      : field.min !== undefined && value < field.min
        ? "min"
        : field.max !== undefined && value > field.max
          ? "max"
          : (field.integer || field.step === 1) && !Number.isInteger(value)
            ? "integer"
            : undefined;
    if (reason) {
      errors[field.name] = options?.error?.(field, reason, value) ?? defaultNumericError(field, reason);
    } else if (value !== undefined) {
      parsed[field.name] = value === 0 ? 0 : value;
    }
  }
  return { parsed, errors };
}

function defaultNumericError(field: NumericField, reason: "invalid" | "min" | "max" | "integer"): string {
  if (reason === "invalid") return `Enter a valid number for ${field.label.toLowerCase()}.`;
  if (reason === "integer") return `Enter a whole number for ${field.label.toLowerCase()}.`;
  if (reason === "min") return `${field.label} must be at least ${field.min}${field.unit ? ` ${field.unit}` : ""}.`;
  return `${field.label} must be ${field.max}${field.unit ? ` ${field.unit}` : ""} or less.`;
}

/** Convert only valid numeric edits, leaving cleared or malformed values intact. */
export function convertNumericFields(
  input: CalculatorFormInput,
  fields: readonly Pick<CalculatorField, "name">[],
  convert: (value: number, field: Pick<CalculatorField, "name">) => number,
  precision?: number | ((field: Pick<CalculatorField, "name">) => number),
): Record<string, unknown> {
  const converted: Record<string, unknown> = { ...input };
  for (const field of fields) {
    const value = parseFiniteNumber(input[field.name]);
    if (value === undefined) continue;
    const next = convert(value, field);
    if (!Number.isFinite(next)) continue;
    const digits = typeof precision === "function" ? precision(field) : precision;
    converted[field.name] = digits === undefined ? next : Number(next.toFixed(digits));
  }
  return converted;
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
