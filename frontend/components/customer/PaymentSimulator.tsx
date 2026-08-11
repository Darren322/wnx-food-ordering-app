"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order";
import { formatCents } from "@/lib/currency";
import { simulatePayNowPayment } from "@/lib/mockPayment";
import { useCart } from "@/components/cart/CartProvider";
import {
  clearPendingOrder,
  loadPendingOrder,
  saveOrder,
} from "@/components/cart/orderStorage";

/**
 * Simulated Stripe PayNow payment panel. PROTOTYPE ONLY — no real charge.
 * The order stays "Awaiting payment" until the simulated success completes.
 */
export function PaymentSimulator() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setOrder(loadPendingOrder());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p className="text-sm text-neutral-500">Loading payment…</p>;
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-amber-200 bg-white p-8 text-center">
        <p className="text-neutral-600">There is no order awaiting payment.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
        >
          Back to the menu
        </Link>
      </div>
    );
  }

  async function handlePay(current: Order) {
    setProcessing(true);
    const result = await simulatePayNowPayment(current.id);
    const paid: Order = {
      ...current,
      status: "confirmed",
      payment: {
        method: "PayNow",
        transactionId: result.transactionId,
        paidAt: result.paidAt,
      },
    };
    saveOrder(paid);
    clearPendingOrder();
    clearCart();
    router.push(`/order-confirmation?order=${encodeURIComponent(paid.id)}`);
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-xl border border-amber-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Stripe · PayNow (simulation)
        </p>
        <p className="mt-1 text-3xl font-bold text-red-800">
          {formatCents(order.subtotalCents)}
        </p>
        <p className="mt-1 text-sm text-neutral-600">Order {order.id}</p>

        <div
          role="img"
          aria-label="Simulated PayNow QR code"
          className="mx-auto mt-5 grid h-48 w-48 grid-cols-6 gap-1 rounded-lg border border-neutral-300 bg-white p-3"
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={i}
              className={
                (i * 7 + 3) % 5 < 2 ? "bg-neutral-900" : "bg-neutral-200"
              }
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Prototype only — this QR code is decorative and no money is charged.
        </p>
      </div>

      <button
        type="button"
        disabled={processing}
        onClick={() => handlePay(order)}
        className="w-full rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
      >
        {processing ? "Processing payment…" : "Simulate payment success"}
      </button>
      <p className="text-center text-sm">
        <Link href="/checkout" className="text-neutral-600 underline">
          Back to checkout
        </Link>
      </p>
    </div>
  );
}
