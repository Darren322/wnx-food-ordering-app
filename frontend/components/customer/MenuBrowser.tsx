"use client";

import { useState } from "react";
import type { Category, Product } from "@/types/product";
import { ProductCard } from "@/components/customer/ProductCard";

interface MenuBrowserProps {
  categories: Category[];
  products: Product[];
}

/**
 * Category filter for the menu. Renders client-side but is server-rendered
 * with "All" active, so the initial HTML always contains the full menu.
 */
export function MenuBrowser({ categories, products }: MenuBrowserProps) {
  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all"
      ? products
      : products.filter((p) => p.category === active);

  const tabs = [{ slug: "all", name: "All" }, ...categories];

  return (
    <div>
      <nav
        aria-label="Menu categories"
        className="sticky top-[var(--app-header-offset)] z-10 -mx-4 mb-7 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="toolbar-glass flex w-max gap-2 p-1.5">
          {tabs.map((tab) => {
            const selected = active === tab.slug;

            return (
              <button
                key={tab.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(tab.slug)}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                  selected
                    ? "bg-cta text-white shadow-[inset_0_1px_0_rgba(255,248,237,0.24),0_7px_16px_-10px_rgba(92,31,27,0.75)]"
                    : "text-stone-600 hover:bg-white hover:text-stone-950"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </nav>
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "dish" : "dishes"}
      </p>
      <div
        role="list"
        className="divide-y border-y border-[var(--glass-line)]"
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
    </div>
  );
}
