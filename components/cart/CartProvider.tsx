"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, CartLineSelection } from "@/types/cart";
import { lineSubtotalCents } from "@/types/cart";

const STORAGE_KEY = "wnx-cart";

/** Stable id for a cart line: same product + same selection merge into one line. */
export function makeLineId(
  productSlug: string,
  selection: CartLineSelection
): string {
  return [
    productSlug,
    selection.sizeId ?? "",
    selection.choiceId ?? "",
    (selection.checkboxIds ?? []).slice().sort().join("+"),
  ].join("|");
}

interface CartContextValue {
  lines: CartLine[];
  /** False until the cart has been read from localStorage (client only). */
  hydrated: boolean;
  itemCount: number;
  subtotalCents: number;
  addLine: (line: CartLine) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // Corrupt or unavailable storage — start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addLine = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === line.id);
      if (existing) {
        return prev.map((l) =>
          l.id === line.id ? { ...l, quantity: l.quantity + line.quantity } : l
        );
      }
      return [...prev, line];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l))
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotalCents = lines.reduce(
      (sum, l) => sum + lineSubtotalCents(l),
      0
    );
    return {
      lines,
      hydrated,
      itemCount,
      subtotalCents,
      addLine,
      updateQuantity,
      removeLine,
      clearCart,
    };
  }, [lines, hydrated, addLine, updateQuantity, removeLine, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
