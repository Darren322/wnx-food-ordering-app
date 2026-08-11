"use client";

import Link from "next/link";
import type { CartLine } from "@/types/cart";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/ui/ProductImage";

function SelectionSummary({ line }: { line: CartLine }) {
  const parts: string[] = [];
  if (line.selection.sizeName) parts.push(`Size: ${line.selection.sizeName}`);
  if (line.selection.choiceName) {
    parts.push(
      `${line.selection.choiceGroupName ?? "Option"}: ${line.selection.choiceName}`
    );
  }
  if (line.selection.checkboxNames && line.selection.checkboxNames.length > 0) {
    parts.push(line.selection.checkboxNames.join(", "));
  }
  if (parts.length === 0) return null;
  return <p className="text-xs text-neutral-500">{parts.join(" · ")}</p>;
}

export function CartView() {
  const { lines, hydrated, updateQuantity, removeLine, subtotalCents } =
    useCart();

  if (!hydrated) {
    return <p className="text-sm text-neutral-500">Loading your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-white p-8 text-center">
        <p className="text-neutral-600">Your cart is empty.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line.id}
            className="flex gap-4 rounded-xl border border-amber-200 bg-white p-4"
          >
            {line.image ? (
              <ProductImage
                src={line.image}
                alt={line.productName}
                width={96}
                height={96}
                className="h-20 w-24 rounded-lg bg-amber-50 object-contain"
              />
            ) : null}
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{line.productName}</p>
                  <SelectionSummary line={line} />
                  <p className="text-sm text-neutral-600">
                    {formatCents(line.unitPriceCents)} each
                  </p>
                </div>
                <p className="font-bold text-red-800">
                  {formatCents(lineSubtotalCents(line))}
                </p>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center rounded-lg ring-1 ring-amber-300">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${line.productName}`}
                    onClick={() => updateQuantity(line.id, line.quantity - 1)}
                    className="px-3 py-1 text-lg"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${line.productName}`}
                    onClick={() => updateQuantity(line.id, line.quantity + 1)}
                    className="px-3 py-1 text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="text-sm text-red-700 underline hover:text-red-900"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-lg">
          Order subtotal:{" "}
          <span className="font-bold text-red-800">
            {formatCents(subtotalCents)}
          </span>
        </p>
        <Link
          href="/checkout"
          className="rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
