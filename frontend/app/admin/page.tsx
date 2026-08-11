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
      <h1 className="mb-6 text-3xl font-extrabold text-red-900">Dashboard</h1>
      <AdminDashboard />
    </AdminShell>
  );
}
