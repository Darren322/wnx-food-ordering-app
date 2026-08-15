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
      <header className="mb-8 max-w-2xl">
        <p className="page-kicker">Stall operations</p>
        <h1 className="page-title">Orders</h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Keep incoming preorders clear, confirmed, and ready for pickup.
        </p>
      </header>
      <OrdersAdmin />
    </AdminShell>
  );
}
