import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/data/business";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Stall Owner Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative isolate mx-auto max-w-4xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 -top-20 -z-10 h-64 w-64 rounded-full bg-white/75 blur-3xl"
      />

      <section
        aria-labelledby="owner-login-heading"
        className="landing-shell-enter overflow-hidden rounded-[2rem] border border-[#d8ccbd] bg-surface/90 shadow-[0_1px_2px_rgba(87,67,48,0.08),0_28px_60px_-42px_rgba(87,67,48,0.58)] md:grid md:grid-cols-[0.9fr_1.1fr]"
      >
        <header className="relative overflow-hidden border-b border-[#d8ccbd] bg-[#eee4d3] p-7 sm:p-10 md:border-b-0 md:border-r">
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full border-[42px] border-white/20"
          />
          <div className="relative flex h-full flex-col">
            <div>
              <p className="page-kicker">Owner workspace</p>
              <h1 id="owner-login-heading" className="page-title max-w-sm">
                Back behind the counter.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-stone-600">
                Sign in to review incoming preorders and keep the stall menu up
                to date.
              </p>
            </div>

            <div className="mt-12 border-t border-stone-900/10 pt-5 md:mt-auto">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark">
                Owner desk · {business.nameZh}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-stone-500">
                    Since
                  </dt>
                  <dd className="mt-1 font-semibold tabular-nums text-stone-900">
                    {business.since}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-stone-500">
                    Stall
                  </dt>
                  <dd className="mt-1 font-semibold text-stone-900">
                    {business.stallUnit}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="surface-glass-strong !rounded-none !border-0 p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Secure access
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-none tracking-[-0.02em] text-stone-950 sm:text-4xl">
            Sign in to continue
          </h2>
          <p className="mt-3 max-w-md leading-7 text-stone-600">
            Use the stall owner account to open the order dashboard.
          </p>
          <LoginForm />
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-stone-500">
        Looking to place an order?{" "}
        <Link href="/menu" className="text-link min-h-0 text-sm">
          Return to the menu
        </Link>
      </p>
    </div>
  );
}
