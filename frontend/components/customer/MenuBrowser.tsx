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
        className="mb-6 flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            aria-pressed={active === tab.slug}
            onClick={() => setActive(tab.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              active === tab.slug
                ? "bg-red-700 text-white"
                : "bg-white text-neutral-700 ring-1 ring-amber-300 hover:bg-amber-100"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
