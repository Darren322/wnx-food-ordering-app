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
      <h1 className="mb-6 text-center text-3xl font-extrabold text-red-900">
        Order confirmation
      </h1>
      <Suspense
        fallback={<p className="text-sm text-neutral-500">Loading…</p>}
      >
        <ConfirmationView />
      </Suspense>
    </div>
  );
}
