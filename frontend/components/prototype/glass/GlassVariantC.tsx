import Image from "next/image";

import {
  GlassPrototypeFrame,
  glassPrototypeBusiness,
  glassPrototypeProducts,
} from "@/components/prototype/glass/GlassPrototypeFrame";
import { categories, products } from "@/data/products";
import { formatCents } from "@/lib/currency";
import type { Product } from "@/types/product";

function productPrice(product: Product): string {
  if (product.priceCents !== undefined) return formatCents(product.priceCents);

  const sizePrices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  return sizePrices.length > 0
    ? `From ${formatCents(Math.min(...sizePrices))}`
    : "See options";
}

function availabilityLabel(availability: Product["availability"]): string {
  if (availability === "sold_out") return "Sold out";
  if (availability === "unavailable") return "Unavailable";
  return "Available";
}

function categoryName(slug: string): string {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

function AvailabilityControl({ product }: { product: Product }) {
  return (
    <div className="sm:justify-self-end">
      <label
        className="sr-only"
        htmlFor={`quiet-status-${product.slug}`}
      >
        {product.name} availability
      </label>
      <select
        id={`quiet-status-${product.slug}`}
        defaultValue={product.availability}
        disabled
        aria-describedby={`quiet-status-note-${product.slug}`}
        className="gp-glass min-h-11 w-full max-w-full cursor-not-allowed appearance-none px-3 text-sm font-semibold text-stone-700 opacity-100 outline-none disabled:opacity-100"
      >
        <option value="available">Available</option>
        <option value="sold_out">Sold out</option>
        <option value="unavailable">Unavailable</option>
      </select>
      <span id={`quiet-status-note-${product.slug}`} className="sr-only">
        Read-only preview control
      </span>
    </div>
  );
}

/**
 * PROTOTYPE ONLY — quiet editorial interpretation of the shared glass
 * material. All controls are intentionally read-only and use current data.
 */
export function GlassVariantC() {
  return (
    <GlassPrototypeFrame
      variant="C · Quiet Lens"
      summary="A quiet, editorial storefront study: solid paper and hairline rules carry the story while glass is reserved for navigation, category controls, the cart summary, and menu status."
    >
      <div className="mt-7">
        <div className="sticky top-3 z-30 -mx-1 mb-8 pt-1">
          <nav
            aria-label="Prototype surfaces"
            className="gp-glass-strong flex flex-wrap gap-1 p-1.5"
          >
            <a
              href="#quiet-home"
              className="gp-chip !min-h-11 min-w-0 flex-1 px-3 text-xs sm:flex-none sm:px-4 sm:text-sm"
            >
              Home
            </a>
            <a
              href="#quiet-menu"
              className="gp-chip !min-h-11 min-w-0 flex-1 px-3 text-xs sm:flex-none sm:px-4 sm:text-sm"
            >
              Menu
            </a>
            <a
              href="#quiet-cart"
              className="gp-chip !min-h-11 min-w-0 flex-1 px-3 text-xs sm:flex-none sm:px-4 sm:text-sm"
            >
              Cart
            </a>
            <a
              href="#quiet-admin"
              className="gp-chip !min-h-11 min-w-0 flex-1 px-3 text-xs sm:flex-none sm:px-4 sm:text-sm"
            >
              Admin
            </a>
          </nav>
        </div>

        <div>
          <section
            id="quiet-home"
            aria-labelledby="quiet-home-heading"
            className="scroll-mt-24 border-b border-[var(--gp-line)] pb-12 sm:pb-16"
          >
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:gap-16">
              <div>
                <p className="gp-kicker">Home · Whampoa</p>
                <h2
                  id="quiet-home-heading"
                  className="gp-display max-w-2xl text-4xl text-stone-950 sm:text-5xl lg:text-6xl"
                >
                  At Whampoa since {glassPrototypeBusiness.since}.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                  {glassPrototypeBusiness.heritage}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#quiet-menu"
                    className="gp-primary min-h-11"
                  >
                    Read the menu
                    <span aria-hidden="true" className="ml-2 text-lg">
                      ↗
                    </span>
                  </a>
                  <a
                    href="#quiet-cart"
                    className="gp-secondary min-h-11"
                  >
                    View cart
                  </a>
                </div>
              </div>

              <figure className="border-y border-[var(--gp-line)] py-5 sm:py-7">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#e7dac6]">
                  <Image
                    src="/images/signboard.png"
                    alt={`Original ${glassPrototypeBusiness.name} stall signboard`}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    className="object-contain p-5 sm:p-8"
                  />
                </div>
                <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-stone-600">
                  <span>{glassPrototypeBusiness.name}</span>
                  <span className="font-cjk text-xs text-stone-500">
                    {glassPrototypeBusiness.nameZh}
                  </span>
                </figcaption>
              </figure>
            </div>

            <dl className="mt-10 grid gap-5 border-t border-[var(--gp-line)] pt-5 sm:grid-cols-3 sm:gap-6">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Since
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900">
                  {glassPrototypeBusiness.since}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Stall
                </dt>
                <dd className="mt-1 text-lg font-semibold text-stone-900">
                  {glassPrototypeBusiness.stallUnit}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Categories
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900">
                  {categories.length}
                </dd>
              </div>
            </dl>

            <div className="mt-12 border-t border-[var(--gp-line)] pt-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="gp-kicker">From the menu</p>
                  <h3 className="gp-display text-3xl text-stone-950 sm:text-4xl">
                    A few familiar choices.
                  </h3>
                </div>
                <a
                  href="#quiet-menu"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-stone-700 underline decoration-[var(--gp-red)]/40 underline-offset-4 transition hover:text-[var(--gp-red-deep)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gp-red)]"
                >
                  See full menu <span aria-hidden="true" className="ml-2">→</span>
                </a>
              </div>

              <ol className="mt-6 divide-y border-y border-[var(--gp-line)]">
                {glassPrototypeProducts.map((product, index) => (
                  <li
                    key={product.slug}
                    className="grid min-w-0 gap-3 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5"
                  >
                    <span className="text-sm font-semibold tabular-nums text-stone-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="break-words font-semibold text-stone-900">
                        {product.name}
                        {product.nameZh ? (
                          <span className="ml-2 font-normal text-stone-500">
                            {product.nameZh}
                          </span>
                        ) : null}
                      </h4>
                      <p className="mt-1 line-clamp-1 text-sm text-stone-500">
                        {product.description}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-[var(--gp-red-deep)] sm:text-right">
                      {productPrice(product)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section
            id="quiet-menu"
            aria-labelledby="quiet-menu-heading"
            className="scroll-mt-24 border-b border-[var(--gp-line)] py-12 sm:py-16"
          >
            <header className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end sm:gap-8">
              <div>
                <p className="gp-kicker">Menu · Ledger</p>
                <h2
                  id="quiet-menu-heading"
                  className="gp-display text-4xl text-stone-950 sm:text-5xl"
                >
                  The menu.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-stone-600 sm:justify-self-end">
                Browse the categories and current availability below. The list
                is shown from the shared product data used by this prototype.
              </p>
            </header>

            <nav
              aria-label="Menu categories"
              className="mt-7 flex flex-wrap gap-2"
            >
              {categories.map((category) => (
                <a
                  key={category.slug}
                  href={`#quiet-category-${category.slug}`}
                  className="gp-chip !min-h-11"
                >
                  {category.name}
                </a>
              ))}
            </nav>

            <div className="mt-8 divide-y border-y border-[var(--gp-line)]">
              {categories.map((category) => {
                const categoryProducts = products.filter(
                  (product) => product.category === category.slug,
                );

                return (
                  <section
                    key={category.slug}
                    id={`quiet-category-${category.slug}`}
                    aria-labelledby={`quiet-category-heading-${category.slug}`}
                    className="scroll-mt-24 grid gap-6 py-8 lg:grid-cols-[minmax(11rem,0.34fr)_minmax(0,0.66fr)] lg:gap-12"
                  >
                    <header>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                        Category
                      </p>
                      <h3
                        id={`quiet-category-heading-${category.slug}`}
                        className="gp-display mt-2 text-2xl text-stone-950 sm:text-3xl"
                      >
                        {category.name}
                      </h3>
                      {category.description ? (
                        <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">
                          {category.description}
                        </p>
                      ) : null}
                    </header>

                    <ul className="min-w-0 divide-y divide-[var(--gp-line)]">
                      {categoryProducts.map((product) => (
                        <li
                          key={product.slug}
                          className="grid min-w-0 gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <h4 className="break-words text-base font-semibold text-stone-900 sm:text-lg">
                                {product.name}
                              </h4>
                              {product.nameZh ? (
                                <span className="font-cjk text-sm text-stone-500">
                                  {product.nameZh}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                              {product.description}
                            </p>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                              {availabilityLabel(product.availability)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 sm:flex-col sm:items-end sm:justify-start">
                            <span className="text-sm font-semibold tabular-nums text-[var(--gp-red-deep)]">
                              {productPrice(product)}
                            </span>
                            <a
                              href="#quiet-cart"
                              className="inline-flex min-h-11 items-center text-sm font-semibold text-stone-700 underline decoration-[var(--gp-red)]/40 underline-offset-4 transition hover:text-[var(--gp-red-deep)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gp-red)]"
                              aria-label={`Preview ${product.name} in cart`}
                            >
                              Preview cart <span aria-hidden="true" className="ml-2">→</span>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id="quiet-cart"
            aria-labelledby="quiet-cart-heading"
            className="scroll-mt-24 border-b border-[var(--gp-line)] py-12 sm:py-16"
          >
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.7fr)] lg:gap-16">
              <div>
                <p className="gp-kicker">Cart · Compact summary</p>
                <h2
                  id="quiet-cart-heading"
                  className="gp-display max-w-xl text-4xl text-stone-950 sm:text-5xl"
                >
                  Keep the finish simple.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
                  This read-only preview shows the calmest cart state before a
                  dish has been selected.
                </p>
              </div>

              <aside className="gp-glass p-5 sm:p-6" aria-label="Cart summary">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--gp-line)] pb-4">
                  <h3 className="text-lg font-semibold text-stone-900">Your cart</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    0 items
                  </span>
                </div>
                <dl className="divide-y divide-[var(--gp-line)] text-sm">
                  <div className="flex min-h-11 items-center justify-between gap-4">
                    <dt className="text-stone-600">Items</dt>
                    <dd className="font-semibold tabular-nums text-stone-900">0</dd>
                  </div>
                  <div className="flex min-h-11 items-center justify-between gap-4">
                    <dt className="text-stone-600">Total</dt>
                    <dd className="font-semibold tabular-nums text-stone-900">—</dd>
                  </div>
                </dl>
                <a
                  href="#quiet-menu"
                  className="gp-primary mt-4 min-h-11 w-full"
                >
                  Browse the menu
                </a>
              </aside>
            </div>
          </section>

          <section
            id="quiet-admin"
            aria-labelledby="quiet-admin-heading"
            className="scroll-mt-24 py-12 sm:py-16"
          >
            <header className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end sm:gap-8">
              <div>
                <p className="gp-kicker">Admin · Availability</p>
                <h2
                  id="quiet-admin-heading"
                  className="gp-display text-4xl text-stone-950 sm:text-5xl"
                >
                  A small owner ledger.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-stone-600 sm:justify-self-end">
                Status values below are taken directly from the menu data. The
                controls are intentionally disabled in this read-only study.
              </p>
            </header>

            <div className="mt-8 grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.42fr)] lg:gap-14">
              <div className="min-w-0 border-y border-[var(--gp-line)]">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[var(--gp-line)] py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <span>Menu item</span>
                  <span>Status</span>
                </div>
                <ul className="divide-y divide-[var(--gp-line)]">
                  {products.map((product) => (
                    <li
                      key={product.slug}
                      className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-5"
                    >
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-stone-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-stone-500">
                          {categoryName(product.category)}
                        </p>
                      </div>
                      <AvailabilityControl product={product} />
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="border-t border-[var(--gp-line)] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Store notes
                </p>
                <dl className="mt-4 divide-y divide-[var(--gp-line)] text-sm">
                  <div className="py-3 first:pt-0">
                    <dt className="text-stone-500">Stall</dt>
                    <dd className="mt-1 font-semibold text-stone-900">
                      {glassPrototypeBusiness.stallUnit}
                    </dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-stone-500">Online payment</dt>
                    <dd className="mt-1 leading-6 font-semibold text-stone-900">
                      {glassPrototypeBusiness.paymentsAccepted[0]}
                    </dd>
                  </div>
                  <div className="py-3 last:pb-0">
                    <dt className="text-stone-500">Counter payment</dt>
                    <dd className="mt-1 leading-6 font-semibold text-stone-900">
                      {glassPrototypeBusiness.paymentsAccepted[1]}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </GlassPrototypeFrame>
  );
}
