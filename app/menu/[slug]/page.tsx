import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  products,
} from "@/data/products";
import type { Product } from "@/types/product";
import { formatCents } from "@/lib/currency";
import { absoluteUrl, siteName } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductImage } from "@/components/ui/ProductImage";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { ProductOrderForm } from "@/components/customer/ProductOrderForm";

export const revalidate = 3600;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/menu/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${siteName}`,
      description: product.description,
      images: product.image.startsWith("/images/")
        ? [{ url: product.image }]
        : undefined,
    },
  };
}

function basePriceCents(product: Product): number | undefined {
  if (product.priceCents != null) return product.priceCents;
  const sizes = product.options?.sizes ?? [];
  return sizes.length > 0
    ? Math.min(...sizes.map((s) => s.priceCents))
    : undefined;
}

function productJsonLd(product: Product): Record<string, unknown> {
  const priceCents = basePriceCents(product);
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: product.name,
    description: product.description,
    url: absoluteUrl(`/menu/${product.slug}`),
    image: absoluteUrl(product.image),
    offers:
      priceCents != null
        ? {
            "@type": "Offer",
            price: (priceCents / 100).toFixed(2),
            priceCurrency: "SGD",
            availability:
              product.availability === "available"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          }
        : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const priceCents = basePriceCents(product);
  const hasSizes = (product.options?.sizes ?? []).length > 0;

  return (
    <article>
      <JsonLd data={productJsonLd(product)} />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-600">
        <Link href="/" className="hover:text-red-800">
          Home
        </Link>
        {" / "}
        <Link href="/menu" className="hover:text-red-800">
          Menu
        </Link>
        {category ? (
          <>
            {" / "}
            <span>{category.name}</span>
          </>
        ) : null}
        {" / "}
        <span className="text-neutral-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-white p-6">
          <ProductImage
            src={product.image}
            alt={`${product.name} at ${siteName}`}
            width={product.imageWidth ?? 600}
            height={product.imageHeight ?? 450}
            className="mx-auto max-h-80 w-full object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-red-900">
              {product.name}
              {product.nameZh ? (
                <span className="ml-2 text-xl font-normal text-neutral-500">
                  {product.nameZh}
                </span>
              ) : null}
            </h1>
            <AvailabilityBadge availability={product.availability} />
          </div>
          <p className="mt-3 text-neutral-700">{product.description}</p>
          {priceCents != null ? (
            <p className="mt-3 text-2xl font-bold text-red-800">
              {hasSizes ? "from " : ""}
              {formatCents(priceCents)}
            </p>
          ) : null}

          {product.dietaryNotice ? (
            <p
              role="note"
              className="mt-4 rounded-lg border border-amber-300 bg-amber-100 p-3 text-sm text-amber-900"
            >
              {product.dietaryNotice}
            </p>
          ) : null}

          <div className="mt-6">
            <ProductOrderForm product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
