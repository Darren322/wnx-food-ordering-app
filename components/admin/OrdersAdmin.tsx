"use client";

import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { lineSubtotalCents } from "@/types/cart";
import { formatCents } from "@/lib/currency";
import { mockOrders } from "@/data/mockOrders";
import { loadOrders, saveOrder } from "@/components/cart/orderStorage";

interface Row {
  order: Order;
  /** Customer orders (localStorage) are editable; mock demo orders are read-only. */
  editable: boolean;
}

export function OrdersAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
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

  if (!ready) {
    return <p className="text-sm text-neutral-500">Loading orders…</p>;
  }

  function updateStatus(order: Order, status: OrderStatus) {
    const updated = { ...order, status };
    saveOrder(updated);
    setRows((prev) =>
      prev.map((r) => (r.order.id === order.id ? { ...r, order: updated } : r))
    );
  }

  if (rows.length === 0) {
    return <p className="text-sm text-neutral-500">No orders yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {rows.map(({ order, editable }) => (
        <li
          key={order.id}
          className="rounded-xl border border-amber-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">
                {order.id}{" "}
                <span className="text-sm font-normal text-neutral-500">
                  {order.customer.name} · {order.customer.phone}
                </span>
              </p>
              <p className="text-sm text-neutral-600">
                Pickup {order.pickupDate} at {order.pickupTime} · placed{" "}
                {new Date(order.createdAt).toLocaleString("en-SG")}
              </p>
            </div>
            {editable ? (
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order, e.target.value as OrderStatus)
                }
                className="rounded border border-amber-300 bg-white px-2 py-1 text-sm"
              >
                {(
                  Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]
                ).map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            ) : (
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                {ORDER_STATUS_LABELS[order.status]} (demo)
              </span>
            )}
          </div>

          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-neutral-500">
                <th className="py-1">Item</th>
                <th className="py-1">Options</th>
                <th className="py-1 text-right">Qty</th>
                <th className="py-1 text-right">Unit</th>
                <th className="py-1 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line) => (
                <tr key={line.id} className="border-t border-amber-100">
                  <td className="py-2 font-medium">{line.productName}</td>
                  <td className="py-2 text-neutral-600">
                    {[
                      line.selection.sizeName
                        ? `Size: ${line.selection.sizeName}`
                        : null,
                      line.selection.choiceName
                        ? `${line.selection.choiceGroupName ?? "Option"}: ${line.selection.choiceName}`
                        : null,
                      line.selection.checkboxNames?.length
                        ? line.selection.checkboxNames.join(", ")
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </td>
                  <td className="py-2 text-right">{line.quantity}</td>
                  <td className="py-2 text-right">
                    {formatCents(line.unitPriceCents)}
                  </td>
                  <td className="py-2 text-right font-medium">
                    {formatCents(lineSubtotalCents(line))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-right font-bold text-red-800">
            Total: {formatCents(order.subtotalCents)}
          </p>
          {order.payment ? (
            <p className="text-right text-xs text-neutral-500">
              Paid via {order.payment.method} · ref{" "}
              {order.payment.transactionId}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
