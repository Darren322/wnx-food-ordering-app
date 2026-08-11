/**
 * Money is handled as integer cents everywhere internally.
 * Use these helpers at the display/input boundary.
 */

/** Format integer cents for display, e.g. 450 -> "$4.50". */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Parse a user-entered dollar string (e.g. "4.50") to cents. Null if invalid. */
export function parseDollarsToCents(value: string): number | null {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

/** Convert cents to a plain dollar string for form inputs, e.g. 450 -> "4.50". */
export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}
