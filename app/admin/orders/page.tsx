import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";

export const metadata: Metadata = {
  title: "Manage Orders",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <h1 className="mb-6 text-3xl font-extrabold text-red-900">Orders</h1>
      <OrdersAdmin />
    </AdminShell>
  );
}
