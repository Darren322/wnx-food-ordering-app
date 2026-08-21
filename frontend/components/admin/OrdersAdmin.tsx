"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { formatSingaporeDate } from "@/lib/admin-queue";
import { mockOrders } from "@/data/mockOrders";
import { loadOrders, saveOrder } from "@/components/cart/orderStorage";
import {
  filterOrdersByStatus,
  type OrderStatusFilter,
} from "@/lib/admin-orders";

interface Row {
  order: Order;
  /** Customer orders (localStorage) are editable; mock demo orders are read-only. */
  editable: boolean;
}

const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

function statusToneClass(status: OrderStatus): string {
  switch (status) {
    case "confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-950";
    case "cancelled":
      return "border-brand-100 bg-brand-50 text-brand-dark";
    case "awaiting_payment":
      return "border-stone-200 bg-paper text-stone-800";
  }
}

function formatSingaporeDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Singapore",
    timeZoneName: "short",
  }).format(date);
}

function formatPickupDateTime(order: Order): string {
  const date = new Date(`${order.pickupDate}T${order.pickupTime}:00+08:00`);
  if (Number.isNaN(date.getTime())) {
    return `${order.pickupDate} at ${order.pickupTime}`;
  }

  return `${formatSingaporeDate(order.pickupDate)} · ${order.pickupTime}`;
}

function lineOptions(line: Order["lines"][number]): string {
  return (
    [
      line.selection.sizeName ? `Size: ${line.selection.sizeName}` : null,
      line.selection.choiceName
        ? `${line.selection.choiceGroupName ?? "Option"}: ${line.selection.choiceName}`
        : null,
      line.selection.checkboxNames?.length
        ? line.selection.checkboxNames.join(", ")
        : null,
    ]
      .filter(Boolean)
      .join(" · ") || "No options"
  );
}

function orderPaymentLabel(order: Order): string {
  return order.payment
    ? `Paid via ${order.payment.method}`
    : "Payment not recorded";
}

export function OrdersAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [statusMessage, setStatusMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const local = loadOrders().map((order) => ({ order, editable: true }));
    const mock = mockOrders.map((order) => ({ order, editable: false }));
    setRows(
      [...local, ...mock].sort((a, b) =>
        b.order.createdAt.localeCompare(a.order.createdAt)
      )
    );
    setReady(true);
  }, []);

  const visibleRows = useMemo(() => {
    const visibleOrderIds = new Set(
      filterOrdersByStatus(
        rows.map(({ order }) => order),
        statusFilter
      ).map((order) => order.id)
    );

    return rows.filter((row) => visibleOrderIds.has(row.order.id));
  }, [rows, statusFilter]);

  if (!ready) {
    return (
      <div
        className="surface-solid p-5 text-sm text-stone-600"
        role="status"
        aria-live="polite"
      >
        Loading orders…
      </div>
    );
  }

  function updateStatus(order: Order, status: OrderStatus) {
    const updated = { ...order, status };
    saveOrder(updated);
    setRows((prev) =>
      prev.map((row) =>
        row.order.id === order.id ? { ...row, order: updated } : row
      )
    );
    setStatusMessage(`${order.id} is now ${ORDER_STATUS_LABELS[status]}.`);
  }

  const shownCount = visibleRows.length;
  const totalCount = rows.length;
  const filterDescription =
    statusFilter === "all"
      ? "all statuses"
      : ORDER_STATUS_LABELS[statusFilter].toLowerCase();

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="orders-queue-heading"
        className="surface-solid overflow-hidden"
      >
        <div className="flex flex-col gap-5 border-b border-stone-200 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div>
            <p className="page-kicker">Order queue</p>
            <h2 id="orders-queue-heading" className="section-title">
              Pickup orders
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Showing {shownCount} of {totalCount}{" "}
              {totalCount === 1 ? "order" : "orders"} · {filterDescription}
            </p>
          </div>

          <div className="w-full sm:max-w-56">
            <label
              htmlFor="order-status-filter"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-brand"
            >
              Filter by status
            </label>
            <select
              id="order-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as OrderStatusFilter)
              }
              className="input min-h-11 font-semibold"
            >
              <option value="all">All orders ({totalCount})</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {ORDER_STATUS_LABELS[status]} (
                  {rows.filter((row) => row.order.status === status).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {statusMessage ? (
          <p
            className="status-success mx-5 mt-5 p-3 text-sm sm:mx-7"
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}

        {visibleRows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-stone-600 sm:px-7">
            {rows.length === 0
              ? "No orders yet."
              : `No orders match ${
                  statusFilter === "all"
                    ? "this filter"
                    : ORDER_STATUS_LABELS[statusFilter]
                }.`}
          </p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {visibleRows.map(({ order, editable }) => (
              <li key={order.id} className="px-5 py-5 sm:px-7">
                <article aria-labelledby={`order-${order.id}`}>
                  <header className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(12rem,0.8fr)_minmax(10rem,0.65fr)] lg:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3
                          id={`order-${order.id}`}
                          className="font-semibold tracking-tight text-stone-950"
                        >
                          {order.id}
                        </h3>
                        <span className="rounded-sm border border-stone-200 bg-paper px-2 py-1 text-xs font-semibold text-stone-600">
                          {editable ? "Live order" : "Demo · read-only"}
                        </span>
                      </div>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                        Customer contact
                      </p>
                      <p className="mt-1 break-words text-sm text-stone-800">
                        {order.customer.name} ·{" "}
                        <a
                          href={`tel:${order.customer.phone.replace(/\s+/g, "")}`}
                          className="text-link min-h-0 text-sm"
                        >
                          {order.customer.phone}
                        </a>
                      </p>
                      <p className="mt-2 text-xs text-stone-500">
                        Placed {formatSingaporeDateTime(order.createdAt)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                        Pickup time · Singapore
                      </p>
                      <p className="mt-1 break-words font-semibold text-stone-950">
                        {formatPickupDateTime(order)}
                      </p>
                      <p className="mt-2 text-xs text-stone-500">
                        {order.lines.reduce(
                          (total, line) => total + line.quantity,
                          0
                        )}{" "}
                        {order.lines.reduce(
                          (total, line) => total + line.quantity,
                          0
                        ) === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>

                    <div className="min-w-0 lg:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                        Total
                      </p>
                      <p className="mt-1 text-lg font-bold text-stone-950">
                        {formatCents(order.subtotalCents)}
                      </p>
                      <p className="mt-1 break-words text-xs text-stone-600">
                        {orderPaymentLabel(order)}
                      </p>
                      {order.payment ? (
                        <p className="mt-1 break-all text-xs text-stone-500">
                          Ref {order.payment.transactionId}
                        </p>
                      ) : null}
                      <div className="mt-3 lg:flex lg:justify-end">
                        {editable ? (
                          <label className="block w-full lg:w-auto">
                            <span className="sr-only">
                              Update status for order {order.id}
                            </span>
                            <select
                              aria-label={`Update status for order ${order.id}`}
                              value={order.status}
                              onChange={(event) =>
                                updateStatus(
                                  order,
                                  event.target.value as OrderStatus
                                )
                              }
                              className={`input min-h-11 w-full px-3 py-2 text-sm font-semibold lg:min-w-48 ${statusToneClass(order.status)}`}
                            >
                              {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {ORDER_STATUS_LABELS[status]}
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : (
                          <span
                            className={`inline-flex min-h-11 items-center justify-center rounded-sm border px-3 py-2 text-sm font-semibold ${statusToneClass(order.status)}`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        )}
                      </div>
                    </div>
                  </header>

                  <div className="mt-5 border-t border-stone-200 pt-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-700">
                        Items
                      </h4>
                      <p className="text-xs text-stone-500">
                        {order.lines.length} line
                        {order.lines.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <ul className="mt-2 divide-y divide-stone-200 border-y border-stone-200">
                      {order.lines.map((line) => (
                        <li
                          key={line.id}
                          className="grid min-w-0 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-start"
                        >
                          <div className="min-w-0 break-words">
                            <p className="text-sm font-semibold text-stone-950">
                              {line.productName} · ×{line.quantity}
                            </p>
                            <p className="mt-1 break-words text-xs leading-5 text-stone-600">
                              {lineOptions(line)}
                            </p>
                          </div>
                          <p className="text-xs text-stone-500 sm:text-right">
                            Unit {formatCents(line.unitPriceCents)}
                          </p>
                          <p className="text-sm font-semibold text-brand sm:text-right">
                            {formatCents(lineSubtotalCents(line))}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
