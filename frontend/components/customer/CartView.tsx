"use client";

import Link from "next/link";
import type { CartLine } from "@/types/cart";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { productImageCropClass } from "@/lib/product-image";
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
  return <p className="text-xs text-stone-500">{parts.join(" · ")}</p>;
}

export function CartView() {
  const {
    lines,
    hydrated,
    updateQuantity,
    removeLine,
    subtotalCents,
  } = useCart();

  if (!hydrated) {
    return <p className="text-sm text-stone-500">Loading…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="surface-glass p-10 text-center">
        <p className="text-stone-600">Your cart is empty.</p>
        <Link
          href="/menu"
          className="btn-primary mt-5"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.62fr)] lg:gap-10">
      <ul className="surface-solid divide-y divide-stone-900/10 overflow-hidden px-4 sm:px-6">
        {lines.map((line, index) => (
          <li
            key={line.id}
            className="population-enter grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-4 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:py-5"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#eee5d5] ring-1 ring-stone-900/5">
              {line.image ? (
                <ProductImage
                  src={line.image}
                  alt={line.productName}
                  width={96}
                  height={96}
                  fill
                  sizes="(min-width: 640px) 80px, 72px"
                  className={`h-full w-full ${
                    line.productSlug === "dry-laksa"
                      ? "object-contain p-1.5"
                      : `object-cover ${productImageCropClass(line.productSlug)}`
                  }`}
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="break-words font-semibold text-stone-950">
                {line.productName}
              </p>
              <SelectionSummary line={line} />
              <p className="mt-1 text-sm text-stone-600">
                {formatCents(line.unitPriceCents)} each
              </p>
              <Link
                href={{
                  pathname: `/menu/${line.productSlug}`,
                  query: { edit: line.id },
                }}
                className="text-link mt-1 text-sm"
              >
                Edit
              </Link>
            </div>
            <div className="col-span-2 flex min-w-0 flex-col items-end gap-2 pl-[5.5rem] sm:col-span-1 sm:justify-center sm:gap-3 sm:pl-0">
              <p className="shrink-0 font-bold tabular-nums text-brand">
                {formatCents(lineSubtotalCents(line))}
              </p>
              <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
                <div className="flex items-center rounded-full border border-stone-200 bg-surface shadow-sm">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${line.productName}`}
                    onClick={() => updateQuantity(line.id, line.quantity - 1)}
                    disabled={line.quantity <= 1}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent"
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
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-stone-500 underline decoration-stone-300 underline-offset-4 outline-none transition hover:text-brand-dark hover:decoration-brand/40 focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside
        className="surface-glass-strong h-fit p-5 sm:p-6 lg:sticky lg:top-[calc(var(--app-header-offset)+1rem)]"
        aria-label="Cart summary"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-medium text-stone-950">
            Summary
          </h2>
        </div>
        <dl className="mt-6 border-t border-stone-900/10 pt-4">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-semibold text-stone-600">Subtotal</dt>
            <dd className="text-lg font-bold tabular-nums text-brand">
              {formatCents(subtotalCents)}
            </dd>
          </div>
        </dl>
        <Link href="/checkout" className="btn-primary mt-5 w-full">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
