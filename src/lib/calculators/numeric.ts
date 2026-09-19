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

/** Multiply a whole purchase quantity by a decimal price and round only the final USD cent. */
export function multiplyCurrency(quantity: number, unitPrice: number): number {
  if (!Number.isSafeInteger(quantity) || quantity < 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new RangeError("Currency multiplication requires a non-negative safe integer quantity and finite non-negative price.");
  }

  const text = unitPrice.toString().toLowerCase();
  const [mantissa, exponentText] = text.split("e");
  const exponent = exponentText ? Number(exponentText) : 0;
  const sign = mantissa.startsWith("-") ? -BigInt(1) : BigInt(1);
  const unsignedMantissa = mantissa.replace(/^[+-]/, "");
  const [whole, fraction = ""] = unsignedMantissa.split(".");
  const digits = BigInt(`${whole}${fraction}` || "0");
  const scale = fraction.length - exponent;
  const normalizedDigits = scale < 0 ? digits * BigInt(10) ** BigInt(-scale) : digits;
  const normalizedScale = Math.max(0, scale);
  const denominator = BigInt(10) ** BigInt(normalizedScale);
  const centsNumerator = BigInt(quantity) * normalizedDigits * BigInt(100);
  const absoluteCents = centsNumerator / denominator;
  const remainder = centsNumerator % denominator;
  const roundedCents = absoluteCents + (remainder * BigInt(2) >= denominator ? BigInt(1) : BigInt(0));
  const result = Number(sign * roundedCents) / 100;
  if (!Number.isFinite(result)) throw new RangeError("Currency total is outside the supported numeric range.");
  return result;
}
