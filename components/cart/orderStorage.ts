import type { Order } from "@/types/order";
import { mockOrders } from "@/data/mockOrders";

/**
 * localStorage-backed order persistence for the prototype.
 * Checkout saves a pending order (status "awaiting payment"); the payment
 * page finalises it into the orders list as "Confirmed".
 */

const ORDERS_KEY = "wnx-orders";
const PENDING_KEY = "wnx-pending-order";

function storageAvailable(): boolean {
  return typeof window !== "undefined";
}

export function loadOrders(): Order[] {
  if (!storageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

/** Insert or replace an order in the persisted list. */
export function saveOrder(order: Order): void {
  if (!storageAvailable()) return;
  const rest = loadOrders().filter((o) => o.id !== order.id);
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify([...rest, order]));
}

export function loadPendingOrder(): Order | null {
  if (!storageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export function savePendingOrder(order: Order): void {
  if (!storageAvailable()) return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(order));
}

export function clearPendingOrder(): void {
  if (!storageAvailable()) return;
  window.localStorage.removeItem(PENDING_KEY);
}

/** Look up an order by id: customer orders first, then the demo mock orders. */
export function getOrderById(id: string): Order | undefined {
  return (
    loadOrders().find((o) => o.id === id) ??
    mockOrders.find((o) => o.id === id)
  );
}
