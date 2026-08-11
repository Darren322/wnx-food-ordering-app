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
      <h1 className="mb-6 text-3xl font-extrabold text-red-900">
        Products &amp; categories
      </h1>
      <ProductAdmin />
    </AdminShell>
  );
}
