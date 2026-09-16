import type { AnyCalculatorDefinition } from "./types";

/**
 * The single registration point for calculators published by the application.
 * Keep this empty until a calculator has a reviewed specification and tests.
 */
export const calculatorRegistry = {
  // paint: paintCalculator,
} satisfies Readonly<Record<string, AnyCalculatorDefinition>>;

export type CalculatorSlug = keyof typeof calculatorRegistry;

export function getCalculator(slug: string): AnyCalculatorDefinition | undefined {
  return calculatorRegistry[slug as CalculatorSlug];
}

export function listCalculators(): readonly AnyCalculatorDefinition[] {
  return Object.values(calculatorRegistry);
}
