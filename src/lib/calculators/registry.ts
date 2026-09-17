import type { AnyCalculatorDefinition } from "./types";
import { paintCalculator } from "./paint";
import { flooringCalculator } from "./flooring";

/**
 * The single registration point for calculators published by the application.
 * Register only calculators with a specification and passing contract tests.
 */
export const calculatorRegistry = {
  paint: paintCalculator,
  flooring: flooringCalculator,
} satisfies Readonly<Record<string, AnyCalculatorDefinition>>;

export type CalculatorSlug = keyof typeof calculatorRegistry;

export function getCalculator(slug: string): AnyCalculatorDefinition | undefined {
  return Object.hasOwn(calculatorRegistry, slug)
    ? calculatorRegistry[slug as CalculatorSlug]
    : undefined;
}

export function listCalculators(): readonly AnyCalculatorDefinition[] {
  return Object.values(calculatorRegistry);
}
