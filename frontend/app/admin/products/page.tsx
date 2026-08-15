import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductAdmin } from "@/components/admin/ProductAdmin";

export const metadata: Metadata = {
  title: "Manage Products",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <header className="mb-8 max-w-3xl">
        <p className="page-kicker">Owner workspace · Menu operations</p>
        <h1 className="page-title">Products &amp; categories</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          Keep the familiar menu ready for the next preorder. Category changes
          save as you work; product details save when you choose Save product.
        </p>
      </header>
      <ProductAdmin />
    </AdminShell>
  );
}
