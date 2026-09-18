import type { AnyCalculatorEngine } from "./types";

/**
 * Client-safe runtime boundary. Keep these imports explicit so each calculator
 * can be emitted as its own async chunk instead of shipping the whole registry.
 */
export const calculatorEngineLoaders = {
  paint: () => import("./paint").then(({ paintCalculator }) => paintCalculator),
  flooring: () => import("./flooring").then(({ flooringCalculator }) => flooringCalculator),
  tile: () => import("./tile").then(({ tileCalculator }) => tileCalculator),
  drywall: () => import("./drywall").then(({ drywallCalculator }) => drywallCalculator),
  wallpaper: () => import("./wallpaper").then(({ wallpaperCalculator }) => wallpaperCalculator),
  "ceiling-paint": () => import("./ceiling-paint").then(({ ceilingPaintCalculator }) => ceilingPaintCalculator),
  baseboard: () => import("./baseboard").then(({ baseboardCalculator }) => baseboardCalculator),
} satisfies Readonly<Record<string, () => Promise<AnyCalculatorEngine>>>;

export type RuntimeCalculatorSlug = keyof typeof calculatorEngineLoaders;

export function loadCalculatorEngine(slug: string): Promise<AnyCalculatorEngine> | undefined {
  if (!Object.hasOwn(calculatorEngineLoaders, slug)) return undefined;
  return calculatorEngineLoaders[slug as RuntimeCalculatorSlug]();
}
