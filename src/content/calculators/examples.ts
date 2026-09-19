import type { CalculatorContent } from "../../lib/calculators/types";
import { calculate as calculateBaseboard } from "../../lib/calculators/baseboard";
import { baseboardDefaults } from "../../lib/calculators/baseboard/config";
import { calculate as calculateCeilingPaint } from "../../lib/calculators/ceiling-paint";
import { ceilingPaintDefaults } from "../../lib/calculators/ceiling-paint/config";
import { calculate as calculateDrywall } from "../../lib/calculators/drywall";
import { drywallDefaults } from "../../lib/calculators/drywall/config";
import { calculate as calculateFlooring } from "../../lib/calculators/flooring";
import { flooringDefaults } from "../../lib/calculators/flooring/config";
import { calculate as calculatePaint } from "../../lib/calculators/paint";
import { paintDefaults } from "../../lib/calculators/paint/config";
import { calculate as calculateTile } from "../../lib/calculators/tile";
import { tileDefaults } from "../../lib/calculators/tile/config";
import { calculate as calculateWallpaper } from "../../lib/calculators/wallpaper";
import { wallpaperDefaults } from "../../lib/calculators/wallpaper/config";
import { formatCurrency, formatNumber } from "../../lib/calculators/shared";

type Example = CalculatorContent["example"];

export const paintExample: Example = (() => {
  const result = calculatePaint(paintDefaults);
  return {
    description: "A 14 × 12 ft room with 8 ft walls, one 3 × 7 ft door, and two 3 × 4 ft windows. Use two coats, 350 sq ft per gallon, 10% waste, and paint priced at $45 per gallon.",
    steps: [
      `Walls: 2 × (14 + 12) × 8 = ${formatNumber(result.wallArea)} sq ft.`,
      `Door area: ${formatNumber(result.doorArea)} sq ft; window area: ${formatNumber(result.windowArea)} sq ft.`,
      `Paintable area after openings: ${formatNumber(result.paintableArea)} sq ft.`,
      `Two coats: ${formatNumber(result.paintableArea)} × 2 ÷ 350 = ${formatNumber(result.baseGallons)} gallons.`,
      `With 10% waste: ${formatNumber(result.baseGallons)} × 1.10 = ${formatNumber(result.paintGallons)} gallons.`,
    ],
    conclusion: `Buy ${formatNumber(result.recommendedPurchase)} gallons. At $45 per gallon, the estimated paint cost is ${formatCurrency(result.estimatedCost)}, before tax and supplies.`,
  };
})();

export const flooringExample: Example = (() => {
  const result = calculateFlooring(flooringDefaults);
  return {
    description: "A 14 × 12 ft room, 10% waste, and flooring covering 23.8 sq ft per box at $50 per box.",
    steps: [
      `14 × 12 = ${formatNumber(result.floorArea)} sq ft of floor.`,
      `${formatNumber(result.floorArea)} × 1.10 = ${formatNumber(result.requiredAreaWithWaste)} sq ft with waste.`,
      `Round the area-with-waste estimate up to ${formatNumber(result.boxesNeeded)} full boxes.`,
      `${formatNumber(result.boxesNeeded)} × $50 = ${formatCurrency(result.estimatedCost)} in flooring.`,
    ],
    conclusion: `Buy ${formatNumber(result.boxesNeeded)} boxes. The flooring estimate is ${formatCurrency(result.estimatedCost)} before tax and installation supplies.`,
  };
})();

export const tileExample: Example = (() => {
  const result = calculateTile(tileDefaults);
  return {
    description: "A 14 × 12 ft room using 12 × 12 in tile, with 10% waste, 12 tiles per box, and a $35 box price.",
    steps: [
      `14 × 12 = ${formatNumber(result.surfaceArea)} sq ft of surface.`,
      `Each 12 × 12 in tile covers ${formatNumber(result.tileArea)} sq ft, so the base layout uses ${formatNumber(result.exactTileCount)} tiles by area.`,
      `After waste, round the tile estimate up to ${formatNumber(result.tilesNeeded)} tiles.`,
      `Round the tile purchase to ${formatNumber(result.boxesNeeded)} boxes, containing ${formatNumber(result.tilesPurchased)} tiles.`,
      `${formatNumber(result.boxesNeeded)} × $35 = ${formatCurrency(result.estimatedCost)} in tile boxes.`,
    ],
    conclusion: `Buy ${formatNumber(result.boxesNeeded)} boxes. The tile estimate is ${formatCurrency(result.estimatedCost)} before tax and installation supplies.`,
  };
})();

export const drywallExample: Example = (() => {
  const result = calculateDrywall(drywallDefaults);
  return {
    description: "A 12 × 10 ft room with 8 ft walls and ceiling, one 3 × 7 ft door, two 3 × 4 ft windows, 4 × 8 ft sheets, 10% waste, and a $15 sheet price.",
    steps: [
      `Walls: 2 × (12 + 10) × 8 = ${formatNumber(result.grossWallArea)} sq ft.`,
      `Openings: (1 × 3 × 7) + (2 × 3 × 4) = ${formatNumber(result.openingArea)} sq ft.`,
      `Walls plus ceiling: ${formatNumber(result.grossWallArea)} − ${formatNumber(result.openingArea)} + ${formatNumber(result.ceilingArea)} = ${formatNumber(result.drywallArea)} sq ft.`,
      `With waste: ${formatNumber(result.drywallArea)} × 1.10 = ${formatNumber(result.requiredAreaWithWaste)} sq ft.`,
      `Each sheet covers ${formatNumber(result.sheetArea)} sq ft; round the area-with-waste estimate up to ${formatNumber(result.sheetsNeeded)} sheets.`,
      `${formatNumber(result.sheetsNeeded)} × $15 = ${formatCurrency(result.estimatedCost)} in drywall sheets.`,
    ],
    conclusion: `Buy ${formatNumber(result.sheetsNeeded)} sheets. The drywall estimate is ${formatCurrency(result.estimatedCost)} before tax and installation supplies.`,
  };
})();

export const wallpaperExample: Example = (() => {
  const result = calculateWallpaper(wallpaperDefaults);
  return {
    description: "A 12 × 10 ft room with 8 ft walls, one 3 × 7 ft door, two 3 × 4 ft windows, 20.5 in × 33 ft rolls, a 20.5 in repeat, 10% extra waste, and a $40 roll price.",
    steps: [
      `Walls: 2 × (12 + 10) × 8 = ${formatNumber(result.grossWallArea)} sq ft; subtract ${formatNumber(result.openingArea)} sq ft of openings for ${formatNumber(result.netWallArea)} sq ft net.`,
      `A 20.5 in repeat rounds the 8 ft wall height up to a ${formatNumber(result.adjustedDropLength)} ft drop.`,
      `A 33 ft roll yields ${formatNumber(result.stripsPerRoll)} complete pattern-aligned drops.`,
      `After 10% extra waste, ${formatNumber(result.requiredAreaWithWaste)} sq ft requires ${formatNumber(result.stripsNeeded)} full-height strips at 20.5 in wide.`,
      `Round the strip purchase up to ${formatNumber(result.rollsNeeded)} full rolls.`,
      `${formatNumber(result.rollsNeeded)} × $40 = ${formatCurrency(result.estimatedCost)} in wallpaper.`,
    ],
    conclusion: `Buy ${formatNumber(result.rollsNeeded)} rolls from the same print batch. The wallpaper estimate is ${formatCurrency(result.estimatedCost)} before tax and installation supplies.`,
  };
})();

export const ceilingPaintExample: Example = (() => {
  const result = calculateCeilingPaint(ceilingPaintDefaults);
  return {
    description: "A 14 × 12 ft ceiling with two coats, paint rated at 350 sq ft per gallon, 15% extra waste, and paint priced at $45 per gallon.",
    steps: [
      `Ceiling area: 14 × 12 = ${formatNumber(result.ceilingArea)} sq ft.`,
      `Two coats: ${formatNumber(result.ceilingArea)} × 2 = ${formatNumber(result.totalCoverageArea)} sq ft of total coverage.`,
      `Paint needed after coverage and waste: ${formatNumber(result.paintNeeded)} gallons.`,
      `Round the paint purchase up to ${formatNumber(result.recommendedPurchase)} gallons.`,
      `${formatNumber(result.recommendedPurchase)} × $45 = ${formatCurrency(result.estimatedCost)} estimated paint cost.`,
    ],
    conclusion: `Buy ${formatNumber(result.recommendedPurchase)} gallons for this example. The estimated ceiling paint cost is ${formatCurrency(result.estimatedCost)}, before tax and preparation supplies.`,
  };
})();

export const baseboardExample: Example = (() => {
  const result = calculateBaseboard(baseboardDefaults);
  return {
    description: "A 14 × 12 ft room with one 3 ft doorway, 8 ft baseboard pieces, 10% waste, and a price of $18 per piece.",
    steps: [
      `Room perimeter: 2 × (14 + 12) = ${formatNumber(result.roomPerimeter)} linear ft.`,
      `Subtract one 3 ft doorway: ${formatNumber(result.roomPerimeter)} − ${formatNumber(result.openingLength)} = ${formatNumber(result.netWallRun)} linear ft of baseboard run.`,
      `Add 10% waste: ${formatNumber(result.netWallRun)} × 1.10 = ${formatNumber(result.requiredLengthWithWaste)} linear ft needed.`,
      `Round the required length up to ${formatNumber(result.piecesNeeded)} full pieces.`,
      `${formatNumber(result.piecesNeeded)} × $18 = ${formatCurrency(result.estimatedCost)} estimated baseboard cost.`,
    ],
    conclusion: `Buy ${formatNumber(result.piecesNeeded)} pieces. The baseboard estimate is ${formatCurrency(result.estimatedCost)} before tax, fasteners, finishing materials, and installation.`,
  };
})();
