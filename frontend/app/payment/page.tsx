import type { Metadata } from "next";
import { PaymentSimulator } from "@/components/customer/PaymentSimulator";

export const metadata: Metadata = {
  title: "Payment",
  description: "Simulated PayNow payment for your preorder.",
  robots: { index: false },
};

export default function PaymentPage() {
  return (
    <div>
      <header className="mx-auto mb-7 max-w-xl text-center">
        <p className="page-kicker">Secure the preorder</p>
        <h1 className="page-title">Payment</h1>
        <p className="mt-3 leading-7 text-stone-600">
          Complete the simulated PayNow step to confirm your pickup.
        </p>
      </header>
      <PaymentSimulator />
    </div>
  );
}
