import assert from "node:assert/strict";
import test from "node:test";

import {
  getPickupQueue,
  singaporeDateKey,
} from "./admin-queue.ts";

const orders = [
  {
    id: "today-passed",
    pickupDate: "2026-08-21",
    pickupTime: "09:00",
    status: "confirmed",
  },
  {
    id: "today-late",
    pickupDate: "2026-08-21",
    pickupTime: "17:30",
    status: "confirmed",
  },
  {
    id: "tomorrow",
    pickupDate: "2026-08-22",
    pickupTime: "12:00",
    status: "awaiting_payment",
  },
  {
    id: "yesterday",
    pickupDate: "2026-08-20",
    pickupTime: "12:00",
    status: "confirmed",
  },
  {
    id: "today-cancelled",
    pickupDate: "2026-08-21",
    pickupTime: "12:00",
    status: "cancelled",
  },
];

test("uses the Singapore calendar date for the dashboard queue", () => {
  const now = new Date("2026-08-21T02:00:00.000Z");

  assert.equal(singaporeDateKey(now), "2026-08-21");
  const queue = getPickupQueue(orders, now);

  assert.deepEqual(queue.today.map((order) => order.id), [
    "today-passed",
    "today-late",
  ]);
  assert.deepEqual(queue.upcoming.map((order) => order.id), ["tomorrow"]);
  assert.deepEqual(queue.past.map((order) => order.id), ["yesterday"]);
  assert.equal(queue.nextPickup?.id, "today-late");
});

test("uses the earliest upcoming date when all of today's pickups have passed", () => {
  const now = new Date("2026-08-21T12:00:00.000Z");
  const queue = getPickupQueue(orders, now);

  assert.deepEqual(queue.today.map((order) => order.id), [
    "today-passed",
    "today-late",
  ]);
  assert.equal(queue.nextPickup?.id, "tomorrow");
});

test("does not call past mock orders today and skips cancelled pickups", () => {
  const now = new Date("2026-08-21T02:00:00.000Z");
  const queue = getPickupQueue(orders, now);

  assert.equal(queue.today.some((order) => order.id === "yesterday"), false);
  assert.equal(queue.today.some((order) => order.id === "today-cancelled"), false);
});
