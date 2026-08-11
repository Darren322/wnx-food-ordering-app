import type { Metadata } from "next";
import { CheckoutForm } from "@/components/customer/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Guest checkout and self-pickup time selection.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold text-red-900">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
