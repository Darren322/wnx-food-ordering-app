import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCents } from "@/lib/currency";
import { ProductImage } from "@/components/ui/ProductImage";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
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

interface ProductCardProps {
  product: Product;
  /** When true, render static disabled actions (admin preview). */
  preview?: boolean;
}

export function ProductCard({ product, preview = false }: ProductCardProps) {
  const available = product.availability === "available";
  const price = displayPrice(product);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
      <Link href={`/menu/${product.slug}`} className="block bg-amber-50">
        <ProductImage
          src={product.image}
          alt={`${product.name} at ${"Whampoa Nan Xiang Chicken Rice"}`}
          width={product.imageWidth ?? 400}
          height={product.imageHeight ?? 300}
          className="h-40 w-full object-contain p-2"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-neutral-900">
            <Link href={`/menu/${product.slug}`} className="hover:text-red-800">
              {product.name}
              {product.nameZh ? (
                <span className="ml-1 text-sm font-normal text-neutral-500">
                  {product.nameZh}
                </span>
              ) : null}
            </Link>
          </h3>
          <AvailabilityBadge availability={product.availability} />
        </div>
        <p className="text-sm text-neutral-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-bold text-red-800">{price}</p>
          {preview ? (
            <button
              type="button"
              disabled
              className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-500"
            >
              Add to cart
            </button>
          ) : !available ? (
            <button
              type="button"
              disabled
              className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-500"
            >
              {product.availability === "sold_out" ? "Sold out" : "Unavailable"}
            </button>
          ) : hasOptions(product) ? (
            <Link
              href={`/menu/${product.slug}`}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              View options
            </Link>
          ) : (
            <AddToCartButton
              slug={product.slug}
              name={product.name}
              image={product.image}
              unitPriceCents={product.priceCents ?? 0}
            />
          )}
        </div>
      </div>
    </article>
  );
}
