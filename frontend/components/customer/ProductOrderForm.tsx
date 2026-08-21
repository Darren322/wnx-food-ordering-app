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
  const firstSizeInputRef = useRef<HTMLInputElement>(null);
  const firstChoiceInputRef = useRef<HTMLInputElement>(null);
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
  const baseSizePriceCents =
    sizes.length > 0
      ? Math.min(...sizes.map((size) => size.priceCents))
      : product.priceCents ?? 0;
  const unitPriceCents = selectedSize
    ? selectedSize.priceCents
    : (product.priceCents ?? 0);
  const subtotalCents = unitPriceCents * quantity;

  function focusRequiredOption(input: HTMLInputElement | null) {
    if (!input) return;
    input.scrollIntoView?.({ behavior: "smooth", block: "center" });
    input.focus({ preventScroll: true });
  }

  function toggleCheckbox(id: string) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleAdd() {
    if (sizes.length > 0 && !selectedSize) {
      setError("Please select a size.");
      focusRequiredOption(firstSizeInputRef.current);
      return;
    }
    if (choiceGroup && !selectedChoice) {
      setError(`Please select a ${choiceGroup.name.toLowerCase()}.`);
      focusRequiredOption(firstChoiceInputRef.current);
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
    <div className="space-y-4 pb-1 sm:space-y-5">
      {sizes.length > 0 ? (
        <fieldset className="border-t border-stone-900/10 pt-4">
          <legend className="flex w-full items-baseline justify-between gap-3 text-sm font-semibold">
            <span>Choose a size</span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              Required
            </span>
          </legend>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Prices are shown for one serving. Larger sizes show the additional
            charge.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {sizes.map((size, index) => {
              const upchargeCents = Math.max(
                0,
                size.priceCents - baseSizePriceCents
              );

              return (
                <label
                  key={size.id}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm outline-none transition focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 ${
                    sizeId === size.id
                      ? "border-stone-950 bg-graphite text-white"
                      : "border-stone-200 bg-surface text-stone-700 hover:border-stone-400 hover:bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={size.id}
                    ref={index === 0 ? firstSizeInputRef : undefined}
                    checked={sizeId === size.id}
                    onChange={() => setSizeId(size.id)}
                    required={index === 0}
                    aria-label={`${size.name}, ${formatCents(size.priceCents)}`}
                    className="h-5 w-5 shrink-0 accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{size.name}</span>
                    <span
                      className={`block text-xs ${
                        sizeId === size.id ? "text-stone-300" : "text-stone-500"
                      }`}
                    >
                      {upchargeCents > 0
                        ? `+${formatCents(upchargeCents)}`
                        : "Included"}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums font-semibold">
                    {formatCents(size.priceCents)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {choiceGroup ? (
        <fieldset className="border-t border-stone-900/10 pt-4">
          <legend className="flex w-full items-baseline justify-between gap-3 text-sm font-semibold">
            <span>{choiceGroup.name}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              Required
            </span>
          </legend>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Choose one to add this dish to your order.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {choiceGroup.choices.map((choice, index) => (
              <label
                key={choice.id}
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm outline-none transition focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 ${
                  choiceId === choice.id
                    ? "border-stone-950 bg-graphite text-white"
                    : "border-stone-200 bg-surface text-stone-700 hover:border-stone-400 hover:bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="required-choice"
                  value={choice.id}
                  ref={index === 0 ? firstChoiceInputRef : undefined}
                  checked={choiceId === choice.id}
                  onChange={() => setChoiceId(choice.id)}
                  required={index === 0}
                  aria-label={choice.description ? `${choice.name}, ${choice.description}` : choice.name}
                  className="h-5 w-5 shrink-0 accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                />
                <span className="min-w-0">
                  <span className="block font-semibold">{choice.name}</span>
                  {choice.description ? (
                    <span
                      className={`block text-xs ${
                        choiceId === choice.id ? "text-stone-300" : "text-stone-500"
                      }`}
                    >
                      {choice.description}
                    </span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {checkboxes.length > 0 ? (
        <fieldset className="border-t border-stone-900/10 pt-4">
          <legend className="flex w-full items-baseline justify-between gap-3 text-sm font-semibold">
            <span>Preferences</span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Optional
            </span>
          </legend>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Let the kitchen know about simple adjustments.
          </p>
          <div className="mt-3 grid gap-2">
            {checkboxes.map((box) => (
              <label
                key={box.id}
                className="flex min-h-14 cursor-pointer items-center gap-3 rounded-md border border-stone-200 bg-surface px-3 py-2.5 text-sm text-stone-700 outline-none transition hover:border-stone-400 hover:bg-white focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2"
              >
                <input
                  type="checkbox"
                  checked={checkedIds.includes(box.id)}
                  onChange={() => toggleCheckbox(box.id)}
                  aria-label={box.name}
                  className="h-5 w-5 shrink-0 accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                />
                <span className="font-medium">{box.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-stone-900/10 pt-4">
        <div>
          <span className="text-sm font-semibold">Quantity</span>
          <p className="mt-0.5 text-xs text-stone-500">At least one serving</p>
        </div>
        <div
          role="group"
          aria-label="Quantity"
          className="flex items-center rounded-md border border-stone-300 bg-surface"
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand"
          >
            −
          </button>
          <span
            aria-live="polite"
            className="min-w-8 text-center text-sm font-semibold tabular-nums"
          >
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-lg outline-none transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand"
          >
            +
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="form-error border-l-2 border-brand pl-3">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-stone-900/10 bg-surface px-4 py-3 sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={handleAdd}
            className="btn-primary w-full px-5 sm:min-w-56 sm:flex-1"
          >
            <span>{editLineId ? "Save changes" : "Add to order"}</span>
            <span className="ml-auto tabular-nums">
              {formatCents(subtotalCents)}
            </span>
          </button>
          {editLineId ? (
            <Link href="/cart" className="text-link justify-center px-2 text-sm">
              Cancel
            </Link>
          ) : null}
        </div>
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
