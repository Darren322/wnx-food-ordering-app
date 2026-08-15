import type { Metadata } from "next";
import { categories, products } from "@/data/products";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { MenuBrowser } from "@/components/customer/MenuBrowser";

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
    <div className="relative">
      <JsonLd data={menuJsonLd()} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-0 -z-10 h-72 w-72 rounded-full bg-white/80 blur-3xl"
      />
      <h1 className="page-title mb-7 sm:mb-8">Menu</h1>
      <MenuBrowser categories={categories} products={products} />
    </div>
  );
}
