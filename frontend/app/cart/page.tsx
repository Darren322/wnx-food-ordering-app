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
      <h1 className="page-title mb-7 sm:mb-8">Cart</h1>
      <CartView />
    </div>
  );
}
