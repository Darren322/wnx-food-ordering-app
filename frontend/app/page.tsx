import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { business } from "@/data/business";
import { products } from "@/data/products";
import { pickup } from "@/data/pickup";
import { absoluteUrl, getSiteUrl, siteName } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  HomeCounter,
  HomePopularMenu,
} from "@/components/customer/HomePopularMenu";

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
    <div className="space-y-8 sm:space-y-10">
      <JsonLd data={businessJsonLd()} />

      <HomeCounter
        products={featured}
        leadTimeHours={pickup.leadTimeHours}
      />

      <HomePopularMenu products={featured} />

      <section
        aria-labelledby="heritage-heading"
        className="surface-solid landing-panel grid overflow-hidden bg-[#eee5d5] lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative min-h-64 overflow-hidden lg:min-h-full">
          <Image
            src="/images/stall.png"
            alt={`Illustration of the ${siteName} stall and its owners`}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
        <div className="p-7 sm:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            A Whampoa staple
          </p>
          <h2
            id="heritage-heading"
            className="section-title mt-3"
          >
            Made familiar over time.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-stone-600">
            {business.heritage}
          </p>
          <dl className="mt-7 grid gap-5 border-t border-stone-900/10 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-stone-500">
                Pickup
              </dt>
              <dd className="mt-1 font-semibold text-stone-900">
                Stall {business.stallUnit}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-stone-500">
                Preorder
              </dt>
              <dd className="mt-1 font-semibold text-stone-900">
                At least {pickup.leadTimeHours} hours ahead
              </dd>
            </div>
          </dl>
          <Link
            href="/menu"
            className="text-link mt-7"
          >
            Browse all dishes
          </Link>
        </div>
      </section>
    </div>
  );
}
