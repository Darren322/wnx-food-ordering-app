import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationView } from "@/components/customer/ConfirmationView";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your Whampoa Nan Xiang Chicken Rice preorder confirmation.",
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <div>
      <header className="mx-auto mb-7 max-w-xl text-center">
        <p className="page-kicker">Pickup arranged</p>
        <h1 className="page-title">Order confirmation</h1>
      </header>
      <Suspense
        fallback={<p className="text-sm text-stone-500">Loading…</p>}
      >
        <ConfirmationView />
      </Suspense>
    </div>
  );
}
