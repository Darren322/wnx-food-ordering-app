"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import type { CartLineSelection } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { makeLineId, useCart } from "@/components/cart/CartProvider";

/**
 * Per-product order form. Only the option groups configured on the product
 * are rendered — fixed-price products get just a quantity selector.
 */
interface ProductOrderFormProps {
  product: Product;
  editLineId?: string;
}

export function ProductOrderForm({
  product,
  editLineId,
}: ProductOrderFormProps) {
  const router = useRouter();
  const { lines, hydrated, addLine, replaceLine } = useCart();

  const sizes = product.options?.sizes ?? [];
  const choiceGroup = product.options?.requiredChoice;
  const checkboxes = product.options?.checkboxes ?? [];

  const [sizeId, setSizeId] = useState<string | undefined>(sizes[0]?.id);
  const [choiceId, setChoiceId] = useState<string | undefined>(undefined);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const initializedEditId = useRef<string | undefined>(undefined);

  const editLine = editLineId
    ? lines.find((line) => line.id === editLineId)
    : undefined;

  useEffect(() => {
    if (
      !editLineId ||
      !hydrated ||
      !editLine ||
      editLine.productSlug !== product.slug ||
      initializedEditId.current === editLineId
    ) {
      return;
    }

    initializedEditId.current = editLineId;
    setSizeId(editLine.selection.sizeId);
    setChoiceId(editLine.selection.choiceId);
    setCheckedIds(
      (editLine.selection.checkboxIds ?? []).filter((id) =>
        product.options?.checkboxes?.some((checkbox) => checkbox.id === id)
      )
    );
    setQuantity(Math.max(1, editLine.quantity));
  }, [
    editLine,
    editLineId,
    hydrated,
    product.options?.checkboxes,
    product.slug,
  ]);

  const available = product.availability === "available";
  const selectedSize = sizes.find((s) => s.id === sizeId);
  const selectedChoice = choiceGroup?.choices.find((c) => c.id === choiceId);
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
    if (choiceGroup && !selectedChoice) {
      setError(`Please select a ${choiceGroup.name.toLowerCase()}.`);
      return;
    }
    setError("");

    const selection: CartLineSelection = {};
    if (selectedSize) {
      selection.sizeId = selectedSize.id;
      selection.sizeName = selectedSize.name;
    }
    if (choiceGroup && selectedChoice) {
      selection.choiceGroupName = choiceGroup.name;
      selection.choiceId = selectedChoice.id;
      selection.choiceName = selectedChoice.name;
    }
    if (checkedIds.length > 0) {
      selection.checkboxIds = checkedIds;
      selection.checkboxNames = checkedIds.map(
        (id) => checkboxes.find((c) => c.id === id)?.name ?? id
      );
    }

    const nextLine = {
      productSlug: product.slug,
      productName: product.name,
      image: product.image,
      unitPriceCents,
      quantity,
      selection,
    };

    if (editLineId) {
      replaceLine(editLineId, nextLine);
      router.replace("/cart");
      return;
    }

    addLine({
      ...nextLine,
      id: makeLineId(product.slug, selection),
    });
    setAdded(true);
  }

  if (editLineId && !hydrated) {
    return <p className="text-sm text-stone-500">Loading your choices…</p>;
  }

  if (
    editLineId &&
    (!editLine || editLine.productSlug !== product.slug)
  ) {
    return (
      <div className="status-pending p-4 text-sm leading-6">
        <p>This cart item is no longer available to edit.</p>
        <Link href="/cart" className="text-link mt-1">
          Back to cart
        </Link>
      </div>
    );
  }

  if (!available) {
    return (
      <p className="status-pending p-4 text-sm leading-6">
        {product.availability === "sold_out"
          ? "This item is sold out. Please check back another day."
          : "This item is currently unavailable."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {sizes.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <label
                key={size.id}
                className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 text-sm outline-none transition focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 ${
                  sizeId === size.id
                    ? "border-stone-950 bg-graphite text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_7px_16px_-10px_rgba(12,10,9,0.85)]"
                    : "border-stone-200 bg-surface text-stone-700 hover:bg-white"
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
            <span className="font-normal text-brand">(required)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {choiceGroup.choices.map((choice) => (
              <label
                key={choice.id}
                className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 text-sm outline-none transition focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 ${
                  choiceId === choice.id
                    ? "border-stone-950 bg-graphite text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_7px_16px_-10px_rgba(12,10,9,0.85)]"
                    : "border-stone-200 bg-surface text-stone-700 hover:bg-white"
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
                      choiceId === choice.id ? "text-stone-300" : "text-stone-500"
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
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm text-stone-700 outline-none focus-within:ring-2 focus-within:ring-brand"
              >
                <input
                  type="checkbox"
                  checked={checkedIds.includes(box.id)}
                  onChange={() => toggleCheckbox(box.id)}
                  className="h-4 w-4 accent-brand"
                />
                {box.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex items-center gap-3 border-t border-stone-900/10 pt-5">
        <span className="text-sm font-semibold">Quantity</span>
        <div className="flex items-center rounded-full border border-stone-200 bg-surface shadow-sm">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand"
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
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand"
          >
            +
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="button"
          onClick={handleAdd}
          className="btn-primary w-full px-5 sm:w-auto"
        >
          {editLineId ? "Save changes" : "Add to cart"} ·{" "}
          {formatCents(subtotalCents)}
        </button>
        {editLineId ? (
          <Link href="/cart" className="text-link justify-center px-2 text-sm">
            Cancel
          </Link>
        ) : null}
        <p className="text-sm text-stone-600">
          Subtotal:{" "}
          <span className="font-bold text-brand">
            {formatCents(subtotalCents)}
          </span>
        </p>
      </div>

      {added ? (
        <p
          role="status"
          aria-live="polite"
          className="status-success p-4 text-sm"
        >
          Added to your cart.{" "}
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="inline-flex min-h-11 items-center rounded-sm font-semibold underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            View cart
          </button>
        </p>
      ) : null}
    </div>
  );
}
