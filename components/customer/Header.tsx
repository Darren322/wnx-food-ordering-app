"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-amber-200 bg-amber-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/mascot.png"
            alt="Whampoa Nan Xiang Chicken Rice mascot"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-red-800">
              Whampoa Nan Xiang
            </span>
            <span className="block text-xs text-neutral-600">
              Chicken Rice 海南鸡饭 · Since 1982
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-neutral-700 hover:text-red-800">
            Home
          </Link>
          <Link href="/menu" className="text-neutral-700 hover:text-red-800">
            Menu
          </Link>
          <Link
            href="/cart"
            className="rounded-lg bg-red-700 px-3 py-1.5 text-white hover:bg-red-800"
          >
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
