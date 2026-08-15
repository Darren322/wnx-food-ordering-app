import Image from "next/image";
import Link from "next/link";

import {
  GlassPrototypeFrame,
  glassPrototypeBusiness,
  glassPrototypeProducts,
} from "@/components/prototype/glass/GlassPrototypeFrame";
import { categories, products } from "@/data/products";
import { formatCents } from "@/lib/currency";
import type { Product } from "@/types/product";

function startingPriceCents(product: Product): number | null {
  if (product.priceCents !== undefined) return product.priceCents;

  const sizePrices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  return sizePrices.length > 0 ? Math.min(...sizePrices) : null;
}

function priceLabel(product: Product): string {
  const cents = startingPriceCents(product);
  if (cents === null) return "View options";
  return product.options?.sizes ? `From ${formatCents(cents)}` : formatCents(cents);
}

function availabilityLabel(product: Product): string {
  if (product.availability === "sold_out") return "Sold out";
  if (product.availability === "unavailable") return "Unavailable";
  return "Available";
}

function categoryName(product: Product): string {
  return categories.find((category) => category.slug === product.category)?.name ?? product.category;
}

const counterTrays = glassPrototypeProducts.slice(0, 2);

function FoodTray({ product, index }: { product: Product; index: number }) {
  return (
    <article
      className={`gp-solid min-w-0 p-4 sm:p-5 ${
        index === 0 ? "lg:-translate-y-2" : "lg:translate-y-2"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="gp-kicker mb-0">Tray 0{index + 1}</p>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-stone-600">
          {priceLabel(product)}
        </span>
      </div>
      <div className="relative mt-3 h-28 overflow-hidden rounded-[1.25rem] bg-[#e9deca] sm:h-32">
        <Image
          src={product.image}
          alt={`${product.name}, a dish from ${glassPrototypeBusiness.name}`}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 35vw, 84vw"
          className="object-contain p-2"
        />
      </div>
      <div className="mt-4 min-w-0">
        <h3 className="break-words text-lg font-semibold leading-6 text-stone-950">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-stone-500">{categoryName(product)}</p>
        <Link
          href={`/menu/${product.slug}`}
          className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-stone-700 underline decoration-[var(--gp-red)]/40 underline-offset-4 transition hover:text-[var(--gp-red-deep)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gp-red)]"
          aria-label={`Choose ${product.name}`}
        >
          Choose dish <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </div>
    </article>
  );
}

function MenuItem({ product }: { product: Product }) {
  return (
    <li className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-4 border-t border-[var(--gp-line)] py-5 first:border-t-0 sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5">
      <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[#e9deca]">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="76px"
          className="object-contain p-1.5"
        />
      </div>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="break-words text-base font-semibold text-stone-900 sm:text-lg">
            {product.name}
          </h4>
          {product.nameZh ? (
            <span className="font-cjk text-sm text-stone-500">{product.nameZh}</span>
          ) : null}
        </div>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">{product.description}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {availabilityLabel(product)}
        </p>
      </div>
      <div className="col-span-2 flex min-w-0 items-center justify-between gap-4 pl-[5.5rem] sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:pl-0">
        <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--gp-red-deep)]">
          {priceLabel(product)}
        </span>
        <Link
          href={`/menu/${product.slug}`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-stone-700 underline decoration-[var(--gp-red)]/40 underline-offset-4 transition hover:text-[var(--gp-red-deep)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gp-red)]"
          aria-label={`View ${product.name}`}
        >
          View dish <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </div>
    </li>
  );
}

function StatusControl({ product }: { product: Product }) {
  return (
    <div className="w-full min-w-0 sm:w-40">
      <label className="sr-only" htmlFor={`counter-status-${product.slug}`}>
        {product.name} availability
      </label>
      <select
        id={`counter-status-${product.slug}`}
        defaultValue={product.availability}
        disabled
        aria-describedby={`counter-status-note-${product.slug}`}
        className="min-h-11 w-full max-w-full cursor-not-allowed rounded-full border border-[var(--gp-line)] bg-[#fffdf8] px-3 text-sm font-semibold text-stone-700 opacity-100 outline-none disabled:opacity-100"
      >
        <option value="available">Available</option>
        <option value="sold_out">Sold out</option>
        <option value="unavailable">Unavailable</option>
      </select>
      <span id={`counter-status-note-${product.slug}`} className="sr-only">
        Read-only preview control
      </span>
    </div>
  );
}

/**
 * PROTOTYPE ONLY — B2 keeps the layered counter gesture, then quiets the
 * remaining surfaces into an editorial, read-only menu study.
 */
export function GlassVariantB2() {
  const cartTotal = counterTrays.reduce(
    (total, product) => total + (startingPriceCents(product) ?? 0),
    0,
  );
  const availableCount = products.filter((product) => product.availability === "available").length;

  return (
    <GlassPrototypeFrame
      variant="B2 · Restrained Counter"
      summary="A lighter counter hybrid: two warm food trays keep the home hero dimensional, while the menu, cart, and owner desk return to quiet editorial surfaces."
    >
      <main className="mt-6 pb-16" aria-label="Restrained counter glass prototype">
        <div className="sticky top-20 z-30 -mx-1 mb-6 pt-1 sm:mb-8">
          <nav
            aria-label="Prototype surfaces"
            className="gp-glass-strong grid grid-cols-4 gap-2 p-2 sm:gap-4"
          >
            {[
              ["Home", "#counter-home-b2"],
              ["Menu", "#counter-menu-b2"],
              ["Cart", "#counter-cart-b2"],
              ["Admin", "#counter-admin-b2"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="gp-chip !min-h-11 min-w-0 px-2 text-xs sm:text-sm"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <section
          id="counter-home-b2"
          aria-labelledby="counter-home-b2-heading"
          className="scroll-mt-40"
        >
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-7">
            <div className="gp-solid p-5 sm:p-7">
              <p className="gp-kicker">01 · Home / order counter</p>
              <h2
                id="counter-home-b2-heading"
                className="gp-display max-w-xl text-4xl text-stone-950 sm:text-5xl"
              >
                Familiar favourites, set aside for pickup.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
                {glassPrototypeBusiness.heritage}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/menu"
                  className="gp-primary !bg-[#7b2c27] !shadow-none hover:!bg-[#59201d]"
                >
                  Start an order <span aria-hidden="true" className="ml-2 text-lg">→</span>
                </Link>
                <a
                  href="#counter-menu-b2"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-stone-700 underline decoration-[var(--gp-red)]/40 underline-offset-4 transition hover:text-[var(--gp-red-deep)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gp-red)]"
                >
                  Browse dishes
                </a>
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--gp-line)] pt-5 sm:max-w-md">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Since</dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-950">
                    {glassPrototypeBusiness.since}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Stall</dt>
                  <dd className="mt-1 text-lg font-semibold text-stone-950">
                    {glassPrototypeBusiness.stallUnit}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative min-w-0 pb-2 sm:px-2">
              <div aria-hidden="true" className="gp-glass absolute inset-x-0 bottom-0 top-3" />
              <div className="relative grid gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4">
                {counterTrays.map((product, index) => (
                  <FoodTray key={product.slug} index={index} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="counter-menu-b2"
          aria-labelledby="counter-menu-b2-heading"
          className="scroll-mt-40 border-b border-[var(--gp-line)] py-8 sm:py-10"
        >
          <header className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end sm:gap-6">
            <div>
              <p className="gp-kicker">02 · Menu / ledger</p>
              <h2 id="counter-menu-b2-heading" className="gp-display text-4xl text-stone-950 sm:text-5xl">
                The menu, kept legible.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600 sm:justify-self-end">
              Browse the current menu by category. The list stays solid and editorial; only the category controls borrow the glass material.
            </p>
          </header>

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Menu categories">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`#counter-category-${category.slug}`}
                className="gp-chip min-h-11"
              >
                {category.name}
              </a>
            ))}
          </nav>

          <div className="mt-6 divide-y border-y border-[var(--gp-line)]">
            {categories.map((category) => {
              const categoryProducts = products.filter(
                (product) => product.category === category.slug,
              );

              return (
                <section
                  key={category.slug}
                  id={`counter-category-${category.slug}`}
                  aria-labelledby={`counter-category-heading-${category.slug}`}
                  className="scroll-mt-40 grid gap-4 py-6 lg:grid-cols-[minmax(11rem,0.35fr)_minmax(0,0.65fr)] lg:gap-8"
                >
                  <header>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Category</p>
                    <h3
                      id={`counter-category-heading-${category.slug}`}
                      className="gp-display mt-2 text-2xl text-stone-950 sm:text-3xl"
                    >
                      {category.name}
                    </h3>
                    {category.description ? (
                      <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">{category.description}</p>
                    ) : null}
                  </header>
                  <ul className="min-w-0">
                    {categoryProducts.map((product) => (
                      <MenuItem key={product.slug} product={product} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>

        <section
          id="counter-cart-b2"
          aria-labelledby="counter-cart-b2-heading"
          className="scroll-mt-40 border-b border-[var(--gp-line)] py-8 sm:py-10"
        >
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.7fr)] lg:gap-10">
            <div>
              <p className="gp-kicker">03 · Cart / compact summary</p>
              <h2 id="counter-cart-b2-heading" className="gp-display max-w-xl text-4xl text-stone-950 sm:text-5xl">
                A clear handoff before the counter.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
                A small read-only basket preview, using the two dishes set aside above.
              </p>
            </div>

            <article className="gp-solid min-w-0 p-5 sm:p-6" aria-label="Sample cart preview">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--gp-line)] pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Sample basket</p>
                  <h3 className="mt-1 text-xl font-semibold text-stone-950">Ready for pickup</h3>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">2 items</span>
              </div>
              <ul className="divide-y divide-[var(--gp-line)]">
                {counterTrays.map((product) => (
                  <li key={product.slug} className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 py-4">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#e9deca]">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-stone-950">{product.name}</p>
                      <p className="mt-1 text-xs text-stone-500">Qty 1 · {categoryName(product)}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold tabular-nums text-stone-950">{priceLabel(product)}</p>
                  </li>
                ))}
              </ul>
              <dl className="flex items-center justify-between gap-4 border-t border-[var(--gp-line)] pt-4">
                <dt className="text-sm font-semibold text-stone-600">Sample total</dt>
                <dd className="text-lg font-bold tabular-nums text-[var(--gp-red-deep)]">{formatCents(cartTotal)}</dd>
              </dl>
              <Link
                href="/cart"
                className="gp-primary mt-4 w-full !bg-[#7b2c27] !shadow-none hover:!bg-[#59201d]"
              >
                View cart <span aria-hidden="true" className="ml-2 text-lg">→</span>
              </Link>
            </article>
          </div>
        </section>

        <section
          id="counter-admin-b2"
          aria-labelledby="counter-admin-b2-heading"
          className="scroll-mt-40 py-8 sm:py-10"
        >
          <header className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end sm:gap-6">
            <div>
              <p className="gp-kicker">04 · Admin / owner desk</p>
              <h2 id="counter-admin-b2-heading" className="gp-display text-4xl text-stone-950 sm:text-5xl">
                Keep the counter open.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600 sm:justify-self-end">
              Status controls are shown as a read-only snapshot of the shared menu data. Nothing here changes the live menu.
            </p>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.42fr)] lg:gap-10">
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
                      <h3 className="break-words font-semibold text-stone-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-stone-500">{categoryName(product)} · {priceLabel(product)}</p>
                    </div>
                    <StatusControl product={product} />
                  </li>
                ))}
              </ul>
            </div>

            <aside className="gp-solid h-fit min-w-0 p-5" aria-label="Owner snapshot">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Owner snapshot</p>
              <dl className="mt-4 divide-y divide-[var(--gp-line)] text-sm">
                <div className="flex min-h-11 items-center justify-between gap-4">
                  <dt className="text-stone-500">Menu items</dt>
                  <dd className="font-semibold tabular-nums text-stone-900">{products.length}</dd>
                </div>
                <div className="flex min-h-11 items-center justify-between gap-4">
                  <dt className="text-stone-500">Categories</dt>
                  <dd className="font-semibold tabular-nums text-stone-900">{categories.length}</dd>
                </div>
                <div className="flex min-h-11 items-center justify-between gap-4">
                  <dt className="text-stone-500">Available now</dt>
                  <dd className="font-semibold tabular-nums text-stone-900">{availableCount}</dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-[var(--gp-line)] pt-4 text-sm leading-6 text-stone-600">
                {glassPrototypeBusiness.stallUnit} · {glassPrototypeBusiness.paymentsAccepted[0]}
              </p>
            </aside>
          </div>
        </section>
      </main>
    </GlassPrototypeFrame>
  );
}
