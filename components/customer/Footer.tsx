import Link from "next/link";
import { business } from "@/data/business";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-amber-200 bg-amber-100/60">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm text-neutral-700 sm:grid-cols-3">
        <div>
          <p className="font-bold text-red-800">{business.name}</p>
          <p className="mt-1">Stall {business.stallUnit} · Since {business.since}</p>
          <p className="mt-1">
            Payments: {business.paymentsAccepted.join(", ")}
          </p>
        </div>
        <div>
          <p className="font-semibold">Visit us</p>
          <p className="mt-1">
            Address and opening hours will be published once confirmed with the
            stall.
          </p>
        </div>
        <div>
          <p className="font-semibold">Quick links</p>
          <ul className="mt-1 space-y-1">
            <li>
              <Link href="/menu" className="hover:text-red-800">
                Menu &amp; preorders
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-red-800">
                Your cart
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-red-800">
                Stall owner login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-amber-200 py-4 text-center text-xs text-neutral-500">
        Preorder &amp; self-pickup prototype. Contact details to be confirmed.
      </p>
    </footer>
  );
}
