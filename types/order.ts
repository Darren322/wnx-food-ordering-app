import type { CartLine } from "./cart";

export type OrderStatus = "awaiting_payment" | "confirmed" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: "Awaiting payment",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export interface OrderCustomer {
  name: string;
  phone: string;
}

export interface OrderPayment {
  method: "PayNow";
  transactionId: string;
  paidAt: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  /** ISO date (yyyy-mm-dd). */
  pickupDate: string;
  /** 24h time (HH:MM). */
  pickupTime: string;
  lines: CartLine[];
  subtotalCents: number;
  status: OrderStatus;
  payment?: OrderPayment;
}
