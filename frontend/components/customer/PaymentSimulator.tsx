"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order";
import { formatCents } from "@/lib/currency";
import { formatPickupDate } from "@/lib/preorder";
import { simulatePayNowPayment } from "@/lib/mockPayment";
import { useCart } from "@/components/cart/CartProvider";
import {
  clearPendingOrder,
  loadPendingOrder,
  saveOrder,
} from "@/components/cart/orderStorage";

/**
 * Simulated PayNow payment panel. PROTOTYPE ONLY — no real charge.
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
      <div className="surface-solid mx-auto max-w-xl p-8 text-center sm:p-10">
        <p className="font-semibold text-stone-950">
          There is no order awaiting payment.
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Return to the menu to start a new preorder.
        </p>
        <Link href="/menu" className="btn-primary mt-5">
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
    <div className="surface-solid mx-auto max-w-2xl overflow-hidden">
      <header className="border-b border-stone-900/10 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="page-kicker mb-2">Payment handoff</p>
            <h2 className="font-display text-3xl font-medium text-stone-950">
              Review and confirm
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Order reference <span className="font-semibold text-stone-900">{order.id}</span>
            </p>
          </div>
          <p className="shrink-0 text-2xl font-bold tabular-nums text-brand">
            {formatCents(order.subtotalCents)}
          </p>
        </div>

        <div className="surface-soft mt-5 grid gap-3 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Pickup
            </p>
            <p className="mt-1 font-semibold text-stone-950">
              {formatPickupDate(order.pickupDate)} at {order.pickupTime}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Collecting for
            </p>
            <p className="mt-1 font-semibold text-stone-950">{order.customer.name}</p>
            <p className="text-sm text-stone-600">{order.customer.phone}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_13rem] sm:p-7">
        <section aria-labelledby="paynow-instructions-heading" className="min-w-0">
          <div className="status-pending p-4">
            <p className="font-semibold text-stone-950">Demo payment</p>
            <p className="mt-1 text-sm leading-5 text-stone-700">
              This is a prototype. The QR code is decorative and no money will
              be charged.
            </p>
          </div>

          <h3
            id="paynow-instructions-heading"
            className="mt-6 text-lg font-semibold text-stone-950"
          >
            PayNow instructions
          </h3>
          <ol className="mt-3 space-y-3 text-sm leading-5 text-stone-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-sm bg-stone-900 text-xs font-bold text-white">
                1
              </span>
              <span>Review the pickup time and order total above.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-sm bg-stone-900 text-xs font-bold text-white">
                2
              </span>
              <span>In a real order, scan the PayNow QR code in your banking app.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-sm bg-stone-900 text-xs font-bold text-white">
                3
              </span>
              <span>For this demo, select the button to complete the simulated payment.</span>
            </li>
          </ol>
        </section>

        <div className="min-w-0 sm:border-l sm:border-stone-900/10 sm:pl-6">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Decorative QR
            </p>
            <div
              role="img"
              aria-label="Decorative simulated PayNow QR code"
              className="mx-auto mt-3 grid h-44 w-44 grid-cols-6 gap-1 rounded-lg border border-stone-300 bg-white p-3 sm:mx-0"
            >
              {Array.from({ length: 36 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    (index * 7 + 3) % 5 < 2 ? "bg-stone-900" : "bg-stone-200"
                  }
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={processing}
            onClick={() => handlePay(order)}
            className="btn-primary mt-5 w-full px-5 py-3"
          >
            {processing ? "Processing payment…" : "Simulate payment success"}
          </button>
          <Link
            href="/checkout"
            className="text-link mt-2 justify-center text-sm sm:justify-start"
          >
            Back to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
