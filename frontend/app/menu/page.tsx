import type { Metadata } from "next";
import { categories, products } from "@/data/products";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { MenuBrowser } from "@/components/customer/MenuBrowser";
import { PickupContext } from "@/components/customer/HomePickupDialog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Preorder Hainanese chicken rice and signature dry laksa from Whampoa Nan Xiang Chicken Rice for self-pickup.",
  alternates: { canonical: "/menu" },
};

function menuJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Whampoa Nan Xiang Chicken Rice Menu",
    hasMenuSection: categories.map((category) => ({
      "@type": "MenuSection",
      name: category.name,
      description: category.description,
      hasMenuItem: products
        .filter((p) => p.category === category.slug)
        .map((p) => {
          const priceCents =
            p.priceCents ??
            (p.options?.sizes?.length
              ? Math.min(...p.options.sizes.map((s) => s.priceCents))
              : undefined);
          return {
            "@type": "MenuItem",
            name: p.name,
            description: p.description,
            url: absoluteUrl(`/menu/${p.slug}`),
            offers:
              priceCents != null
                ? {
                    "@type": "Offer",
                    price: (priceCents / 100).toFixed(2),
                    priceCurrency: "SGD",
                  }
                : undefined,
          };
        }),
    })),
  };
}

export default function MenuPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <JsonLd data={menuJsonLd()} />

      <section
        aria-labelledby="menu-heading"
        className="border-b border-stone-900/10 pb-5 sm:pb-6"
      >
        <p className="page-kicker mb-2">Whampoa Nan Xiang</p>
        <h1 id="menu-heading" className="page-title">
          Our menu
        </h1>
      </section>

      <section aria-label="Current pickup time">
        <PickupContext variant="menu" />
      </section>

      <MenuBrowser categories={categories} products={products} />
    </div>
  );
}
