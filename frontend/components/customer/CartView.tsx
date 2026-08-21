"use client";

import Link from "next/link";
import type { CartLine } from "@/types/cart";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { productImageCropClass } from "@/lib/product-image";
import { useCart } from "@/components/cart/CartProvider";
import { PickupContext } from "@/components/customer/HomePickupDialog";
import { ProductImage } from "@/components/ui/ProductImage";

function SelectionSummary({ line }: { line: CartLine }) {
  const parts: string[] = [];
  if (line.selection.sizeName) parts.push(`Size: ${line.selection.sizeName}`);
  if (line.selection.choiceName) {
    parts.push(
      `${line.selection.choiceGroupName ?? "Option"}: ${line.selection.choiceName}`,
    );
  }
  if (line.selection.checkboxNames && line.selection.checkboxNames.length > 0) {
    parts.push(line.selection.checkboxNames.join(", "));
  }
  if (parts.length === 0) return null;
  return <p className="mt-1 text-xs leading-5 text-stone-500">{parts.join(" · ")}</p>;
}

function CartLineRow({
  line,
  index,
  onQuantityChange,
  onRemove,
}: {
  line: CartLine;
  index: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <li
      className="population-enter min-w-0 p-3 sm:p-4"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-[#eee5d5] ring-1 ring-stone-900/5">
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
          <div className="flex items-start justify-between gap-3 sm:block">
            <p className="break-words font-semibold text-stone-950">
              {line.productName}
            </p>
            <p className="shrink-0 font-bold tabular-nums text-brand sm:mt-1">
              {formatCents(lineSubtotalCents(line))}
            </p>
          </div>
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
            Edit item
          </Link>
        </div>

        <div className="col-span-2 flex min-w-0 flex-wrap items-center justify-end gap-2 border-t border-stone-900/10 pt-3 sm:col-span-1 sm:border-t-0 sm:pt-0">
          <div className="flex items-center rounded-md border border-stone-300 bg-paper">
            <button
              type="button"
              aria-label={`Decrease quantity of ${line.productName}`}
              onClick={() => onQuantityChange(line.quantity - 1)}
              disabled={line.quantity <= 1}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${line.productName}`}
              onClick={() => onQuantityChange(line.quantity + 1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex min-h-11 items-center rounded-sm px-2 text-sm font-semibold text-stone-500 underline decoration-stone-300 underline-offset-4 outline-none transition hover:text-brand-dark hover:decoration-brand/40 focus-visible:ring-2 focus-visible:ring-brand"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartView() {
  const { lines, hydrated, updateQuantity, removeLine, subtotalCents } = useCart();

  if (!hydrated) {
    return <p className="text-sm text-stone-500">Loading cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="surface-solid p-10 text-center">
        <p className="font-semibold text-stone-950">Your cart is empty.</p>
        <p className="mt-2 text-sm text-stone-600">
          Browse the menu to add a dish before choosing pickup.
        </p>
        <Link href="/menu" className="btn-primary mt-5">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.62fr)] lg:gap-8">
      <section aria-labelledby="cart-items-heading" className="min-w-0">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 id="cart-items-heading" className="text-lg font-semibold text-stone-950">
            Your items
          </h2>
          <span className="text-sm text-stone-500">
            {lines.reduce((count, line) => count + line.quantity, 0)} items
          </span>
        </div>
        <ul className="surface-solid divide-y divide-stone-900/10 overflow-hidden">
          {lines.map((line, index) => (
            <CartLineRow
              key={line.id}
              line={line}
              index={index}
              onQuantityChange={(quantity) => updateQuantity(line.id, quantity)}
              onRemove={() => removeLine(line.id)}
            />
          ))}
        </ul>
      </section>

      <aside
        className="surface-solid h-fit p-5 sm:p-6 lg:sticky lg:top-[calc(var(--app-header-offset)+1rem)]"
        aria-label="Cart summary"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="page-kicker mb-2">Your preorder</p>
            <h2 className="font-display text-2xl font-medium text-stone-950">
              Order summary
            </h2>
          </div>
          <span className="text-sm text-stone-500">
            {lines.length} {lines.length === 1 ? "line" : "lines"}
          </span>
        </div>

        <div className="mt-5 border-y border-stone-900/10 py-4">
          <PickupContext showAvailability={false} compactAction />
        </div>

        <dl className="mt-5 border-t border-stone-900/10 pt-4">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm font-semibold text-stone-600">Subtotal</dt>
            <dd className="text-lg font-bold tabular-nums text-brand">
              {formatCents(subtotalCents)}
            </dd>
          </div>
        </dl>

        <div className="sticky bottom-3 z-20 mt-5 border border-stone-900/10 bg-paper p-2 sm:static sm:border-0 sm:bg-transparent sm:p-0">
          <Link href="/checkout" className="btn-primary w-full">
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
