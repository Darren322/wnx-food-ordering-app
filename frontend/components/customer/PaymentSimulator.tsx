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
    return <p className="text-sm text-stone-500">Loading payment…</p>;
  }

  if (!order) {
    return (
      <div className="surface-glass p-10 text-center">
        <p className="text-stone-600">There is no order awaiting payment.</p>
        <Link
          href="/menu"
          className="btn-primary mt-5"
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
    <div className="surface-solid mx-auto max-w-xl overflow-hidden">
      <div className="surface-glass-strong flex flex-wrap items-start justify-between gap-4 border-b border-stone-900/10 p-5 sm:p-6">
        <div>
          <p className="page-kicker">Payment handoff</p>
          <h2 className="font-display text-2xl font-medium text-stone-950">
            Ready to confirm
          </h2>
          <p className="mt-1 text-sm text-stone-600">Order {order.id}</p>
        </div>
        <p className="shrink-0 text-2xl font-bold tabular-nums text-brand">
          {formatCents(order.subtotalCents)}
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center sm:p-6">
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Stripe · PayNow (simulation)
          </p>
          <div
            role="img"
            aria-label="Simulated PayNow QR code"
            className="mx-auto mt-4 grid h-48 w-48 grid-cols-6 gap-1 rounded-2xl border border-stone-200 bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_30px_-24px_rgba(28,25,23,0.5)]"
          >
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className={
                  (i * 7 + 3) % 5 < 2 ? "bg-stone-900" : "bg-stone-200"
                }
              />
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            Prototype only — this QR code is decorative and no money is charged.
          </p>
        </div>

        <div className="min-w-0 sm:border-l sm:border-stone-900/10 sm:pl-6">
          <p className="text-sm leading-6 text-stone-600">
            Complete the simulated payment to confirm your pickup slot.
          </p>
          <button
            type="button"
            disabled={processing}
            onClick={() => handlePay(order)}
            className="btn-primary mt-5 w-full px-5 py-3"
          >
            {processing ? "Processing payment…" : "Simulate payment success"}
          </button>
          <Link href="/checkout" className="text-link mt-2 justify-center text-sm sm:justify-start">
            Back to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
