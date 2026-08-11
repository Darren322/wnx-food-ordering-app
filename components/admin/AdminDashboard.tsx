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
    return <p className="text-sm text-neutral-500">Loading dashboard…</p>;
  }

  const awaiting = orders.filter((o) => o.status === "awaiting_payment");

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-white p-5">
          <p className="text-3xl font-bold text-red-800">{products.length}</p>
          <p className="text-sm text-neutral-600">
            Products in {categories.length} categories
          </p>
          <Link
            href="/admin/products"
            className="mt-2 inline-block text-sm text-red-800 underline"
          >
            Manage products
          </Link>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-5">
          <p className="text-3xl font-bold text-red-800">{orders.length}</p>
          <p className="text-sm text-neutral-600">Orders (incl. demo data)</p>
          <Link
            href="/admin/orders"
            className="mt-2 inline-block text-sm text-red-800 underline"
          >
            View orders
          </Link>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-5">
          <p className="text-3xl font-bold text-red-800">{awaiting.length}</p>
          <p className="text-sm text-neutral-600">Awaiting payment</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Latest orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-neutral-500">No orders yet.</p>
        ) : (
          <ul className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm"
              >
                <span className="font-semibold">{o.id}</span>
                <span>
                  {o.customer.name} · pickup {o.pickupDate} {o.pickupTime}
                </span>
                <span className="font-medium text-red-800">
                  {formatCents(o.subtotalCents)}
                </span>
                <span className="text-neutral-600">
                  {ORDER_STATUS_LABELS[o.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
