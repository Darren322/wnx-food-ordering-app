import Image from "next/image";
import Link from "next/link";

import { business } from "@/data/business";
import { products } from "@/data/products";
import { pickup } from "@/data/pickup";
import { formatCents } from "@/lib/currency";
import type { Product } from "@/types/product";

function displayPrice(product: Product): string {
  if (product.priceCents != null) return formatCents(product.priceCents);

  const sizePrices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  return sizePrices.length > 0
    ? `From ${formatCents(Math.min(...sizePrices))}`
    : "";
}

export function VariantC() {
  const featured = products.filter((product) => product.featured);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-[#f5f0e6] text-stone-900 ring-1 ring-stone-900/10">
      <div>
        <section className="grid items-stretch lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
          <div className="flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-800">
              Whampoa · Since {business.since}
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-stone-950 sm:text-5xl lg:text-6xl">
              Familiar favourites, ready when you are.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              Preorder chicken rice and our signature dry laksa, then collect
              your meal freshly prepared at the stall.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/menu"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-800 px-6 text-sm font-bold text-white transition hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
              >
                Start an order
              </Link>
              <span className="text-sm text-stone-600">
                {pickup.leadTimeHours}-hour preorder notice
              </span>
            </div>
          </div>

          <div className="relative min-h-64 overflow-hidden border-t border-stone-900/10 bg-[#ded2bd] lg:min-h-[29rem] lg:border-l lg:border-t-0">
            <Image
              src="/images/signboard.png"
              alt={`Original ${business.name} stall signboard`}
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-contain p-7 sm:p-10"
            />
            <p className="absolute bottom-4 right-4 rounded-full bg-[#f5f0e6]/95 px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm ring-1 ring-stone-900/10">
              海南鸡饭 · {business.since}
            </p>
          </div>
        </section>

        <section
          aria-labelledby="variant-c-popular"
          className="border-y border-stone-900/10 bg-white/65 px-5 py-8 sm:px-8 lg:px-12"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-800">
                Order first
              </p>
              <h2
                id="variant-c-popular"
                className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Popular today
              </h2>
            </div>
            <Link
              href="/menu"
              className="hidden min-h-11 items-center text-sm font-bold text-red-800 underline decoration-red-800/30 underline-offset-4 hover:decoration-red-800 sm:inline-flex"
            >
              Full menu
            </Link>
          </div>

          <ol className="mt-6 divide-y divide-stone-900/10 border-y border-stone-900/10">
            {featured.map((product, index) => (
              <li
                key={product.slug}
                className="grid grid-cols-[3rem_4.5rem_minmax(0,1fr)] items-center gap-3 py-4 sm:grid-cols-[3rem_6rem_minmax(0,1fr)_auto] sm:gap-5"
              >
                <span className="text-sm font-semibold tabular-nums text-stone-400">
                  0{index + 1}
                </span>
                <div className="relative h-16 w-[4.5rem] overflow-hidden rounded-xl bg-[#eee5d5] sm:h-20 sm:w-24">
                  <Image
                    src={product.image}
                    alt={`${product.name}, a featured dish from ${business.name}`}
                    fill
                    sizes="96px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold leading-tight text-stone-950">
                    {product.name}
                    {product.nameZh ? (
                      <span className="ml-2 font-normal text-stone-500">
                        {product.nameZh}
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-red-800">
                    {displayPrice(product)}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-stone-500 sm:hidden">
                    {product.description}
                  </p>
                </div>
                <Link
                  href={`/menu/${product.slug}`}
                  aria-label={`Choose ${product.name}, ${displayPrice(product)}`}
                  className="col-start-3 mt-1 inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-stone-300 bg-white px-5 text-sm font-bold text-stone-800 transition hover:border-red-800 hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 sm:col-start-auto sm:mt-0"
                >
                  Choose
                </Link>
              </li>
            ))}
          </ol>

          <Link
            href="/menu"
            className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-red-800 underline decoration-red-800/30 underline-offset-4 hover:decoration-red-800 sm:hidden"
          >
            See the full menu
          </Link>
        </section>

        <section
          aria-labelledby="variant-c-story"
          className="px-5 py-12 sm:px-10 sm:py-16 lg:px-14"
        >
          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-800">
                A short stall story
              </p>
              <h2
                id="variant-c-story"
                className="mt-3 text-3xl font-semibold tracking-tight"
              >
                Made familiar over time.
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600">
                The story is simple: familiar flavours, prepared for the
                neighbourhood, now easier to collect.
              </p>
            </div>

            <ol className="relative border-l border-red-800/30 pl-7 sm:pl-10">
              <li className="relative pb-12">
                <span className="absolute -left-[2.2rem] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5f0e6] ring-1 ring-red-800 sm:-left-[3.1rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-800" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">
                  {business.since} · The beginning
                </p>
                <h3 className="mt-2 text-xl font-bold">A Whampoa staple</h3>
                <p className="mt-2 max-w-2xl leading-7 text-stone-600">
                  {business.heritage}
                </p>
              </li>

              <li className="relative pb-12">
                <span className="absolute -left-[2.2rem] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5f0e6] ring-1 ring-red-800 sm:-left-[3.1rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-800" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">
                  Today · At the stall
                </p>
                <div className="mt-3 overflow-hidden rounded-2xl bg-[#e9deca] ring-1 ring-stone-900/10">
                  <Image
                    src="/images/stall.png"
                    alt={`Illustration of the ${business.name} stall and its owners`}
                    width={1200}
                    height={675}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="aspect-[16/8] w-full object-contain"
                  />
                </div>
              </li>

              <li className="relative">
                <span className="absolute -left-[2.2rem] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-800 sm:-left-[3.1rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">
                  Next · Your pickup
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  Order ahead, then collect at {business.stallUnit}.
                </h3>
                <p className="mt-2 max-w-2xl leading-7 text-stone-600">
                  Choose a pickup slot at least {pickup.leadTimeHours} hours
                  ahead. No account needed, and no waiting around to decide at
                  the counter.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <aside
          aria-label="Pickup order summary"
          className="m-4 grid gap-5 rounded-[1.5rem] bg-stone-950 px-5 py-6 text-stone-50 sm:m-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-7"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">
              Preorder · Self-pickup only
            </p>
            <p className="mt-2 text-xl font-semibold">
              Freshly prepared for your chosen time.
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-400">
              Collect from stall {business.stallUnit}. Online preorders accept
              {" "}
              {business.paymentsAccepted[0]}.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-700 px-6 text-sm font-bold text-white transition hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
          >
            Browse all dishes
          </Link>
        </aside>
      </div>
    </div>
  );
}
