import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCents } from "@/lib/currency";
import { productImageCropClass } from "@/lib/product-image";
import { ProductImage } from "@/components/ui/ProductImage";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

function displayPrice(product: Product): string {
  if (product.priceCents != null) return formatCents(product.priceCents);
  const sizes = product.options?.sizes ?? [];
  if (sizes.length > 0) {
    const min = Math.min(...sizes.map((size) => size.priceCents));
    return `from ${formatCents(min)}`;
  }
  return "View options";
}

function hasOptions(product: Product): boolean {
  const options = product.options;
  if (!options) return false;
  return Boolean(
    (options.sizes && options.sizes.length > 0) ||
      (options.requiredChoice && options.requiredChoice.choices.length > 0) ||
      (options.checkboxes && options.checkboxes.length > 0),
  );
}

function availabilityLabel(product: Product): string {
  if (product.availability === "sold_out") return "Sold out";
  if (product.availability === "unavailable") return "Unavailable";
  return "Available";
}

interface ProductActionProps {
  product: Product;
  preview: boolean;
}

function ProductAction({ product, preview }: ProductActionProps) {
  const available = product.availability === "available";

  if (preview) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex min-h-11 min-w-[5.25rem] items-center justify-center rounded-md border border-stone-200 bg-stone-100 px-3 text-sm font-semibold text-stone-500"
      >
        Add
      </button>
    );
  }

  if (!available) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex min-h-11 items-center justify-center rounded-md border border-stone-200 bg-stone-100 px-3 text-sm font-semibold text-stone-500"
      >
        {availabilityLabel(product)}
      </button>
    );
  }

  if (hasOptions(product) || product.priceCents == null) {
    return (
      <Link
        href={`/menu/${product.slug}`}
        className="btn-primary min-w-[5.25rem] px-3 text-sm"
      >
        Choose
      </Link>
    );
  }

  return (
    <AddToCartButton
      slug={product.slug}
      name={product.name}
      image={product.image}
      unitPriceCents={product.priceCents}
      label="Add"
      addedLabel="Added"
      ariaLabel={`Add ${product.name} to cart`}
      addedAriaLabel={`${product.name} added to cart`}
      className="btn-primary min-w-[5.25rem] px-3 text-sm"
    />
  );
}

interface ProductCardProps {
  product: Product;
  /** When true, render static disabled actions (admin preview). */
  preview?: boolean;
}

export function ProductCard({ product, preview = false }: ProductCardProps) {
  const price = displayPrice(product);

  return (
    <article className="group grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-5 sm:px-5 sm:py-5 lg:grid-cols-[7rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-6">
      <Link
        href={`/menu/${product.slug}`}
        className="relative row-span-2 aspect-square overflow-hidden rounded-lg bg-[#eee5d5] outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:row-span-1"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          width={product.imageWidth ?? 400}
          height={product.imageHeight ?? 300}
          fill
          sizes="(min-width: 1024px) 112px, (min-width: 640px) 104px, 88px"
          className={`h-full w-full object-contain p-1.5 transition-transform duration-300 motion-safe:group-hover:scale-[1.025] ${productImageCropClass(product.slug)}`}
        />
      </Link>

      <div className="min-w-0 self-start lg:self-center">
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
        <p className="mt-1 line-clamp-2 max-w-xl text-sm leading-5 text-stone-600">
          {product.description}
        </p>
      </div>

      <div className="col-start-2 flex min-w-0 items-center justify-between gap-3 lg:col-start-3 lg:row-start-1 lg:flex-col lg:items-end lg:justify-center">
        <span className="shrink-0 text-sm font-semibold tabular-nums text-brand">
          {price}
        </span>
        <ProductAction product={product} preview={preview} />
      </div>
    </article>
  );
}
