"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category, Product } from "@/types/product";
import { ProductCard } from "@/components/customer/ProductCard";
import { useCart } from "@/components/cart/CartProvider";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { loadCustomerCatalog } from "@/lib/catalog-storage";

interface MenuBrowserProps {
  categories: Category[];
  products: Product[];
}

interface CategoryNavProps {
  tabs: Category[];
  active: string;
  onChange: (slug: string) => void;
}

function CategoryNav({ tabs, active, onChange }: CategoryNavProps) {
  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[var(--app-header-offset)] z-10 -mx-4 mb-5 overflow-x-auto border-y border-stone-900/10 bg-paper px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:mb-0 lg:overflow-visible lg:border-0 lg:px-0"
    >
      <div className="flex w-max min-w-full gap-1 py-1 lg:block lg:w-auto lg:min-w-0 lg:space-y-1 lg:py-0">
        {tabs.map((tab) => {
          const selected = active === tab.slug;

          return (
            <button
              key={tab.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(tab.slug)}
              className={`inline-flex min-h-11 shrink-0 items-center border-b-2 px-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:flex lg:w-full lg:justify-start lg:border-b-0 lg:border-l-[3px] lg:px-3 lg:text-left ${
                selected
                  ? "border-brand text-brand"
                  : "border-transparent text-stone-600 hover:border-stone-300 hover:text-stone-950"
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function selectionSummary(line: {
  selection: { sizeName?: string; choiceName?: string; checkboxNames?: string[] };
}): string | null {
  const parts = [line.selection.sizeName, line.selection.choiceName].filter(
    (part): part is string => Boolean(part),
  );

  if (line.selection.checkboxNames?.length) {
    parts.push(...line.selection.checkboxNames);
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}

function CartRail() {
  const { lines, hydrated, itemCount, subtotalCents } = useCart();

  return (
    <aside
      aria-label="Cart summary"
      className="hidden min-w-0 lg:sticky lg:top-[calc(var(--app-header-offset)+1rem)] lg:block"
    >
      <div className="border border-stone-900/10 bg-surface p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 border-b border-stone-900/10 pb-4">
          <h2 className="text-lg font-semibold text-stone-950">Your order</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        {!hydrated ? (
          <p className="py-5 text-sm text-stone-500">Loading cart…</p>
        ) : lines.length === 0 ? (
          <p className="py-5 text-sm leading-5 text-stone-600">
            Your cart is empty. Add a dish to start your order.
          </p>
        ) : (
          <ul className="divide-y divide-stone-900/10">
            {lines.map((line) => {
              const options = selectionSummary(line);

              return (
                <li
                  key={line.id}
                  className="flex items-start justify-between gap-3 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-stone-900">
                      <span className="mr-1 tabular-nums text-stone-500">
                        {line.quantity}×
                      </span>
                      {line.productName}
                    </p>
                    {options ? (
                      <p className="mt-0.5 break-words text-xs text-stone-500">
                        {options}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 tabular-nums text-stone-700">
                    {formatCents(lineSubtotalCents(line))}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-stone-900/10 pt-4">
          <span className="text-sm font-semibold text-stone-600">Subtotal</span>
          <span className="font-bold tabular-nums text-brand">
            {formatCents(subtotalCents)}
          </span>
        </div>
        <Link href="/cart" className="btn-primary mt-4 w-full text-sm">
          View cart
        </Link>
      </div>
    </aside>
  );
}

function MobileCartBar() {
  const { hydrated, itemCount, subtotalCents } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-900/15 bg-paper px-4 py-3 shadow-[0_-8px_24px_-20px_rgba(28,25,23,0.55)] lg:hidden">
      <Link
        href="/cart"
        className="btn-primary w-full justify-between px-4 text-sm"
        aria-label={`View cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      >
        <span>{hydrated && itemCount > 0 ? "View cart" : "Cart"}</span>
        <span className="tabular-nums">
          {itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? "item" : "items"} · `
            : ""}
          {formatCents(subtotalCents)}
        </span>
      </Link>
    </div>
  );
}

/**
 * Category filtering and ordering rails for the menu. The initial render
 * contains the complete catalogue, while the client adds quick filtering and
 * the existing cart summary without changing product or storage contracts.
 */
export function MenuBrowser({
  categories: defaultCategories,
  products: defaultProducts,
}: MenuBrowserProps) {
  const [active, setActive] = useState<string>("all");
  const [catalog, setCatalog] = useState({
    categories: defaultCategories,
    products: defaultProducts,
  });

  useEffect(() => {
    setCatalog(
      loadCustomerCatalog({
        categories: defaultCategories,
        products: defaultProducts,
      }),
    );
  }, [defaultCategories, defaultProducts]);

  const { categories, products } = catalog;

  const visible =
    active === "all"
      ? products
      : products.filter((product) => product.category === active);
  const tabs: Category[] = [{ slug: "all", name: "All dishes" }, ...categories];
  const activeCategory = categories.find((category) => category.slug === active);
  const listHeading = activeCategory?.name ?? "All dishes";
  const listDescription =
    activeCategory?.description ??
    "Chicken rice favourites and our signature dry laksa, ready to add to your order.";

  return (
    <div className="relative pb-24 lg:pb-0">
      <div className="grid items-start gap-x-7 lg:grid-cols-[minmax(10rem,12rem)_minmax(0,1fr)_minmax(15rem,18rem)]">
        <CategoryNav tabs={tabs} active={active} onChange={setActive} />

        <section aria-labelledby="menu-list-heading" className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2
                id="menu-list-heading"
                className="text-xl font-semibold tracking-[-0.015em] text-stone-950 sm:text-2xl"
              >
                {listHeading}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-stone-600">
                {listDescription}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
              {visible.length} {visible.length === 1 ? "dish" : "dishes"}
            </span>
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? "dish" : "dishes"}
            in {listHeading}
          </p>

          {visible.length > 0 ? (
            <div
              role="list"
              className="divide-y border-y border-stone-900/10 bg-surface"
            >
              {visible.map((product, index) => (
                <div
                  key={`${active}-${product.slug}`}
                  className="population-enter"
                  style={{ animationDelay: `${index * 45}ms` }}
                  role="listitem"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div
              role="status"
              className="border-y border-stone-900/10 bg-surface px-5 py-10 text-center"
            >
              <p className="font-semibold text-stone-900">No dishes here yet.</p>
              <p className="mt-1 text-sm text-stone-600">
                Choose another category to keep browsing.
              </p>
            </div>
          )}
        </section>

        <CartRail />
      </div>

      <MobileCartBar />
    </div>
  );
}
