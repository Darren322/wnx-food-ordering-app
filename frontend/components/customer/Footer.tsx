import Link from "next/link";
import { business } from "@/data/business";

export function Footer() {
  return (
    <footer className="app-footer mt-16 border-t">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm text-stone-600 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-bold text-stone-950">{business.name}</p>
          <p className="mt-1">Stall {business.stallUnit} · Since {business.since}</p>
          <p className="mt-1">
            Payments: {business.paymentsAccepted.join(", ")}
          </p>
        </div>
        <div>
          <p className="font-semibold text-stone-950">Visit us</p>
          <p className="mt-1">
            Address and opening hours will be published once confirmed with the
            stall.
          </p>
        </div>
        <div>
          <p className="font-semibold text-stone-950">Quick links</p>
          <ul className="mt-1">
            <li>
              <Link
                href="/menu"
                className="inline-flex min-h-11 items-center rounded-sm outline-none transition hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand"
              >
                Menu &amp; preorders
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="inline-flex min-h-11 items-center rounded-sm outline-none transition hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand"
              >
                Your cart
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className="inline-flex min-h-11 items-center rounded-sm outline-none transition hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand"
              >
                Stall owner login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-stone-900/10 py-4 text-center text-xs text-stone-500">
        Preorder &amp; self-pickup prototype. Contact details to be confirmed.
      </p>
    </footer>
  );
}
