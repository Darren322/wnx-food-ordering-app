import Link from "next/link";

import { business } from "@/data/business";
import { categories, products } from "@/data/products";
import { formatCents } from "@/lib/currency";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product } from "@/types/product";

function productPrice(product: Product): { label: string; value: string } {
  if (product.priceCents != null) {
    return { label: "", value: formatCents(product.priceCents) };
  }

  const prices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  if (prices.length > 0) {
    return { label: "from", value: formatCents(Math.min(...prices)) };
  }

  return { label: "", value: "View" };
}

function CounterRow({ product, index }: { product: Product; index: number }) {
  const price = productPrice(product);

  return (
    <li className="group border-t border-stone-200 first:border-t-0">
      <Link
        href={`/menu/${product.slug}`}
        className="grid min-h-28 grid-cols-[3rem_5.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4 outline-none transition-colors hover:bg-white/70 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-700 sm:grid-cols-[3.5rem_7rem_minmax(0,1fr)_auto] sm:gap-5 sm:px-3"
        aria-label={`Order ${product.name}, ${price.label ? `${price.label} ` : ""}${price.value}`}
      >
        <span
          className="self-start pt-1 font-mono text-xs font-semibold tabular-nums text-stone-400 sm:self-center sm:pt-0"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="relative block h-20 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200 sm:h-24">
          <ProductImage
            src={product.image}
            alt={`${product.name}, available for pickup`}
            width={product.imageWidth ?? 400}
            height={product.imageHeight ?? 300}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </span>

        <span className="min-w-0 py-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-bold tracking-tight text-stone-900 sm:text-lg">
              {product.name}
            </span>
            {product.nameZh ? (
              <span className="text-sm font-medium text-stone-500">
                {product.nameZh}
              </span>
            ) : null}
          </span>
          <span className="mt-1 hidden max-w-xl text-sm leading-6 text-stone-600 sm:block">
            {product.description}
          </span>
          <span className="mt-2 inline-flex min-h-6 items-center gap-1 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
            Available today
          </span>
        </span>

        <span className="flex min-h-11 flex-col items-end justify-center rounded-full border border-stone-300 bg-white px-3 text-right shadow-sm transition group-hover:border-red-300 sm:min-w-24 sm:px-4">
          {price.label ? (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
              {price.label}
            </span>
          ) : null}
          <span className="text-sm font-extrabold tabular-nums text-red-800 sm:text-base">
            {price.value}
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * PROTOTYPE ONLY — conversion-led homepage direction presented as a calm,
 * scan-friendly digital hawker counter.
 */
export function VariantB() {
  const featured = products.filter(
    (product) => product.featured && product.availability === "available",
  );

  return (
    <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-[#f3efe6] text-stone-900 shadow-[0_24px_80px_-48px_rgba(28,25,23,0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300/80 bg-[#faf8f2] px-5 py-3 sm:px-8">
        <p className="text-xs font-semibold text-stone-500">
          Since {business.since} · Stall {business.stallUnit} · Self-pickup
        </p>
        <div className="flex min-h-11 items-center gap-2 rounded-full border border-emerald-900/15 bg-emerald-50 px-4 text-xs font-bold text-emerald-900">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          Taking preorders
        </div>
      </div>

      <div>
        <section className="grid gap-8 px-5 pb-5 pt-8 sm:px-8 sm:pb-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12 lg:pt-10">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-800">
              Pickup counter
            </p>
            <h1 className="mt-3 max-w-md text-3xl font-black leading-[1.05] tracking-[-0.035em] text-stone-950 sm:text-4xl">
              Your Whampoa favourites, ready when you are.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-stone-600 sm:text-base">
              Choose a dish, preorder online, then collect freshly prepared at
              our stall. No account needed.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-800 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2"
            >
              Browse the full menu
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  d="M4 10h12m-4-4 4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <nav className="mt-8" aria-label="Jump to a menu category">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
                Jump to
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <a
                    key={category.slug}
                    href={`#counter-${category.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-white/60 px-4 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </nav>
          </div>

          <div className="rounded-2xl border border-stone-300 bg-[#faf8f2] px-4 shadow-[0_14px_40px_-30px_rgba(28,25,23,0.5)] sm:px-5">
            <div className="flex items-end justify-between gap-4 border-b border-stone-200 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">
                  Most ordered
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Popular today
                </h2>
              </div>
              <p className="pb-0.5 text-right text-xs leading-5 text-stone-500">
                Prices in SGD
                <br />Self-pickup only
              </p>
            </div>
            <ol>
              {featured.map((product, index) => (
                <CounterRow key={product.slug} product={product} index={index} />
              ))}
            </ol>
          </div>
        </section>

        <div className="border-y border-stone-300 bg-red-900 px-5 py-3 text-stone-50 sm:px-8">
          <p className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1 text-xs font-semibold tracking-wide">
            <span>Preorder online · Pick up at {business.stallUnit}</span>
            <span className="font-normal text-red-100">Freshly prepared for collection</span>
          </p>
        </div>

        <section className="px-5 py-10 sm:px-8 sm:py-12" aria-labelledby="counter-menu-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-800">
                The counter menu
              </p>
              <h2 id="counter-menu-heading" className="mt-2 text-3xl font-black tracking-tight">
                Pick what you&apos;re craving
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-400 bg-white/70 px-5 text-sm font-bold text-stone-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800"
            >
              See all menu details
            </Link>
          </div>

          <div className="divide-y divide-stone-300 border-y border-stone-300">
            {categories.map((category) => {
              const categoryProducts = products.filter(
                (product) => product.category === category.slug,
              );

              return (
                <section
                  key={category.slug}
                  id={`counter-${category.slug}`}
                  className="scroll-mt-6 grid gap-4 py-8 lg:grid-cols-[15rem_1fr] lg:gap-10"
                  aria-labelledby={`counter-${category.slug}-heading`}
                >
                  <div>
                    <h3
                      id={`counter-${category.slug}-heading`}
                      className="text-xl font-black tracking-tight"
                    >
                      {category.name}
                    </h3>
                    {category.description ? (
                      <p className="mt-2 max-w-xs text-sm leading-6 text-stone-600">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                  <ul className="divide-y divide-stone-200 rounded-2xl border border-stone-300 bg-[#faf8f2] px-4 sm:px-5">
                    {categoryProducts.map((product) => {
                      const price = productPrice(product);

                      return (
                        <li key={product.slug}>
                          <Link
                            href={`/menu/${product.slug}`}
                            className="group flex min-h-20 items-center justify-between gap-4 py-4 outline-none transition hover:pl-1 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-800"
                          >
                            <span className="min-w-0">
                              <span className="block font-bold text-stone-900 group-hover:text-red-800">
                                {product.name}
                                {product.nameZh ? (
                                  <span className="ml-2 font-medium text-stone-500">
                                    {product.nameZh}
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-1 line-clamp-1 block text-sm text-stone-500">
                                {product.description}
                              </span>
                            </span>
                            <span className="shrink-0 text-right font-extrabold tabular-nums text-red-800">
                              {price.label ? (
                                <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                                  {price.label}
                                </span>
                              ) : null}
                              {price.value}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
