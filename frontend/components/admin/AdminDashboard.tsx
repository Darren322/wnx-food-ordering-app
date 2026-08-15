"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/types/order";
import type { Category, Product } from "@/types/product";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatCents } from "@/lib/currency";
import { mockOrders } from "@/data/mockOrders";
import { loadOrders } from "@/components/cart/orderStorage";
import {
  loadCategories,
  loadProducts,
} from "@/components/admin/adminStore";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProducts(loadProducts());
    setCategories(loadCategories());
    const all = [...loadOrders(), ...mockOrders].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    setOrders(all);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-stone-500"
      >
        Loading dashboard…
      </p>
    );
  }

  const awaiting = orders.filter((o) => o.status === "awaiting_payment");

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="dashboard-brief-heading"
        className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.62fr)] lg:gap-6"
      >
        <div className="surface-solid p-5 sm:p-7">
          <p className="page-kicker">01 · Owner desk / today</p>
          <h2
            id="dashboard-brief-heading"
            className="section-title max-w-xl text-4xl sm:text-5xl"
          >
            Keep the next pickup moving.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
            Start with the order queue, then make a menu update when the stall
            needs it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/admin/orders" className="btn-primary min-h-11">
              Review orders
            </Link>
            <Link href="/admin/products" className="text-link text-sm">
              Manage menu
            </Link>
          </div>
        </div>

        <aside className="surface-glass-strong flex flex-col p-5 sm:p-7" aria-label="Priority summary">
          <p className="page-kicker">Priority / needs attention</p>
          <h3 className="font-display text-2xl font-medium leading-tight text-stone-950 sm:text-3xl">
            Awaiting payment
          </h3>
          <p className="mt-4 font-display text-5xl font-medium leading-none tracking-[-0.03em] text-brand-dark">
            {awaiting.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {awaiting.length === 1 ? "Order needs" : "Orders need"} payment confirmation.
          </p>
          <Link href="/admin/orders" className="text-link mt-5 text-sm">
            Open the queue <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </aside>
      </section>

      <dl aria-label="Dashboard summary" className="grid gap-3 sm:grid-cols-2">
        <div className="surface-solid flex min-w-0 items-center justify-between gap-4 p-4 sm:p-5">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Products
            </dt>
            <dd className="mt-1 text-sm text-stone-600">
              In {categories.length} categories
            </dd>
          </div>
          <dd className="font-display text-4xl font-medium leading-none tracking-[-0.02em] text-stone-950">
            {products.length}
          </dd>
        </div>
        <div className="surface-solid flex min-w-0 items-center justify-between gap-4 p-4 sm:p-5">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Orders in view
            </dt>
            <dd className="mt-1 text-sm text-stone-600">Including demo data</dd>
          </div>
          <dd className="font-display text-4xl font-medium leading-none tracking-[-0.02em] text-stone-950">
            {orders.length}
          </dd>
        </div>
      </dl>

      <section
        aria-labelledby="latest-orders-heading"
        className="surface-solid overflow-hidden"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 px-5 py-5 sm:px-7">
          <div>
            <p className="page-kicker">02 · Recent activity</p>
            <h2 id="latest-orders-heading" className="section-title">
              Latest orders
            </h2>
          </div>
          <Link href="/admin/orders" className="text-link text-sm">
            View all orders <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="px-5 py-8 text-sm text-stone-500 sm:px-7">
            No orders yet.
          </p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {orders.slice(0, 5).map((o) => {
              const awaitingPayment = o.status === "awaiting_payment";

              return (
                <li
                  key={o.id}
                  className="grid gap-4 px-5 py-5 text-sm sm:grid-cols-[minmax(8rem,1fr)_minmax(0,1.6fr)_auto_auto] sm:items-center sm:px-7"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                      Order
                    </p>
                    <p className="mt-1 break-words font-semibold text-stone-950">
                      {o.id}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                      Customer &amp; pickup
                    </p>
                    <p className="mt-1 break-words text-stone-700">
                      {o.customer.name}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      Pickup {o.pickupDate} · {o.pickupTime}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                      Total
                    </p>
                    <p className="mt-1 font-semibold text-brand">
                      {formatCents(o.subtotalCents)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                      Status
                    </p>
                    <span
                      className={`mt-1 inline-flex min-h-8 items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                        awaitingPayment
                          ? "bg-brand-50 text-brand-dark ring-brand/20"
                          : "bg-paper text-stone-700 ring-stone-200"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
