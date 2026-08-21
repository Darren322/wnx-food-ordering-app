"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/types/order";
import type { Category, Product } from "@/types/product";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatCents } from "@/lib/currency";
import {
  formatSingaporeDate,
  getPickupQueue,
} from "@/lib/admin-queue";
import { mockOrders } from "@/data/mockOrders";
import { loadOrders } from "@/components/cart/orderStorage";
import {
  loadCategories,
  loadProducts,
} from "@/components/admin/adminStore";
import { useLiveNow } from "@/lib/use-live-now";

function statusTone(status: Order["status"]): string {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-950 ring-emerald-200";
    case "cancelled":
      return "bg-brand-50 text-brand-dark ring-brand/20";
    case "awaiting_payment":
      return "bg-amber-50 text-amber-950 ring-amber-200";
  }
}

function pickupLabel(order: Order): string {
  return `${formatSingaporeDate(order.pickupDate)} · ${order.pickupTime}`;
}

function DashboardOrderRow({ order }: { order: Order }) {
  return (
    <li className="px-5 py-5 sm:px-7">
      <article
        aria-label={`Order ${order.id}`}
        className="grid gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto] sm:items-start sm:gap-6"
      >
      <div className="min-w-0">
        <p className="break-words text-base font-bold text-stone-950">
          {order.id}
        </p>
        <p className="mt-1 break-words text-base text-stone-700">
          {order.customer.name} ·{" "}
          <a
            href={`tel:${order.customer.phone.replace(/\s+/g, "")}`}
            className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4"
          >
            {order.customer.phone}
          </a>
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-stone-600">
          Pickup
        </p>
        <p className="mt-1 break-words text-base font-bold text-stone-950">
          {pickupLabel(order)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:min-w-40 sm:flex-col sm:items-end sm:text-right">
        <p className="text-lg font-bold text-brand-dark">
          {formatCents(order.subtotalCents)}
        </p>
        <span
          className={`inline-flex min-h-9 items-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-semibold ring-1 ${statusTone(order.status)}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
      </article>
    </li>
  );
}

export function AdminDashboard() {
  const now = useLiveNow();
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

  const queue = getPickupQueue(orders, now);
  const awaiting = orders.filter((order) => order.status === "awaiting_payment");
  const todayLabel = formatSingaporeDate(queue.todayDate);
  const nextPickupLabel = queue.nextPickup
    ? pickupLabel(queue.nextPickup)
    : "No future pickup scheduled";
  const queueMessage =
    queue.today.length > 0
      ? `${queue.today.length} active ${queue.today.length === 1 ? "order is" : "orders are"} scheduled for ${todayLabel}.`
      : queue.nextPickup
        ? `There are no active pickups scheduled for ${todayLabel}. The next scheduled pickup is ${nextPickupLabel}.`
        : `There are no active pickups scheduled for ${todayLabel} or later.`;
  const activePickupCount = queue.today.length + queue.upcoming.length;

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="dashboard-brief-heading"
        className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.62fr)] lg:gap-6"
      >
        <div className="surface-solid p-5 sm:p-7">
          <p className="page-kicker">01 · Pickup queue / Singapore time</p>
          <h2
            id="dashboard-brief-heading"
            className="section-title max-w-xl text-4xl sm:text-5xl"
          >
            {queue.today.length > 0
              ? `${todayLabel} pickup queue`
              : "No active pickups today"}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
            {queueMessage}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/admin/orders" className="btn-primary min-h-11">
              Review pickup queue
            </Link>
            <Link href="/admin/products" className="text-link text-sm">
              Manage menu
            </Link>
          </div>
        </div>

        <aside
          className="surface-solid flex flex-col p-5 sm:p-7"
          aria-label="Pickup summary"
        >
          <p className="page-kicker">Priority / today</p>
          <h3 className="font-display text-2xl font-medium leading-tight text-stone-950 sm:text-3xl">
            Active pickups
          </h3>
          <p className="mt-4 font-display text-5xl font-medium leading-none tracking-[-0.03em] text-brand-dark">
            {queue.today.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {queue.today.length === 1 ? "order is" : "orders are"} scheduled
            for {todayLabel}.
          </p>
          <p className="mt-4 border-t border-stone-200 pt-4 text-sm text-stone-600">
            Next pickup: <span className="font-semibold text-stone-950">{nextPickupLabel}</span>
          </p>
          <Link href="/admin/orders" className="text-link mt-5 text-sm">
            Open all orders <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </aside>
      </section>

      <dl aria-label="Dashboard summary" className="grid gap-3 sm:grid-cols-3">
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
              Active pickups
            </dt>
            <dd className="mt-1 text-sm text-stone-600">Today + upcoming</dd>
          </div>
          <dd className="font-display text-4xl font-medium leading-none tracking-[-0.02em] text-stone-950">
            {activePickupCount}
          </dd>
        </div>
        <div className="surface-solid flex min-w-0 items-center justify-between gap-4 p-4 sm:p-5">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Awaiting payment
            </dt>
            <dd className="mt-1 text-sm text-stone-600">All loaded orders</dd>
          </div>
          <dd className="font-display text-4xl font-medium leading-none tracking-[-0.02em] text-stone-950">
            {awaiting.length}
          </dd>
        </div>
      </dl>

      <section
        aria-labelledby="today-pickups-heading"
        className="surface-solid overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-5 py-5 sm:px-7">
          <div>
            <p className="page-kicker">02 · Scheduled pickups</p>
            <h2 id="today-pickups-heading" className="section-title">
              {todayLabel}
            </h2>
          </div>
          <Link href="/admin/orders" className="text-link text-sm">
            View all orders <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
        {queue.today.length === 0 ? (
          <p className="px-5 py-8 text-sm text-stone-600 sm:px-7">
            No active pickups scheduled for {todayLabel}.
          </p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {queue.today.map((order) => (
              <DashboardOrderRow key={order.id} order={order} />
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="latest-orders-heading"
        className="surface-solid overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-5 py-5 sm:px-7">
          <div>
            <p className="page-kicker">03 · Recent activity</p>
            <h2 id="latest-orders-heading" className="section-title">
              Recent orders
            </h2>
            <p className="mt-2 text-base font-medium text-stone-700">
              Latest 5 orders
            </p>
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
            {orders.slice(0, 5).map((order) => (
              <DashboardOrderRow key={order.id} order={order} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
