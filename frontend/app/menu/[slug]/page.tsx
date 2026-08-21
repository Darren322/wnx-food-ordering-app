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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string | string[] }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const editLineId = typeof query.edit === "string" ? query.edit : undefined;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const priceCents = basePriceCents(product);
  const hasSizes = (product.options?.sizes ?? []).length > 0;

  return (
    <article className="-mx-4 pb-2 sm:mx-0 sm:pb-8">
      <JsonLd data={productJsonLd(product)} />

      <nav aria-label="Breadcrumb" className="mb-4 px-4 text-sm text-stone-500 sm:px-0">
        <Link
          href="/menu"
          className="inline-flex min-h-11 items-center rounded-sm font-semibold outline-none transition hover:text-brand focus-visible:ring-2 focus-visible:ring-brand md:hidden"
        >
          ← Back to menu
        </Link>
        <div className="hidden flex-wrap items-center gap-x-1.5 gap-y-1 md:flex">
          <Link
            href="/"
            className="rounded-sm outline-none transition hover:text-brand focus-visible:ring-2 focus-visible:ring-brand"
          >
            Home
          </Link>
          {" / "}
          <Link
            href="/menu"
            className="rounded-sm outline-none transition hover:text-brand focus-visible:ring-2 focus-visible:ring-brand"
          >
            Menu
          </Link>
          {category ? (
            <>
              {" / "}
              <span>{category.name}</span>
            </>
          ) : null}
          {" / "}
          <span className="text-stone-900">{product.name}</span>
        </div>
      </nav>

      <div className="surface-solid grid items-stretch overflow-visible rounded-none border-x-0 shadow-none sm:rounded-[var(--radius-panel)] sm:border-x md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:overflow-hidden md:shadow-[var(--shadow-raised)]">
        <div className="flex min-h-56 items-center overflow-hidden border-b border-stone-900/10 bg-paper px-4 py-6 sm:min-h-80 sm:p-6 md:min-h-[32rem] md:border-b-0 md:border-r">
          <ProductImage
            src={product.image}
            alt={`${product.name} at ${siteName}`}
            width={product.imageWidth ?? 600}
            height={product.imageHeight ?? 450}
            className="mx-auto max-h-64 w-full object-contain sm:max-h-80 md:max-h-96"
          />
        </div>
        <div className="min-w-0 px-4 pb-8 pt-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="font-display text-3xl font-medium leading-none tracking-[-0.02em] text-stone-950 sm:text-4xl">
              {product.name}
              {product.nameZh ? (
                <span
                  lang="zh-Hans"
                  className="ml-2 font-cjk text-xl font-normal tracking-normal text-stone-400"
                >
                  {product.nameZh}
                </span>
              ) : null}
            </h1>
            <AvailabilityBadge availability={product.availability} />
          </div>
          <p className="mt-4 leading-7 text-stone-600">{product.description}</p>
          {priceCents != null ? (
            <p className="mt-3 text-2xl font-bold text-brand">
              {hasSizes ? "from " : ""}
              {formatCents(priceCents)}
            </p>
          ) : null}

          {product.dietaryNotice ? (
            <aside
              aria-labelledby="dietary-note-heading"
              className="mt-5 border-l-2 border-brand/35 pl-4"
            >
              <h2
                id="dietary-note-heading"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark"
              >
                Dietary note
              </h2>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                {product.dietaryNotice}
              </p>
            </aside>
          ) : null}

          <div className="mt-6 sm:mt-8">
            <ProductOrderForm product={product} editLineId={editLineId} />
          </div>
        </div>
      </div>
    </article>
  );
}
