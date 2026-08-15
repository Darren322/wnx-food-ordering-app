"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { business } from "@/data/business";
import { isAuthed, logout } from "@/components/admin/adminStore";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

/** Auth gate + nav for the admin area (prototype auth, localStorage flag). */
export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-stone-500"
      >
        Checking access…
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="landing-shell-enter mb-8">
        <div className="surface-solid p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="page-kicker">Owner desk · Private access</p>
              <p className="font-display text-2xl font-medium leading-none tracking-[-0.02em] text-stone-950 sm:text-3xl">
                {business.name}
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Stall {business.stallUnit} · Since {business.since}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm sm:justify-end">
              <Link href="/" className="text-link px-2 text-sm">
                View site
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/admin/login");
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-200 bg-white/80 px-4 py-2 font-semibold text-stone-700 outline-none transition hover:bg-white hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
        <nav
          aria-label="Admin"
          className="toolbar-glass sticky top-[var(--app-header-offset)] z-30 mt-4 inline-flex max-w-full flex-wrap gap-1 p-1.5"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`pill inline-flex min-h-11 items-center outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                pathname === item.href
                  ? "pill-active"
                  : "pill-inactive"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
