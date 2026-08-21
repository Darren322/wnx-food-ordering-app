import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/data/business";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Owner sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-xl">
      <section
        aria-labelledby="owner-login-heading"
        className="surface-solid overflow-hidden"
      >
        <header className="border-b border-stone-200 bg-paper p-6 sm:p-8">
          <p className="page-kicker">Owner area</p>
          <h1 id="owner-login-heading" className="page-title">
            Owner sign in
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-stone-600">
            Sign in to review orders and keep the {business.name} menu ready.
          </p>
          <p className="mt-3 text-sm text-stone-500">
            Stall {business.stallUnit} · {business.nameZh}
          </p>
        </header>

        <div className="p-6 sm:p-8">
          <div
            role="note"
            className="border-l-2 border-brand bg-paper px-4 py-3 text-sm leading-6 text-stone-700"
          >
            <p className="font-semibold text-stone-950">Prototype only</p>
            <p className="mt-1">
              The configurable owner URL is obscurity for this prototype, not
              real security. Replace this demo login with server-side
              authentication before deployment.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-stone-500">
        Need to place an order?{" "}
        <Link href="/menu" className="text-link min-h-0 text-sm">
          Return to the menu
        </Link>
      </p>
    </div>
  );
}
