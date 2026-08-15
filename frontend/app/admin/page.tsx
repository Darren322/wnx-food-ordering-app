import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminShell>
      <header className="landing-copy-enter mb-8 max-w-2xl">
        <p className="page-kicker">Stall operations</p>
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Keep incoming preorders moving and the menu ready for the next
          pickup.
        </p>
      </header>
      <AdminDashboard />
    </AdminShell>
  );
}
