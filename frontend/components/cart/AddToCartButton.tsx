"use client";

import { useState } from "react";
import { makeLineId, useCart } from "@/components/cart/CartProvider";

interface AddToCartButtonProps {
  slug: string;
  name: string;
  image?: string;
  unitPriceCents: number;
  className?: string;
}

/** One-tap add for fixed-price products (no options). */
export function AddToCartButton({
  slug,
  name,
  image,
  unitPriceCents,
  className,
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
      className={
        className ??
        "rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
      }
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
