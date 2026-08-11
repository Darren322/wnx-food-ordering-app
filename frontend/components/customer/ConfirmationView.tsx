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
    return <p className="text-sm text-neutral-500">Loading your order…</p>;
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-amber-200 bg-white p-8 text-center">
        <p className="text-neutral-600">We could not find that order.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
        >
          Back to the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <h2 className="text-xl font-bold text-green-800">
          {order.status === "confirmed"
            ? "Payment received — order confirmed"
            : ORDER_STATUS_LABELS[order.status]}
        </h2>
        <p className="mt-1 text-sm text-green-900">
          Order <span className="font-semibold">{order.id}</span> · Status:{" "}
          {ORDER_STATUS_LABELS[order.status]}
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-white p-6">
        <h3 className="mb-3 font-semibold">Pickup details</h3>
        <p className="text-sm text-neutral-700">
          {order.pickupDate} at {order.pickupTime} · self-pickup at the stall
        </p>
        <p className="mt-1 text-sm text-neutral-700">
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
        <p className="mt-3 border-t border-amber-200 pt-3 text-right font-bold text-red-800">
          Total: {formatCents(order.subtotalCents)}
        </p>
        {order.payment ? (
          <p className="mt-1 text-right text-xs text-neutral-500">
            Paid via {order.payment.method} · ref {order.payment.transactionId}
          </p>
        ) : null}
      </div>

      <div className="flex justify-center gap-4 text-sm">
        <Link href="/menu" className="text-red-800 underline">
          Order more from the menu
        </Link>
        <Link href="/" className="text-neutral-600 underline">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
