const numericPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

export function parseFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !numericPattern.test(value.trim())) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function integerTolerance(value: number): number {
  return 8 * Number.EPSILON * Math.max(1, Math.abs(value));
}

export function ceilWholePurchase(value: number): number {
  return value === 0 ? 0 : Math.max(1, Math.ceil(value - integerTolerance(value)));
}

export function floorWholeCapacity(value: number): number {
  return Math.floor(value + integerTolerance(value));
}
