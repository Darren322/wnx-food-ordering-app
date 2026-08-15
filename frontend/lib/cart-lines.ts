import type { CartLine } from "@/types/cart";

/**
 * Atomically replaces one cart line. If the edited configuration now matches
 * another line, the two quantities merge instead of leaving duplicate ids.
 */
export function replaceCartLine(
  lines: CartLine[],
  originalId: string,
  replacement: CartLine
): CartLine[] {
  const originalIndex = lines.findIndex((line) => line.id === originalId);
  if (originalIndex === -1) return lines;

  const withoutOriginal = lines.filter((line) => line.id !== originalId);
  const matchingIndex = withoutOriginal.findIndex(
    (line) => line.id === replacement.id
  );

  if (matchingIndex !== -1) {
    return withoutOriginal.map((line, index) =>
      index === matchingIndex
        ? { ...replacement, quantity: line.quantity + replacement.quantity }
        : line
    );
  }

  const next = [...withoutOriginal];
  next.splice(Math.min(originalIndex, next.length), 0, replacement);
  return next;
}
