"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { getHeaderNavState } from "@/lib/navigation";

export function Header() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const selected = getHeaderNavState(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-surface">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-nowrap items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Whampoa Nan Xiang home"
          className="flex min-h-11 min-w-11 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Image
            src="/images/mascot.png"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 rounded-full bg-white shadow-sm ring-1 ring-brand/15"
          />
        </Link>
        <div className="flex shrink-0 items-center">
          <nav
            aria-label="Main"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-[0.12em] sm:gap-3 sm:text-[15px]"
          >
            <Link
              href="/"
              aria-current={selected.home ? "page" : undefined}
              className={`inline-flex min-h-12 items-center border-b-[3px] px-2 outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:px-4 ${
                selected.home
                  ? "border-brand text-brand-dark"
                  : "border-transparent text-stone-600 hover:border-stone-300 hover:text-brand-dark"
              }`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              aria-current={selected.menu ? "page" : undefined}
              className={`inline-flex min-h-12 items-center border-b-[3px] px-3 outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:px-4 ${
                selected.menu
                  ? "border-brand text-brand-dark"
                  : "border-transparent text-stone-600 hover:border-stone-300 hover:text-brand-dark"
              }`}
            >
              Menu
            </Link>
            <Link
              href="/cart"
              aria-current={selected.cart ? "page" : undefined}
              className={`inline-flex min-h-12 items-center gap-2 border-b-[3px] px-3 font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:px-4 ${
                selected.cart
                  ? "border-brand text-brand-dark"
                  : "border-transparent text-stone-600 hover:border-stone-300 hover:text-brand-dark"
              }`}
            >
              Cart
              {itemCount > 0 ? (
                <span
                  className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs tabular-nums ${
                    selected.cart
                      ? "bg-brand text-white"
                      : "bg-paper text-stone-700"
                  }`}
                >
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
