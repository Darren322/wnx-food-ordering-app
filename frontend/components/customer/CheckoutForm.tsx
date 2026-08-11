"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order";
import { formatCents } from "@/lib/currency";
import {
  getPickupDates,
  getPickupSlots,
  isSlotAllowed,
  type PickupDateOption,
} from "@/lib/preorder";
import { pickup } from "@/data/pickup";
import { useCart } from "@/components/cart/CartProvider";
import { savePendingOrder } from "@/components/cart/orderStorage";

/**
 * Guest checkout: name + phone (no accounts), then self-pickup date/time.
 * The 6-hour same-day lead-time rule is enforced by lib/preorder.ts.
 */
export function CheckoutForm() {
  const router = useRouter();
  const { lines, hydrated, subtotalCents } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState<PickupDateOption[]>([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  // Computed after mount only: slot availability depends on the current time.
  useEffect(() => {
    const options = getPickupDates();
    setDates(options);
    if (options.length > 0) setDate(options[0].value);
  }, []);

  useEffect(() => {
    if (!date) return;
    const s = getPickupSlots(date);
    setSlots(s);
    setTime(s[0] ?? "");
  }, [date]);

  if (!hydrated) {
    return <p className="text-sm text-neutral-500">Loading checkout…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-white p-8 text-center">
        <p className="text-neutral-600">Your cart is empty.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!date || !time) {
      setError("Please select a pickup date and time.");
      return;
    }
    if (!isSlotAllowed(date, time)) {
      setError(
        `That pickup slot is no longer available. Same-day pickup needs at least ${pickup.leadTimeHours} hours of lead time.`
      );
      return;
    }
    setError("");

    const order: Order = {
      id: `WNX-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer: { name: name.trim(), phone: phone.trim() },
      pickupDate: date,
      pickupTime: time,
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
      className="max-w-xl space-y-6 rounded-xl border border-amber-200 bg-white p-6"
    >
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your details</h2>
        <p className="mb-3 text-sm text-neutral-500">
          Guest checkout — no account needed. We use your phone number only to
          contact you about this order.
        </p>
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
              placeholder="e.g. Alice Tan"
            />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
              placeholder="e.g. 9123 4567"
            />
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Self-pickup time</h2>
        <p className="mb-3 text-sm text-neutral-500">
          Same-day pickup is available for slots at least {pickup.leadTimeHours}{" "}
          hours from now.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Date
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2"
            >
              {dates.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Time
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2"
            >
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-lg bg-amber-50 p-4">
        <h2 className="mb-2 text-sm font-semibold">Order summary</h2>
        <ul className="space-y-1 text-sm text-neutral-700">
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between gap-2">
              <span>
                {l.quantity} × {l.productName}
                {l.selection.sizeName ? ` (${l.selection.sizeName})` : ""}
              </span>
              <span>{formatCents(l.unitPriceCents * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 border-t border-amber-200 pt-2 text-right font-bold text-red-800">
          {formatCents(subtotalCents)}
        </p>
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
      >
        Continue to payment
      </button>
    </form>
  );
}
