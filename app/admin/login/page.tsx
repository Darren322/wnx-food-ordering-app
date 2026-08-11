import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Stall Owner Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-3xl font-extrabold text-red-900">
        Stall owner login
      </h1>
      <LoginForm />
    </div>
  );
}
