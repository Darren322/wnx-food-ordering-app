import assert from "node:assert/strict";
import test from "node:test";

import { filterOrdersByStatus } from "./admin-orders.ts";

const orders = [
  { id: "WNX-1001", status: "confirmed" },
  { id: "WNX-1002", status: "awaiting_payment" },
  { id: "WNX-1003", status: "cancelled" },
];

test("returns all orders for the All filter", () => {
  assert.deepEqual(filterOrdersByStatus(orders, "all"), orders);
});

test("returns only orders matching an individual status filter", () => {
  assert.deepEqual(filterOrdersByStatus(orders, "awaiting_payment"), [
    orders[1],
  ]);
});
