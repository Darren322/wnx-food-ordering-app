"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import type { CartLineSelection } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { makeLineId, useCart } from "@/components/cart/CartProvider";

/**
 * Per-product order form. Only the option groups configured on the product
 * are rendered — fixed-price products get just a quantity selector.
 */
export function ProductOrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const { addLine } = useCart();

  const sizes = product.options?.sizes ?? [];
  const choiceGroup = product.options?.requiredChoice;
  const checkboxes = product.options?.checkboxes ?? [];

  const [sizeId, setSizeId] = useState<string | undefined>(sizes[0]?.id);
  const [choiceId, setChoiceId] = useState<string | undefined>(undefined);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const available = product.availability === "available";
  const selectedSize = sizes.find((s) => s.id === sizeId);
  const unitPriceCents = selectedSize
    ? selectedSize.priceCents
    : (product.priceCents ?? 0);
  const subtotalCents = unitPriceCents * quantity;

  function toggleCheckbox(id: string) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleAdd() {
    if (sizes.length > 0 && !selectedSize) {
      setError("Please select a size.");
      return;
    }
    if (choiceGroup && !choiceId) {
      setError(`Please select a ${choiceGroup.name.toLowerCase()}.`);
      return;
    }
    setError("");

    const selection: CartLineSelection = {};
    if (selectedSize) {
      selection.sizeId = selectedSize.id;
      selection.sizeName = selectedSize.name;
    }
    if (choiceGroup && choiceId) {
      const choice = choiceGroup.choices.find((c) => c.id === choiceId);
      selection.choiceGroupName = choiceGroup.name;
      selection.choiceId = choiceId;
      selection.choiceName = choice?.name;
    }
    if (checkedIds.length > 0) {
      selection.checkboxIds = checkedIds;
      selection.checkboxNames = checkedIds.map(
        (id) => checkboxes.find((c) => c.id === id)?.name ?? id
      );
    }

    addLine({
      id: makeLineId(product.slug, selection),
      productSlug: product.slug,
      productName: product.name,
      image: product.image,
      unitPriceCents,
      quantity,
      selection,
    });
    setAdded(true);
  }

  if (!available) {
    return (
      <p className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-600">
        {product.availability === "sold_out"
          ? "This item is sold out. Please check back another day."
          : "This item is currently unavailable."}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {sizes.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <label
                key={size.id}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm ring-1 ${
                  sizeId === size.id
                    ? "bg-red-700 text-white ring-red-700"
                    : "bg-white text-neutral-700 ring-amber-300 hover:bg-amber-100"
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={size.id}
                  checked={sizeId === size.id}
                  onChange={() => setSizeId(size.id)}
                  className="sr-only"
                />
                {size.name} · {formatCents(size.priceCents)}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {choiceGroup ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">
            {choiceGroup.name}{" "}
            <span className="font-normal text-red-700">(required)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {choiceGroup.choices.map((choice) => (
              <label
                key={choice.id}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm ring-1 ${
                  choiceId === choice.id
                    ? "bg-red-700 text-white ring-red-700"
                    : "bg-white text-neutral-700 ring-amber-300 hover:bg-amber-100"
                }`}
              >
                <input
                  type="radio"
                  name="required-choice"
                  value={choice.id}
                  checked={choiceId === choice.id}
                  onChange={() => setChoiceId(choice.id)}
                  className="sr-only"
                />
                {choice.name}
                {choice.description ? (
                  <span
                    className={`ml-1 text-xs ${
                      choiceId === choice.id ? "text-red-100" : "text-neutral-500"
                    }`}
                  >
                    ({choice.description})
                  </span>
                ) : null}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {checkboxes.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Preferences</legend>
          <div className="space-y-1">
            {checkboxes.map((box) => (
              <label
                key={box.id}
                className="flex items-center gap-2 text-sm text-neutral-700"
              >
                <input
                  type="checkbox"
                  checked={checkedIds.includes(box.id)}
                  onChange={() => toggleCheckbox(box.id)}
                  className="h-4 w-4 accent-red-700"
                />
                {box.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">Quantity</span>
        <div className="flex items-center rounded-lg ring-1 ring-amber-300">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-lg"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1.5 text-lg"
          >
            +
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
        >
          Add to cart · {formatCents(subtotalCents)}
        </button>
        <p className="text-sm text-neutral-600">
          Subtotal:{" "}
          <span className="font-bold text-red-800">
            {formatCents(subtotalCents)}
          </span>
        </p>
      </div>

      {added ? (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Added to your cart.{" "}
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="font-semibold underline"
          >
            View cart
          </button>
        </p>
      ) : null}
    </div>
  );
}
