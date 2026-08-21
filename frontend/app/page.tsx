import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { business } from "@/data/business";
import { products } from "@/data/products";
import { pickup } from "@/data/pickup";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { formatCents } from "@/lib/currency";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductImage } from "@/components/ui/ProductImage";
import { PickupContext } from "@/components/customer/HomePickupDialog";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Whampoa chicken rice for pickup",
  description:
    "Hainanese chicken rice and signature dry laksa for preorder and self-pickup at Whampoa Nan Xiang Chicken Rice.",
  alternates: { canonical: "/" },
};

function businessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: business.name,
    alternateName: business.nameZh,
    description: business.heritage,
    url: getSiteUrl(),
    image: absoluteUrl("/images/landing-chicken-rice-hero.jpg"),
    foundingDate: String(business.since),
    servesCuisine: ["Hainanese", "Singaporean"],
    paymentAccepted: "PayNow, DBS PayLah",
    acceptsReservations: "False",
  };
}

function productPrice(product: Product): string {
  if (product.priceCents != null) return formatCents(product.priceCents);
  const sizes = product.options?.sizes ?? [];
  return sizes.length > 0
    ? `From ${formatCents(Math.min(...sizes.map((size) => size.priceCents)))}`
    : "View options";
}

export default function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 3);

  return (
    <div className="space-y-8 sm:space-y-10">
      <JsonLd data={businessJsonLd()} />

      <section
        aria-labelledby="home-heading"
        className="relative -mx-4 min-h-[31rem] overflow-hidden bg-stone-950 sm:-mx-6 sm:min-h-[34rem] lg:mx-0 lg:min-h-[36rem]"
      >
        <Image
          src="/images/landing-chicken-rice-hero.jpg"
          alt="Hainanese chicken rice with cucumber, chilli and dark soy sauce"
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-[64%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-stone-950/35" />
        <div className="relative flex min-h-[31rem] max-w-2xl flex-col justify-end px-5 py-8 text-white sm:min-h-[34rem] sm:px-10 sm:py-10 lg:min-h-[36rem] lg:px-14 lg:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-100">
            Whampoa · Since {business.since}
          </p>
          <h1
            id="home-heading"
            className="mt-3 max-w-xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-6xl"
          >
            Chicken rice, ready for pickup.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-stone-100 sm:text-lg">
            Tender chicken, fragrant rice, and our signature dry laksa from
            Stall {business.stallUnit}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/menu" className="btn-primary min-h-12 px-6">
              Order now <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#pickup"
              className="inline-flex min-h-12 items-center border border-white/60 bg-white/10 px-5 font-semibold text-white outline-none transition hover:bg-white hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-white"
            >
              Choose pickup time
            </a>
          </div>
        </div>
      </section>

      <section
        id="pickup"
        aria-labelledby="pickup-heading"
        className="grid gap-6 border-y border-stone-900/10 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.38fr)] lg:items-start lg:gap-10 lg:py-8"
      >
        <div>
          <p className="page-kicker">Pickup</p>
          <h2
            id="pickup-heading"
            className="section-title max-w-2xl text-3xl sm:text-[2.5rem]"
          >
            When should we have it ready?
          </h2>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-stone-700 sm:text-lg">
            Please order at least {pickup.leadTimeHours} hours ahead.
          </p>
          <div className="mt-5 max-w-xl border-l-4 border-brand pl-5">
            <PickupContext
              navigateTo="/menu"
              emptyActionLabel="Choose a time"
            />
          </div>
        </div>

        <aside className="border-t border-stone-900/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[0.8125rem] font-extrabold uppercase tracking-[0.16em] text-brand-dark">
            Hours
          </p>
          <p className="mt-2 text-xl font-bold text-stone-950">
            Mon–Sat · 10am–8:30pm
          </p>
          <p className="mt-1 text-base font-medium text-stone-600">
            Sunday · Closed
          </p>
        </aside>
      </section>

      <section aria-labelledby="favourites-heading">
        <div className="flex items-end justify-between gap-4 border-b border-stone-900/10 pb-4">
          <div>
            <h2
              id="favourites-heading"
              className="section-title text-3xl sm:text-[2.5rem]"
            >
              Popular dishes
            </h2>
          </div>
          <Link href="/menu" className="text-link hidden text-sm sm:inline-flex">
            Full menu →
          </Link>
        </div>
        <div className="grid divide-y divide-stone-900/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {featured.map((product) => (
            <Link
              key={product.slug}
              href={`/menu/${product.slug}`}
              className="group grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-brand sm:block sm:px-5 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="relative h-24 overflow-hidden bg-paper sm:h-40">
                <ProductImage
                  src={product.image}
                  alt=""
                  width={product.imageWidth ?? 400}
                  height={product.imageHeight ?? 300}
                  fill
                  sizes="(min-width: 640px) 30vw, 104px"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="min-w-0 self-center sm:mt-4">
                <h3 className="font-semibold text-stone-950 group-hover:text-brand-dark">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  {productPrice(product)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/menu" className="btn-secondary mt-5 w-full sm:hidden">
          See full menu
        </Link>
      </section>
    </div>
  );
}
