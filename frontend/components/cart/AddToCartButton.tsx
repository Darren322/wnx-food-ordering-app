"use client";

import { useState } from "react";
import { makeLineId, useCart } from "@/components/cart/CartProvider";

interface AddToCartButtonProps {
  slug: string;
  name: string;
  image?: string;
  unitPriceCents: number;
  className?: string;
  label?: string;
  addedLabel?: string;
  ariaLabel?: string;
  addedAriaLabel?: string;
}

/** One-tap add for fixed-price products (no options). */
export function AddToCartButton({
  slug,
  name,
  image,
  unitPriceCents,
  className,
  label = "Add to cart",
  addedLabel = "Added to cart",
  ariaLabel,
  addedAriaLabel,
}: AddToCartButtonProps) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addLine({
      id: makeLineId(slug, {}),
      productSlug: slug,
      productName: name,
      image,
      unitPriceCents,
      quantity: 1,
      selection: {},
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={added ? (addedAriaLabel ?? ariaLabel) : ariaLabel}
      aria-live="polite"
      className={
        className ??
        "btn-primary px-4 text-sm"
      }
    >
      <span
        key={added ? "added" : "add"}
        aria-hidden={ariaLabel ? "true" : undefined}
        className={
          added
            ? "motion-safe:animate-[add-confirm_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
            : "transition-transform duration-200 motion-safe:group-hover:scale-110"
        }
      >
        {added ? addedLabel : label}
      </span>
    </button>
  );
}
