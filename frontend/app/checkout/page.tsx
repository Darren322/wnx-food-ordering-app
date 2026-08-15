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
      <header className="mb-7 max-w-2xl">
        <p className="page-kicker">Pickup details</p>
        <h1 className="page-title">Checkout</h1>
        <p className="mt-3 leading-7 text-stone-600">
          Tell us who is collecting and choose a convenient time.
        </p>
      </header>
      <CheckoutForm />
    </div>
  );
}
