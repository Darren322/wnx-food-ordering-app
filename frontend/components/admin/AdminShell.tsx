"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { business } from "@/data/business";
import { isAuthed, logout } from "@/components/admin/adminStore";
import { ADMIN_ROUTES } from "@/lib/admin-route";

const navItems = [
  { href: ADMIN_ROUTES.base, label: "Dashboard" },
  { href: ADMIN_ROUTES.orders, label: "Orders" },
  { href: ADMIN_ROUTES.products, label: "Products" },
];

/** Simple owner navigation around the prototype localStorage access gate. */
export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      router.replace(ADMIN_ROUTES.login);
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
      <header className="mb-8 border-b border-stone-200 pb-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="min-w-0">
            <p className="page-kicker">Owner area</p>
            <p className="font-display text-2xl font-medium leading-none tracking-[-0.02em] text-stone-950 sm:text-3xl">
              {business.name}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Orders and menu tools · Stall {business.stallUnit}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:justify-end">
            <Link href="/" className="text-link px-2 text-sm">
              Back to menu
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push(ADMIN_ROUTES.login);
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-sm border border-stone-200 bg-white px-4 py-2 font-semibold text-stone-700 outline-none transition hover:bg-stone-50 hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Log out
            </button>
          </div>
        </div>
        <nav
          aria-label="Owner navigation"
          className="mt-5 flex max-w-full gap-1 overflow-x-auto pb-1"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-sm border px-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                pathname === item.href
                  ? "border-graphite bg-graphite text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-950"
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
