"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order";
import { formatCents } from "@/lib/currency";
import { isSlotAllowed } from "@/lib/preorder";
import {
  type PickupSelection,
  savePickupSelection,
} from "@/lib/pickup-selection";
import { pickup } from "@/data/pickup";
import { useCart } from "@/components/cart/CartProvider";
import { savePendingOrder } from "@/components/cart/orderStorage";
import { PickupContext } from "@/components/customer/HomePickupDialog";

/**
 * Guest checkout: name + phone (no accounts), then self-pickup date/time.
 * The six-hour Singapore lead-time rule is enforced by lib/preorder.ts.
 */
export function CheckoutForm() {
  const router = useRouter();
  const { lines, hydrated, subtotalCents } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupSelection, setPickupSelection] =
    useState<PickupSelection | null>(null);
  const [error, setError] = useState("");

  if (!hydrated) {
    return <p className="text-sm text-stone-500">Loading checkout…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="surface-solid p-8 text-center sm:p-10">
        <p className="font-semibold text-stone-950">Your cart is empty.</p>
        <p className="mt-2 text-sm text-stone-600">
          Add a dish before entering guest checkout.
        </p>
        <Link href="/menu" className="btn-primary mt-5">
          Browse the menu
        </Link>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!pickupSelection) {
      setError("Please choose a pickup date and time before continuing.");
      return;
    }
    if (!isSlotAllowed(pickupSelection.date, pickupSelection.time)) {
      setError(
        `That pickup slot is no longer available. Same-day pickup needs at least ${pickup.leadTimeHours} hours of lead time.`,
      );
      return;
    }

    setError("");
    savePickupSelection(pickupSelection);

    const order: Order = {
      id: `WNX-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer: { name: name.trim(), phone: phone.trim() },
      pickupDate: pickupSelection.date,
      pickupTime: pickupSelection.time,
      lines,
      subtotalCents,
      status: "awaiting_payment",
    };
    savePendingOrder(order);
    router.push("/payment");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.68fr)] lg:gap-8"
    >
      <div className="surface-solid space-y-7 p-5 sm:p-7">
        <section aria-labelledby="guest-details-heading">
          <p className="page-kicker mb-2">Guest checkout</p>
          <h2
            id="guest-details-heading"
            className="text-xl font-semibold text-stone-950"
          >
            Who is collecting?
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            No account needed. We use your phone number only to contact you
            about this order.
          </p>
          <div className="mt-5 space-y-4">
            <label
              className="block text-sm font-semibold text-stone-800"
              htmlFor="checkout-name"
            >
              Name
              <input
                id="checkout-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                autoComplete="name"
                className="input mt-1"
                placeholder="e.g. Alice Tan"
                aria-required="true"
                aria-invalid={error === "Please enter your name."}
              />
            </label>
            <label
              className="block text-sm font-semibold text-stone-800"
              htmlFor="checkout-phone"
            >
              Phone
              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setError("");
                }}
                autoComplete="tel"
                className="input mt-1"
                placeholder="e.g. 9123 4567"
                aria-required="true"
                aria-invalid={error === "Please enter your phone number."}
              />
            </label>
          </div>
        </section>

        <section
          aria-labelledby="pickup-details-heading"
          className="border-t border-stone-900/10 pt-7"
        >
          <p className="page-kicker mb-2">Pickup</p>
          <h2
            id="pickup-details-heading"
            className="text-xl font-semibold text-stone-950"
          >
            Choose when to collect
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Monday to Saturday, 10:00–20:30 Singapore time. Same-day slots
            require at least {pickup.leadTimeHours} hours’ notice.
          </p>
          <div className="surface-soft mt-4 p-4">
            <PickupContext
              leadTimeHours={pickup.leadTimeHours}
              onSelectionChange={setPickupSelection}
            />
          </div>
        </section>
      </div>

      <div className="space-y-5 lg:sticky lg:top-[calc(var(--app-header-offset)+1rem)]">
        <section
          className="surface-solid p-5 sm:p-6"
          aria-labelledby="checkout-summary-heading"
        >
          <p className="page-kicker mb-2">Your preorder</p>
          <h2
            id="checkout-summary-heading"
            className="font-display text-2xl font-medium text-stone-950"
          >
            Order summary
          </h2>
          <ul className="mt-5 divide-y divide-stone-900/10 text-sm text-stone-700">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className="mr-1 tabular-nums text-stone-500">
                    {line.quantity}×
                  </span>
                  {line.productName}
                  {line.selection.sizeName
                    ? ` (${line.selection.sizeName})`
                    : ""}
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatCents(line.unitPriceCents * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center justify-between gap-4 border-t border-stone-900/10 pt-4 text-lg font-bold text-brand">
            <span className="text-sm font-semibold text-stone-600">Total</span>
            <span className="tabular-nums">{formatCents(subtotalCents)}</span>
          </p>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            Payment is simulated by PayNow on the next step.
          </p>
        </section>

        {error ? (
          <p role="alert" className="form-error border border-brand/20 bg-brand/5 p-3">
            {error}
          </p>
        ) : null}

        <div className="sticky bottom-3 z-20 border border-stone-900/10 bg-paper p-2 sm:static sm:border-0 sm:bg-transparent sm:p-0">
          <button type="submit" className="btn-primary w-full px-5 py-3">
            Continue to payment <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </form>
  );
}
