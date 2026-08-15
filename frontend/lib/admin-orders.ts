import type { Order, OrderStatus } from "@/types/order";

export type OrderStatusFilter = "all" | OrderStatus;

export function filterOrdersByStatus(
  orders: Order[],
  filter: OrderStatusFilter
): Order[] {
  if (filter === "all") return orders;
  return orders.filter((order) => order.status === filter);
}
