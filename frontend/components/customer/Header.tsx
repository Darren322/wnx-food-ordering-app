"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-20 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="toolbar-glass mx-auto flex w-full max-w-7xl flex-nowrap items-center justify-between gap-4 px-3 sm:gap-8 sm:px-6 lg:gap-10 lg:px-8">
        <Link
          href="/"
          aria-label="Whampoa Nan Xiang home"
          className="flex min-h-11 min-w-11 items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
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
        <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-5">
          <nav
            aria-label="Main"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] sm:gap-4 sm:text-[15px] lg:gap-6 lg:text-base"
          >
            <Link
              href="/"
              className="hidden min-h-11 items-center rounded-full px-3 text-stone-600 outline-none transition hover:bg-white/65 hover:text-brand focus-visible:ring-2 focus-visible:ring-brand sm:inline-flex sm:px-4 lg:px-5"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-stone-600 outline-none transition hover:bg-white/65 hover:text-brand focus-visible:ring-2 focus-visible:ring-brand sm:px-4 lg:px-5"
            >
              Menu
            </Link>
            <Link href="/cart" className="btn-primary-sm">
              Cart
              {itemCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/15 px-1.5 py-0.5 text-xs tabular-nums">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </nav>
          <Link
            href="/admin/login"
            className="hidden min-h-11 items-center rounded-full border-l border-stone-900/10 pl-5 text-xs font-semibold normal-case tracking-normal text-stone-500 outline-none transition hover:text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:inline-flex"
          >
            Owner login
          </Link>
        </div>
      </div>
    </header>
  );
}
