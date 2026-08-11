"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    return <p className="text-sm text-neutral-500">Checking access…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-4">
        <nav aria-label="Admin" className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                pathname === item.href
                  ? "bg-red-700 text-white"
                  : "bg-white text-neutral-700 ring-1 ring-amber-300 hover:bg-amber-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-neutral-600 underline">
            View site
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="rounded-lg bg-neutral-200 px-3 py-1.5 font-semibold text-neutral-700 hover:bg-neutral-300"
          >
            Log out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
