import assert from "node:assert/strict";
import test from "node:test";

import {
  earliestPickup,
  getAllSlots,
  getPickupAvailability,
  getPickupDates,
  getPickupSlots,
  isSlotAllowed,
  pickupDateRelation,
} from "./preorder.ts";

const instant = (value) => new Date(value);

test("offers 30-minute slots from 10:00 through 20:30", () => {
  const slots = getAllSlots();

  assert.equal(slots.length, 22);
  assert.equal(slots[0], "10:00");
  assert.equal(slots.at(-1), "20:30");
  assert.equal(slots[1], "10:30");
});

test("evaluates the six-hour boundary in Singapore time", () => {
  const exactCutoff = instant("2026-08-21T06:30:00.000Z");
  const afterCutoff = instant("2026-08-21T06:31:00.000Z");

  assert.equal(isSlotAllowed("2026-08-21", "20:30", exactCutoff), true);
  assert.equal(isSlotAllowed("2026-08-21", "20:00", exactCutoff), false);
  assert.equal(isSlotAllowed("2026-08-21", "20:30", afterCutoff), false);
});

test("never accepts a slot before the current Singapore instant", () => {
  const fridayAfternoon = instant("2026-08-21T07:33:00.000Z");

  assert.equal(isSlotAllowed("2026-08-21", "15:30", fridayAfternoon), false);
  assert.equal(isSlotAllowed("2026-08-21", "20:30", fridayAfternoon), false);
  assert.equal(isSlotAllowed("2026-08-22", "10:00", fridayAfternoon), true);
});

test("labels the next calendar day clearly without confusing clock times", () => {
  assert.equal(pickupDateRelation("2026-08-21", "2026-08-21"), "Today");
  assert.equal(pickupDateRelation("2026-08-22", "2026-08-21"), "Tomorrow");
  assert.equal(pickupDateRelation("2026-08-24", "2026-08-21"), null);
});

test("uses Singapore calendar dates regardless of the browser timezone", () => {
  const beforeOpening = instant("2026-08-21T00:30:00.000Z");

  assert.deepEqual(getPickupSlots("2026-08-21", beforeOpening).slice(0, 2), [
    "14:30",
    "15:00",
  ]);
  assert.equal(getPickupDates(beforeOpening)[0].value, "2026-08-21");
});

test("does not offer Sunday and moves the next pickup to Monday", () => {
  const sundayMorning = instant("2026-08-23T00:00:00.000Z");
  const dates = getPickupDates(sundayMorning);
  const availability = getPickupAvailability(sundayMorning);

  assert.deepEqual(getPickupSlots("2026-08-23", sundayMorning), []);
  assert.equal(dates[0].value, "2026-08-24");
  assert.equal(availability.today.available, false);
  assert.equal(availability.earliestNext?.date.value, "2026-08-24");
  assert.equal(availability.earliestNext?.time, "10:00");
});

test("exposes today cutoff and earliest next pickup after today closes", () => {
  const afterTodayCutoff = instant("2026-08-21T07:00:00.000Z");
  const availability = getPickupAvailability(afterTodayCutoff);

  assert.equal(availability.today.value, "2026-08-21");
  assert.equal(availability.today.available, false);
  assert.equal(availability.today.cutoff, "14:30");
  assert.equal(availability.earliestNext?.date.value, "2026-08-22");
  assert.equal(availability.earliestNext?.time, "10:00");
});

test("earliestPickup preserves the instant-based lead-time contract", () => {
  const now = instant("2026-08-21T00:30:00.000Z");

  assert.equal(earliestPickup(now).toISOString(), "2026-08-21T06:30:00.000Z");
});
