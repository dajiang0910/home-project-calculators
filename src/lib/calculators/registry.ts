import type { AnyCalculatorDefinition } from "./types";
import { paintCalculator } from "./paint";
import { flooringCalculator } from "./flooring";
import { tileCalculator } from "./tile";

/**
 * The single registration point for calculators published by the application.
 * Register only calculators with a specification and passing contract tests.
 */
export const calculatorRegistry = {
  paint: paintCalculator,
  flooring: flooringCalculator,
  tile: tileCalculator,
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
