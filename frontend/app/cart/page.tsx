import type { Metadata } from "next";
import { CartView } from "@/components/customer/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your preorder from Whampoa Nan Xiang Chicken Rice.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold text-red-900">Your cart</h1>
      <CartView />
    </div>
  );
}
