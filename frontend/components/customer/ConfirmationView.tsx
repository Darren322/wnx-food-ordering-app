"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
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
      <div className="surface-glass p-10 text-center">
        <p className="text-stone-600">We could not find that order.</p>
        <Link
          href="/menu"
          className="btn-primary mt-5"
        >
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
        : "rounded-3xl border border-brand/20 bg-brand-50 text-brand-dark";

  return (
    <div className="surface-solid mx-auto max-w-xl overflow-hidden">
      <div
        className={`${statusClass} !rounded-none !border-x-0 !border-t-0 !border-b !border-stone-900/10 p-5 text-center sm:p-6`}
      >
        <h2 className="text-xl font-semibold">
          {order.status === "confirmed"
            ? "Payment received — order confirmed"
            : ORDER_STATUS_LABELS[order.status]}
        </h2>
        <p className="mt-2 text-sm opacity-85">
          Order <span className="font-semibold">{order.id}</span> · Status:{" "}
          {ORDER_STATUS_LABELS[order.status]}
        </p>
      </div>

      <div className="surface-glass-strong !rounded-none p-5 sm:p-6">
        <h3 className="mb-3 font-semibold">Pickup details</h3>
        <p className="text-sm text-stone-700">
          {order.pickupDate} at {order.pickupTime} · self-pickup at the stall
        </p>
        <p className="mt-1 text-sm text-stone-700">
          {order.customer.name} · {order.customer.phone}
        </p>

        <h3 className="mb-2 mt-5 font-semibold">Items</h3>
        <ul className="space-y-2 text-sm">
          {order.lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-3">
              <span>
                {line.quantity} × {line.productName}
                {line.selection.sizeName ? ` (${line.selection.sizeName})` : ""}
                {line.selection.choiceName
                  ? ` — ${line.selection.choiceGroupName ?? "Option"}: ${line.selection.choiceName}`
                  : ""}
                {line.selection.checkboxNames &&
                line.selection.checkboxNames.length > 0
                  ? ` — ${line.selection.checkboxNames.join(", ")}`
                  : ""}
              </span>
              <span className="font-medium">
                {formatCents(lineSubtotalCents(line))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-stone-200 pt-4 text-right font-bold text-brand">
          Total: {formatCents(order.subtotalCents)}
        </p>
        {order.payment ? (
          <p className="mt-1 text-right text-xs text-stone-500">
            Paid via {order.payment.method} · ref {order.payment.transactionId}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-x-5 border-t border-stone-900/10 px-5 py-3 text-sm sm:justify-end sm:px-6">
        <Link href="/menu" className="text-link text-sm">
          Order more from the menu
        </Link>
        <Link href="/" className="text-link text-sm">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
