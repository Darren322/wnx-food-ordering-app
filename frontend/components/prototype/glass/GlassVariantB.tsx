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

  const prices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  return prices.length > 0 ? Math.min(...prices) : null;
}

function startingPriceLabel(product: Product): string {
  const cents = startingPriceCents(product);
  return cents === null ? "View options" : formatCents(cents);
}

function availabilityLabel(product: Product): string {
  if (product.availability === "sold_out") return "Sold out";
  if (product.availability === "unavailable") return "Unavailable";
  return "Available";
}

function categoryName(product: Product): string {
  return categories.find((category) => category.slug === product.category)?.name ?? product.category;
}

function ProductTray({ product, index }: { product: Product; index: number }) {
  return (
    <article
      className={`gp-glass-strong relative min-w-0 p-4 sm:p-5 ${
        index === 0 ? "lg:-translate-y-5" : index === 1 ? "lg:translate-y-4" : "lg:-translate-y-1"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="gp-kicker mb-0">Tray 0{index + 1}</p>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-stone-500">
          {startingPriceLabel(product)}
        </span>
      </div>
      <div className="relative mt-4 h-28 overflow-hidden rounded-2xl bg-[#e9deca] sm:h-32">
        <Image
          src={product.image}
          alt={`${product.name}, a dish from ${glassPrototypeBusiness.name}`}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 36vw, 88vw"
          className="object-contain p-2"
        />
      </div>
      <div className="mt-4 flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-stone-950">{product.name}</h3>
          <p className="mt-1 truncate text-xs text-stone-500">{categoryName(product)}</p>
        </div>
        <Link
          href={`/menu/${product.slug}`}
          className="gp-secondary min-h-11 shrink-0 px-3 text-xs"
          aria-label={`Choose ${product.name}`}
        >
          Choose
        </Link>
      </div>
    </article>
  );
}

function MenuRow({ product }: { product: Product }) {
  return (
    <li className="gp-solid min-w-0 p-4 sm:p-5">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#e9deca] sm:h-20 sm:w-20">
          <Image
            src={product.image}
            alt={`${product.name}, a dish from ${glassPrototypeBusiness.name}`}
            fill
            sizes="80px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="font-semibold text-stone-950">
              {product.name}
              {product.nameZh ? (
                <span className="ml-2 font-normal text-stone-500">{product.nameZh}</span>
              ) : null}
            </h3>
            <p className="shrink-0 text-sm font-bold tabular-nums text-[#7b2c27]">
              {startingPriceLabel(product)}
            </p>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-600">
            {product.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              {availabilityLabel(product)}
            </span>
            <Link
              href={`/menu/${product.slug}`}
              className="gp-secondary min-h-11 px-3 text-xs"
              aria-label={`View ${product.name} details`}
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * PROTOTYPE ONLY — a read-only counter composition for comparing the shared
 * heritage-glass material. It intentionally does not read or write cart or
 * admin state.
 */
export function GlassVariantB() {
  const cartPreview = glassPrototypeProducts.slice(0, 2);
  const cartTotal = cartPreview.reduce(
    (total, product) => total + (startingPriceCents(product) ?? 0),
    0,
  );

  return (
    <GlassPrototypeFrame
      variant="B · Layered Counter"
      summary="A dimensional digital counter: warm glass trays guide the eye, while the menu, basket, and owner desk stay on calm opaque surfaces."
    >
      <main className="mt-7 pb-20" aria-label="Layered counter glass prototype">
        <section
          id="counter-home"
          aria-labelledby="counter-home-heading"
          className="relative grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-0"
        >
          <article className="gp-solid relative z-20 p-6 sm:p-8 lg:my-6 lg:p-10">
            <p className="gp-kicker">01 · Home / order counter</p>
            <h2
              id="counter-home-heading"
              className="gp-display max-w-xl text-4xl text-stone-950 sm:text-5xl"
            >
              Familiar favourites, set aside for your pickup.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              {glassPrototypeBusiness.heritage}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/menu" className="gp-primary">
                Start an order
                <span aria-hidden="true">→</span>
              </Link>
              <span className="text-sm text-stone-600">
                Stall {glassPrototypeBusiness.stallUnit}
              </span>
            </div>
            <dl className="mt-9 grid grid-cols-2 gap-3 border-t border-stone-200/80 pt-5 sm:max-w-md">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Since
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-950">
                  {glassPrototypeBusiness.since}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Order mode
                </dt>
                <dd className="mt-1 text-lg font-semibold text-stone-950">Preorder</dd>
              </div>
            </dl>
          </article>

          <div className="relative min-w-0 lg:-ml-12 lg:pt-14">
            <div
              aria-hidden="true"
              className="gp-glass absolute inset-x-4 bottom-4 top-0 hidden lg:block"
            />
            <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {glassPrototypeProducts.map((product, index) => (
                <ProductTray key={product.slug} index={index} product={product} />
              ))}
            </div>
          </div>
        </section>

        <nav className="gp-glass mt-8 p-3 sm:p-4" aria-label="Counter workflow">
          <p className="gp-kicker px-1">Follow the counter</p>
          <ol className="grid gap-2 sm:grid-cols-4">
            {[
              ["01", "Home", "#counter-home"],
              ["02", "Menu", "#counter-menu"],
              ["03", "Cart", "#counter-cart"],
              ["04", "Admin", "#counter-admin"],
            ].map(([step, label, href]) => (
              <li key={step}>
                <a
                  href={href}
                  className="gp-chip min-h-11 w-full justify-start gap-2 px-3 text-left"
                >
                  <span className="text-xs font-bold tabular-nums text-[#7b2c27]">{step}</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section
          id="counter-menu"
          aria-labelledby="counter-menu-heading"
          className="gp-solid mt-8 p-5 sm:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="gp-kicker">02 · Menu / the trays</p>
              <h2 id="counter-menu-heading" className="gp-display text-3xl text-stone-950 sm:text-4xl">
                Choose what goes on your tray.
              </h2>
            </div>
            <Link href="/menu" className="gp-secondary min-h-11 px-4 text-sm">
              Open full menu
            </Link>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(10rem,0.35fr)_minmax(0,1fr)] lg:gap-7">
            <aside className="gp-glass h-fit p-4" aria-label="Menu categories">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Browse by group
              </p>
              <ul className="mt-3 grid gap-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <a
                      href={`#menu-${category.slug}`}
                      className="gp-chip min-h-11 w-full justify-start px-3 text-sm"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-stone-200/80 pt-4 text-xs leading-5 text-stone-500">
                Prices use the menu&apos;s configured dollar format. Options are shown on each dish.
              </p>
            </aside>

            <div className="min-w-0">
              {categories.map((category) => {
                const categoryProducts = products.filter(
                  (product) => product.category === category.slug,
                );

                return (
                  <section
                    key={category.slug}
                    id={`menu-${category.slug}`}
                    aria-labelledby={`menu-${category.slug}-heading`}
                    className="not-first:mt-6"
                  >
                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                      <h3
                        id={`menu-${category.slug}-heading`}
                        className="text-xl font-semibold text-stone-950"
                      >
                        {category.name}
                      </h3>
                      <p className="text-sm text-stone-500">{category.description}</p>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {categoryProducts.map((product) => (
                        <MenuRow key={product.slug} product={product} />
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="counter-cart"
          aria-labelledby="counter-cart-heading"
          className="gp-solid mt-8 p-5 sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <p className="gp-kicker">03 · Cart / pickup tray</p>
              <h2 id="counter-cart-heading" className="gp-display text-3xl text-stone-950 sm:text-4xl">
                A clear handoff, before you leave the counter.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-stone-600">
                This sample basket uses the featured dishes above to show the
                read-only shape of a preorder handoff.
              </p>
              <Link href="/cart" className="gp-secondary mt-5 min-h-11 px-4 text-sm">
                View cart surface
              </Link>
            </div>

            <article className="gp-glass-strong p-4 sm:p-5" aria-label="Sample cart preview">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Sample basket
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-stone-950">Ready for pickup</h3>
                </div>
                <span className="gp-chip min-h-11 px-3 text-xs">Read-only preview</span>
              </div>
              <ul className="divide-y divide-stone-200/80">
                {cartPreview.map((product) => (
                  <li key={product.slug} className="flex min-w-0 items-center gap-3 py-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#e9deca]">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-stone-950">{product.name}</p>
                      <p className="mt-1 text-xs text-stone-500">Qty 1 · {categoryName(product)}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold tabular-nums text-stone-950">
                      {startingPriceLabel(product)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-4 border-t border-stone-200/80 pt-4">
                <span className="text-sm font-semibold text-stone-600">Sample total</span>
                <span className="text-lg font-bold tabular-nums text-[#7b2c27]">
                  {formatCents(cartTotal)}
                </span>
              </div>
            </article>
          </div>
        </section>

        <section
          id="counter-admin"
          aria-labelledby="counter-admin-heading"
          className="gp-solid mt-8 p-5 sm:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="gp-kicker">04 · Admin / owner&apos;s desk</p>
              <h2 id="counter-admin-heading" className="gp-display text-3xl text-stone-950 sm:text-4xl">
                Keep the counter menu legible.
              </h2>
            </div>
            <Link href="/admin" className="gp-secondary min-h-11 px-4 text-sm">
              Open admin surface
            </Link>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <div className="gp-glass p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Owner snapshot
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3">
                <div className="gp-solid p-4">
                  <dt className="text-xs leading-5 text-stone-500">Menu items</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-stone-950">
                    {products.length}
                  </dd>
                </div>
                <div className="gp-solid p-4">
                  <dt className="text-xs leading-5 text-stone-500">Menu groups</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-stone-950">
                    {categories.length}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-stone-200/80 pt-4 text-sm leading-6 text-stone-600">
                A compact read-only view of the same menu facts used by the
                customer counter.
              </p>
            </div>

            <div className="gp-solid p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Product ledger
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-stone-950">Availability board</h3>
                </div>
                <span className="gp-chip min-h-11 px-3 text-xs">Read-only</span>
              </div>
              <ul className="mt-4 divide-y divide-stone-200/80 border-y border-stone-200/80">
                {glassPrototypeProducts.map((product) => (
                  <li key={product.slug} className="flex min-w-0 items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-stone-950">{product.name}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {categoryName(product)} · {startingPriceLabel(product)}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                      {availabilityLabel(product)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </GlassPrototypeFrame>
  );
}
