import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCents } from "@/lib/currency";
import { ProductImage } from "@/components/ui/ProductImage";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

function displayPrice(product: Product): string {
  if (product.priceCents != null) return formatCents(product.priceCents);
  const sizes = product.options?.sizes ?? [];
  if (sizes.length > 0) {
    const min = Math.min(...sizes.map((s) => s.priceCents));
    return `from ${formatCents(min)}`;
  }
  return "";
}

function hasOptions(product: Product): boolean {
  const o = product.options;
  if (!o) return false;
  return Boolean(
    (o.sizes && o.sizes.length > 0) ||
      (o.requiredChoice && o.requiredChoice.choices.length > 0) ||
      (o.checkboxes && o.checkboxes.length > 0)
  );
}

function availabilityLabel(product: Product): string {
  if (product.availability === "sold_out") return "Sold out";
  if (product.availability === "unavailable") return "Unavailable";
  return "Available";
}

interface ProductCardProps {
  product: Product;
  /** When true, render static disabled actions (admin preview). */
  preview?: boolean;
}

export function ProductCard({ product, preview = false }: ProductCardProps) {
  const available = product.availability === "available";
  const price = displayPrice(product);
  const productHasOptions = hasOptions(product);

  return (
    <article className="group grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:py-5">
      <Link
        href={`/menu/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-2xl bg-[#e9deca] outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          width={product.imageWidth ?? 400}
          height={product.imageHeight ?? 300}
          fill
          sizes="76px"
          className="h-full w-full object-contain p-1.5 transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
        />
      </Link>
      <div className="min-w-0">
        <h3 className="break-words text-base font-semibold leading-snug tracking-[-0.015em] text-stone-950 sm:text-lg">
          <Link
            href={`/menu/${product.slug}`}
            className="rounded-sm outline-none transition hover:text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {product.name}
            {product.nameZh ? (
              <span
                lang="zh-Hans"
                className="ml-2 font-cjk text-sm font-normal tracking-normal text-stone-500"
              >
                {product.nameZh}
              </span>
            ) : null}
          </Link>
        </h3>
        <p className="mt-2 hidden max-w-xl text-sm leading-6 text-stone-600 sm:block">
          {product.description}
        </p>
      </div>
      <div className="col-start-2 flex min-w-0 items-center justify-between gap-4 sm:col-span-1 sm:col-start-auto sm:flex-col sm:items-end sm:justify-center">
        <span className="shrink-0 text-sm font-semibold tabular-nums text-brand">
          {price}
        </span>
        {preview ? (
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 min-w-[5.25rem] items-center justify-center rounded-full bg-stone-200 px-5 text-sm font-semibold text-stone-500"
          >
            Add
          </button>
        ) : !available ? (
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-200 px-5 text-sm font-semibold text-stone-500"
          >
            {availabilityLabel(product)}
          </button>
        ) : productHasOptions || product.priceCents == null ? (
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
            unitPriceCents={product.priceCents}
            label="+"
            addedLabel="✓"
            ariaLabel={`Add ${product.name} to cart`}
            addedAriaLabel={`${product.name} added to cart`}
            className="btn-icon-primary group"
          />
        )}
      </div>
    </article>
  );
}
