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
      <h1 className="mb-6 text-center text-3xl font-extrabold text-red-900">
        Payment
      </h1>
      <PaymentSimulator />
    </div>
  );
}
