import Image from "next/image";
import Link from "next/link";

import { business } from "@/data/business";
import { pickup } from "@/data/pickup";
import { products } from "@/data/products";
import { formatCents } from "@/lib/currency";
import type { Product } from "@/types/product";

function startingPrice(product: Product): string {
  if (product.priceCents !== undefined) {
    return formatCents(product.priceCents);
  }

  const prices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  return prices.length > 0 ? `From ${formatCents(Math.min(...prices))}` : "View options";
}

export function VariantA() {
  const featured = products.filter((product) => product.featured);
  const heroDish = featured.find((product) => product.slug === "chicken-rice") ?? featured[0];

  return (
    <div className="overflow-hidden bg-[#f7f2e8] text-[#29251f]">
      <section
        aria-labelledby="quiet-editorial-heading"
        className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12"
      >
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-8 top-0 hidden w-px bg-[#b43b2f]/25 sm:block"
        />

        <div className="grid items-center gap-10 sm:ml-8 lg:grid-cols-12 lg:gap-6">
          <div className="relative z-10 lg:col-span-7 lg:pr-10">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#a23227] uppercase">
              <span className="h-px w-8 bg-[#a23227]" aria-hidden="true" />
              Preorder for pickup
            </p>
            <h1
              id="quiet-editorial-heading"
              className="max-w-3xl text-balance font-serif text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.94] font-medium tracking-[-0.05em] text-[#29251f]"
            >
              Comfort food,
              <span className="block pl-[12%] text-[#a23227] italic">ready when you are.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#625b50] sm:text-lg">
              Familiar chicken rice and signature dry laksa, prepared for a smooth self-pickup at stall {business.stallUnit}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#a23227] px-7 text-sm font-bold text-white shadow-[0_10px_30px_rgba(110,35,28,0.18)] transition hover:-translate-y-0.5 hover:bg-[#86271f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a23227] motion-reduce:transform-none"
              >
                Order for pickup
                <span aria-hidden="true" className="ml-3 text-lg">↗</span>
              </Link>
              <Link
                href="/menu/dry-laksa"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#29251f]/20 px-7 text-sm font-bold transition hover:border-[#29251f]/45 hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a23227]"
              >
                See our dry laksa
              </Link>
            </div>
            <p className="mt-5 text-xs leading-5 text-[#756d61]">
              No account needed · Allow at least {pickup.leadTimeHours} hours before collection
            </p>
          </div>

          {heroDish ? (
            <div className="relative lg:col-span-5 lg:translate-y-8">
              <div className="absolute -left-5 top-7 z-10 hidden -rotate-90 text-[0.65rem] font-bold tracking-[0.22em] text-[#7b7266] uppercase lg:block">
                Today&apos;s classic
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] rounded-br-[5rem] bg-[#eadfcd] shadow-[0_28px_70px_rgba(66,54,39,0.13)]">
                <Image
                  src={heroDish.image}
                  alt={`${heroDish.name}, a popular pickup dish`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-contain p-7 sm:p-10"
                />
                <div className="absolute bottom-4 left-4 rounded-2xl border border-white/70 bg-[#fffaf1]/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:bottom-6 sm:left-6">
                  <p className="text-sm font-bold text-[#29251f]">{heroDish.name}</p>
                  <p className="mt-0.5 text-xs text-[#6e6559]">
                    {heroDish.nameZh ? `${heroDish.nameZh} · ` : ""}{startingPrice(heroDish)}
                  </p>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full border border-[#a23227]/20"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section
        aria-labelledby="popular-a-heading"
        className="border-y border-[#29251f]/10 bg-[#fffaf1]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#a23227] uppercase">Popular today</p>
              <h2
                id="popular-a-heading"
                className="mt-2 font-serif text-4xl leading-none tracking-[-0.035em] text-[#29251f] sm:text-5xl"
              >
                Start with a favourite.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#6e6559]">
              Choose a dish, personalise it if needed, then pick your collection time at checkout.
            </p>
          </div>

          <ol className="border-t border-[#29251f]/15">
            {featured.map((product, index) => (
              <li key={product.slug}>
                <Link
                  href={`/menu/${product.slug}`}
                  className="group grid min-h-40 grid-cols-[2.5rem_5.5rem_1fr] items-center gap-3 border-b border-[#29251f]/15 py-5 transition-colors hover:bg-[#f7f2e8]/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a23227] sm:grid-cols-[4rem_9rem_1fr_auto] sm:gap-6 sm:px-3 lg:grid-cols-[5rem_12rem_minmax(0,1fr)_10rem_3rem]"
                  aria-label={`View ${product.name}, ${startingPrice(product)}`}
                >
                  <span className="self-start pt-2 font-serif text-lg italic text-[#9a8f80] sm:pt-4 sm:text-2xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#eee4d3] transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-[1.02] motion-reduce:transform-none">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 88px, (max-width: 1024px) 144px, 192px"
                      className="object-contain p-2 sm:p-3"
                    />
                  </span>
                  <span className="min-w-0 sm:py-4">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-serif text-xl leading-tight font-medium tracking-[-0.025em] text-[#29251f] sm:text-3xl">
                        {product.name}
                      </span>
                      {product.nameZh ? (
                        <span className="text-sm text-[#7c7367]">{product.nameZh}</span>
                      ) : null}
                    </span>
                    <span className="mt-2 hidden max-w-xl text-sm leading-6 text-[#6e6559] sm:block">
                      {product.description}
                    </span>
                    <span className="mt-2 block text-sm font-bold text-[#a23227] sm:hidden">
                      {startingPrice(product)}
                    </span>
                  </span>
                  <span className="hidden text-right text-sm font-bold text-[#a23227] sm:block">
                    {startingPrice(product)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-2xl text-[#a23227] transition-transform group-hover:translate-x-1 lg:block motion-reduce:transform-none"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex justify-end">
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center border-b border-[#a23227] text-sm font-bold text-[#a23227] transition hover:border-[#86271f] hover:text-[#86271f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a23227]"
            >
              Explore the full menu <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="pickup-a-heading" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid overflow-hidden rounded-[2rem] border border-[#29251f]/10 bg-[#e8dfcf] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-64 overflow-hidden lg:min-h-full">
            <Image
              src="/images/stall.png"
              alt={`Illustration of the ${business.name} stall`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#29251f]/20 to-transparent" aria-hidden="true" />
          </div>
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="text-xs font-bold tracking-[0.2em] text-[#a23227] uppercase">A simple pickup ritual</p>
            <h2 id="pickup-a-heading" className="mt-3 max-w-lg font-serif text-4xl leading-[1.05] tracking-[-0.035em] sm:text-5xl">
              Order ahead. Collect at the stall.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#625b50]">{business.heritage}</p>
            <dl className="mt-8 grid gap-5 border-t border-[#29251f]/15 pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs tracking-[0.14em] text-[#756d61] uppercase">Pickup</dt>
                <dd className="mt-1 font-semibold">Stall {business.stallUnit}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.14em] text-[#756d61] uppercase">Lead time</dt>
                <dd className="mt-1 font-semibold">At least {pickup.leadTimeHours} hours</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.14em] text-[#756d61] uppercase">Ordering</dt>
                <dd className="mt-1 font-semibold">Guest checkout</dd>
              </div>
            </dl>
            <Link
              href="/menu"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#29251f] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#100f0d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29251f] motion-reduce:transform-none"
            >
              Choose your meal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
