"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { formatPickupDate } from "@/lib/preorder";
import { getOrderById } from "@/components/cart/orderStorage";

export function ConfirmationView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(id ? (getOrderById(id) ?? null) : null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return <p className="text-sm text-stone-500">Loading your order…</p>;
  }

  if (!order) {
    return (
      <div className="surface-solid mx-auto max-w-2xl p-8 text-center sm:p-10">
        <p className="font-semibold text-stone-950">We could not find that order.</p>
        <p className="mt-2 text-sm text-stone-600">
          Return to the menu to start a new preorder.
        </p>
        <Link href="/menu" className="btn-primary mt-5">
          Back to the menu
        </Link>
      </div>
    );
  }

  const statusClass =
    order.status === "confirmed"
      ? "status-success"
      : order.status === "awaiting_payment"
        ? "status-pending"
        : "border border-brand/20 bg-brand-50 text-brand-dark";
  const statusMessage =
    order.status === "confirmed"
      ? "Payment received — order confirmed"
      : ORDER_STATUS_LABELS[order.status];

  return (
    <div className="surface-solid mx-auto max-w-2xl p-5 sm:p-7">
      <header aria-labelledby="confirmation-heading">
        <p className="page-kicker mb-2">Order reference</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="confirmation-heading"
              className="font-display text-3xl font-medium text-stone-950"
            >
              {statusMessage}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Keep this reference for your pickup: {" "}
              <span className="font-semibold text-stone-950">{order.id}</span>
            </p>
          </div>
          <span
            className={`${statusClass} inline-flex min-h-9 items-center rounded-sm px-3 py-1 text-sm font-semibold`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

      </header>

      <section
        aria-labelledby="confirmation-pickup-heading"
        className="surface-soft mt-6 grid gap-4 p-4 sm:grid-cols-2 sm:p-5"
      >
        <div>
          <p className="page-kicker mb-2">Pickup</p>
          <h3
            id="confirmation-pickup-heading"
            className="text-lg font-semibold text-stone-950"
          >
            {formatPickupDate(order.pickupDate)} at {order.pickupTime}
          </h3>
          <p className="mt-1 text-sm text-stone-600">Self-pickup at the stall</p>
        </div>
        <div className="sm:border-l sm:border-stone-900/10 sm:pl-5">
          <p className="page-kicker mb-2">Collecting for</p>
          <p className="font-semibold text-stone-950">{order.customer.name}</p>
          <p className="mt-1 text-sm text-stone-600">{order.customer.phone}</p>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-stone-900/10 pt-5">
        <Link href="/menu" className="btn-primary">
          Order more from the menu
        </Link>
        <Link href="/" className="text-link text-sm">
          Back to homepage
        </Link>
      </div>

      <section
        aria-labelledby="confirmation-items-heading"
        className="mt-6 border-t border-stone-900/10 pt-5"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3
            id="confirmation-items-heading"
            className="text-lg font-semibold text-stone-950"
          >
            Items
          </h3>
          <span className="text-sm text-stone-500">
            {order.lines.reduce((count, line) => count + line.quantity, 0)} items
          </span>
        </div>
        <ul className="mt-3 divide-y divide-stone-900/10 text-sm">
          {order.lines.map((line) => (
            <li
              key={line.id}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="min-w-0 text-stone-700">
                <span className="mr-1 tabular-nums text-stone-500">
                  {line.quantity}×
                </span>
                {line.productName}
                {line.selection.sizeName ? ` (${line.selection.sizeName})` : ""}
                {line.selection.choiceName
                  ? ` — ${line.selection.choiceGroupName ?? "Option"}: ${line.selection.choiceName}`
                  : ""}
                {line.selection.checkboxNames &&
                line.selection.checkboxNames.length > 0
                  ? ` — ${line.selection.checkboxNames.join(", ")}`
                  : ""}
              </span>
              <span className="shrink-0 font-medium tabular-nums text-stone-900">
                {formatCents(lineSubtotalCents(line))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center justify-between gap-4 border-t border-stone-900/10 pt-4 text-lg font-bold text-brand">
          <span className="text-sm font-semibold text-stone-600">Total</span>
          <span className="tabular-nums">{formatCents(order.subtotalCents)}</span>
        </p>
        {order.payment ? (
          <p className="mt-3 text-right text-xs text-stone-500">
            Paid via {order.payment.method} · reference {order.payment.transactionId}
          </p>
        ) : null}
      </section>
    </div>
  );
}
