import Link from "next/link";
import { business } from "@/data/business";
import { categories } from "@/data/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatCents } from "@/lib/currency";
import { productImageCropClass } from "@/lib/product-image";
import type { Product } from "@/types/product";
import { HomePickupDialog } from "@/components/customer/HomePickupDialog";

function displayPrice(product: Product): string {
  if (product.priceCents != null) return formatCents(product.priceCents);

  const prices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  return prices.length > 0
    ? `From ${formatCents(Math.min(...prices))}`
    : "View options";
}

function hasOptions(product: Product): boolean {
  const options = product.options;
  return Boolean(
    options?.sizes?.length ||
      options?.requiredChoice?.choices.length ||
      options?.checkboxes?.length,
  );
}

interface HomePopularMenuProps {
  products: Product[];
}

interface HomeCounterProps {
  products: Product[];
  leadTimeHours: number;
}

function categoryName(product: Product): string {
  return (
    categories.find((category) => category.slug === product.category)?.name ??
    product.category
  );
}

function CounterTray({ product, index }: { product: Product; index: number }) {
  return (
    <article
      className={`surface-solid min-w-0 p-4 sm:p-5 ${
        index === 0 ? "lg:-translate-y-2" : "lg:translate-y-2"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="page-kicker mb-0">Tray 0{index + 1}</p>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-stone-600">
          {displayPrice(product)}
        </span>
      </div>
      <Link
        href={`/menu/${product.slug}`}
        className="relative mt-3 block h-28 overflow-hidden rounded-2xl bg-[#e9deca] outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:h-32"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={`${product.name}, a dish from ${business.name}`}
          width={product.imageWidth ?? 400}
          height={product.imageHeight ?? 300}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 35vw, 84vw"
          className="h-full w-full object-contain p-2"
        />
      </Link>
      <div className="mt-4 min-w-0">
        <h2 className="break-words text-lg font-semibold leading-6 text-stone-950">
          {product.name}
          {product.nameZh ? (
            <span lang="zh-Hans" className="ml-2 font-cjk text-sm font-normal text-stone-500">
              {product.nameZh}
            </span>
          ) : null}
        </h2>
        <p className="mt-1 text-sm text-stone-500">{categoryName(product)}</p>
        <Link
          href={`/menu/${product.slug}`}
          className="text-link mt-3 text-sm"
          aria-label={`Choose ${product.name}`}
        >
          Choose dish <span aria-hidden="true" className="ml-2 text-lg">→</span>
        </Link>
      </div>
    </article>
  );
}

/** The production home hero: a solid editorial counter with two food trays. */
export function HomeCounter({ products, leadTimeHours }: HomeCounterProps) {
  const counterTrays = products.slice(0, 2);

  return (
    <section
      aria-labelledby="counter-home-heading"
      className="landing-shell-enter"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-7">
        <div className="surface-solid landing-panel p-5 sm:p-7">
          <h1
            id="counter-home-heading"
            className="page-title max-w-xl sm:text-5xl"
          >
            Favourites, ready for pickup.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
            Chicken rice and dry laksa, prepared to order.
          </p>
          <div className="mt-7">
            <HomePickupDialog leadTimeHours={leadTimeHours} />
          </div>
        </div>

        <div className="relative min-w-0 pb-2 sm:px-2">
          <div
            aria-hidden="true"
            className="surface-glass absolute inset-x-0 bottom-0 top-3"
          />
          <div className="relative grid gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4">
            {counterTrays.map((product, index) => (
              <CounterTray key={product.slug} index={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePopularMenu({ products }: HomePopularMenuProps) {
  return (
    <section
      aria-labelledby="popular-heading"
      className="surface-glass landing-panel landing-section-enter overflow-hidden"
    >
      <div className="flex items-end justify-between gap-4 border-b border-stone-200 px-5 py-6 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            Order first
          </p>
          <h2
            id="popular-heading"
            className="mt-2 font-display text-3xl font-medium leading-none tracking-[-0.02em] text-stone-950"
          >
            Popular today
          </h2>
        </div>
        <Link
          href="/menu"
          className="text-link hidden text-sm sm:inline-flex"
        >
          Full menu
        </Link>
      </div>

      <ol className="divide-y divide-stone-200">
        {products.map((product, index) => {
          const available = product.availability === "available";

          return (
            <li
              key={product.slug}
              className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-4 gap-y-3 px-5 py-5 sm:grid-cols-[2rem_6rem_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-5 sm:px-8"
            >
              <span className="hidden text-xs font-semibold tabular-nums text-stone-400 sm:block">
                {String(index + 1).padStart(2, "0")}
              </span>

              <Link
                href={`/menu/${product.slug}`}
                className="relative row-span-2 block h-[4.75rem] overflow-hidden rounded-xl bg-[#eee5d5] ring-1 ring-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:row-span-1 sm:h-20"
              >
                <ProductImage
                  src={product.image}
                  alt={`${product.name}, available for preorder`}
                  width={product.imageWidth ?? 400}
                  height={product.imageHeight ?? 300}
                  className={`h-full w-full ${
                    product.slug === "dry-laksa"
                      ? "object-contain p-1.5"
                      : `object-cover ${productImageCropClass(product.slug)}`
                  }`}
                />
              </Link>

              <div className="min-w-0 self-center">
                <h3 className="font-bold leading-tight text-stone-950">
                  <Link
                    href={`/menu/${product.slug}`}
                    className="transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {product.name}
                    {product.nameZh ? (
                      <span lang="zh-Hans" className="ml-2 font-cjk font-normal text-stone-500">
                        {product.nameZh}
                      </span>
                    ) : null}
                  </Link>
                </h3>
                <p className="mt-1 hidden max-w-lg text-sm leading-6 text-stone-500 lg:block">
                  {product.description}
                </p>
                <p className="mt-1 text-sm font-bold text-brand sm:hidden">
                  {displayPrice(product)}
                </p>
              </div>

              <p className="hidden whitespace-nowrap text-sm font-bold text-brand sm:block">
                {displayPrice(product)}
              </p>

              <div className="col-start-2 sm:col-start-auto">
                {!available ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-200 px-5 text-sm font-bold text-stone-500"
                  >
                    {product.availability === "sold_out" ? "Sold out" : "Unavailable"}
                  </button>
                ) : hasOptions(product) ? (
                  <Link
                    href={`/menu/${product.slug}`}
                    className="btn-primary min-w-[5.25rem] px-5 text-sm"
                  >
                    Choose
                  </Link>
                ) : (
                  <AddToCartButton
                    slug={product.slug}
                    name={product.name}
                    image={product.image}
                    unitPriceCents={product.priceCents ?? 0}
                    className="btn-icon-primary group"
                    label="+"
                    addedLabel="✓"
                    ariaLabel={`Add ${product.name} to cart`}
                    addedAriaLabel={`${product.name} added to cart`}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-stone-200 px-5 py-4 sm:hidden">
        <Link
          href="/menu"
          className="text-link text-sm"
        >
          See the full menu
        </Link>
      </div>
    </section>
  );
}
