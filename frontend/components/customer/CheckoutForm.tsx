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
import {
  loadPickupSelection,
  savePickupSelection,
} from "@/lib/pickup-selection";
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
    const now = new Date();
    const options = getPickupDates(now);
    const saved = loadPickupSelection(now);
    const selectedDate =
      saved && options.some((option) => option.value === saved.date)
        ? saved.date
        : options[0]?.value ?? "";
    const nextSlots = selectedDate ? getPickupSlots(selectedDate, now) : [];
    const selectedTime =
      saved && saved.date === selectedDate && nextSlots.includes(saved.time)
        ? saved.time
        : nextSlots[0] ?? "";

    setDates(options);
    setDate(selectedDate);
    setSlots(nextSlots);
    setTime(selectedTime);
  }, []);

  function handleDateChange(nextDate: string) {
    const nextSlots = getPickupSlots(nextDate);
    setDate(nextDate);
    setSlots(nextSlots);
    setTime(nextSlots[0] ?? "");
  }

  if (!hydrated) {
    return <p className="text-sm text-stone-500">Loading checkout…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="surface-glass p-10 text-center">
        <p className="text-stone-600">Your cart is empty.</p>
        <Link
          href="/menu"
          className="btn-primary mt-5"
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
    savePickupSelection({ date, time });

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
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.68fr)] lg:gap-10"
    >
      <div className="surface-solid space-y-7 p-6 sm:p-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Your details</h2>
          <p className="mb-4 text-sm leading-6 text-stone-500">
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
                className="input mt-1"
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
                className="input mt-1"
                placeholder="e.g. 9123 4567"
              />
            </label>
          </div>
        </section>

        <section className="border-t border-stone-200/80 pt-7">
          <h2 className="mb-3 text-lg font-semibold">Self-pickup time</h2>
          <p className="mb-4 text-sm leading-6 text-stone-500">
            Same-day pickup is available for slots at least {pickup.leadTimeHours}{" "}
            hours from now.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Date
              <select
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="input mt-1"
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
                className="input mt-1"
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
      </div>

      <div className="space-y-5 lg:sticky lg:top-[calc(var(--app-header-offset)+1rem)]">
        <section className="surface-glass-strong p-5 sm:p-6">
          <p className="page-kicker">Your preorder</p>
          <h2 className="mb-4 font-display text-2xl font-medium text-stone-950">
            Order summary
          </h2>
          <ul className="space-y-3 text-sm text-stone-700">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-3">
                <span>
                  {l.quantity} × {l.productName}
                  {l.selection.sizeName ? ` (${l.selection.sizeName})` : ""}
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatCents(l.unitPriceCents * l.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-stone-900/10 pt-4 text-right text-lg font-bold text-brand">
            {formatCents(subtotalCents)}
          </p>
        </section>

        {error ? (
          <p role="alert" className="form-error">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn-primary w-full px-5 py-3">
          Continue to payment
        </button>
      </div>
    </form>
  );
}
