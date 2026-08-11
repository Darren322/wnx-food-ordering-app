import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { business } from "@/data/business";
import { categories, products } from "@/data/products";
import { pickup } from "@/data/pickup";
import { absoluteUrl, getSiteUrl, siteName } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductCard } from "@/components/customer/ProductCard";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Business structured data. Address, telephone and opening hours are
 * intentionally omitted until confirmed with the stall (see
 * data/business.ts) — do not fabricate them here.
 */
function businessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: business.name,
    alternateName: business.nameZh,
    description: business.heritage,
    url: getSiteUrl(),
    image: absoluteUrl("/images/signboard.png"),
    foundingDate: String(business.since),
    servesCuisine: ["Hainanese", "Singaporean"],
    paymentAccepted: "PayNow, DBS PayLah",
    acceptsReservations: "False",
  };
}

export default function HomePage() {
  const featured = products.filter((p) => p.featured);

  return (
    <div className="space-y-16">
      <JsonLd data={businessJsonLd()} />

      <section className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-red-900 sm:text-4xl">
            Heritage Chicken Rice and Signature Dry Laksa
          </h1>
          <p className="mt-4 text-lg text-neutral-700">
            Preorder your favourites from Whampoa Nan Xiang and collect them
            freshly prepared.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link
              href="/menu"
              className="rounded-lg bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
            >
              View Menu
            </Link>
            <Link
              href="/menu/dry-laksa"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-red-800 ring-1 ring-red-300 hover:bg-red-50"
            >
              Order Dry Laksa
            </Link>
          </div>
        </div>
        <Image
          src="/images/mascot.png"
          alt={`${siteName} mascot`}
          width={800}
          height={800}
          priority
          className="h-48 w-48 rounded-full shadow-md sm:h-56 sm:w-56"
        />
      </section>

      <section aria-labelledby="featured-heading">
        <h2
          id="featured-heading"
          className="mb-2 text-2xl font-bold text-red-900"
        >
          Featured favourites
        </h2>
        <p className="mb-6 text-sm text-neutral-600">
          From our {categories.map((c) => c.name).join(" and ")} selections.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <p className="mt-4 text-sm">
          <Link href="/menu" className="font-semibold text-red-800 underline">
            See the full menu
          </Link>
        </p>
      </section>

      <section
        aria-labelledby="heritage-heading"
        className="rounded-2xl border border-amber-200 bg-white p-6 sm:p-8"
      >
        <h2
          id="heritage-heading"
          className="text-2xl font-bold text-red-900"
        >
          Since {business.since}
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-700">{business.heritage}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Image
            src="/images/signboard.png"
            alt={`Stall signboard of ${siteName}, established ${business.since}`}
            width={1000}
            height={520}
            className="w-full rounded-lg object-contain"
          />
          <Image
            src="/images/stall.png"
            alt={`Illustration of the ${siteName} stall and its owners`}
            width={1200}
            height={675}
            className="w-full rounded-lg object-contain"
          />
        </div>
      </section>

      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="mb-6 text-2xl font-bold text-red-900">
          How preordering works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1. Browse & preorder",
              text: "Pick your dishes and options, then check out as a guest — no account needed.",
            },
            {
              step: "2. Pay online",
              text: "Pay securely by PayNow when you place the order.",
            },
            {
              step: "3. Self-pickup at stall",
              text: `Collect your order at stall ${business.stallUnit} at your chosen time.`,
            },
          ].map((item) => (
            <li
              key={item.step}
              className="rounded-xl border border-amber-200 bg-white p-5"
            >
              <p className="font-semibold text-red-800">{item.step}</p>
              <p className="mt-2 text-sm text-neutral-600">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="notice-heading"
        className="rounded-2xl border border-red-200 bg-red-50 p-6"
      >
        <h2 id="notice-heading" className="text-lg font-bold text-red-900">
          Preorder &amp; self-pickup notice
        </h2>
        <p className="mt-2 text-sm text-red-900">
          All online orders are preorders for self-pickup only — we do not
          offer delivery. Same-day pickup requires at least{" "}
          {pickup.leadTimeHours} hours of lead time. DBS PayLah is accepted
          for orders placed at the counter.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-white p-6">
          <h2 className="text-lg font-bold text-red-900">Pickup information</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Stall {business.stallUnit} at Whampoa. Exact address and operating
            hours will be published here once confirmed with the stall.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-white p-6">
          <h2 className="text-lg font-bold text-red-900">Contact us</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Telephone and social-media details will be published here once
            confirmed with the stall.
          </p>
        </div>
      </section>
    </div>
  );
}
