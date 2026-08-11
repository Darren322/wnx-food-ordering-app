import { pickup } from "@/data/pickup";

/**
 * Preorder / self-pickup scheduling logic.
 *
 * The stall schedule (operating days, slot interval, lead time) lives in
 * data/pickup.ts so it can be changed without touching this code.
 *
 * Rule: same-day orders are only allowed when the selected pickup time is
 * at least `pickup.leadTimeHours` hours from the time the order is placed.
 */

export interface PickupDateOption {
  /** ISO date, yyyy-mm-dd (local). */
  value: string;
  /** Human label, e.g. "Mon, 10 Aug 2026". */
  label: string;
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function slotToMinutes(slot: string): number {
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m;
}

function minutesToSlot(mins: number): string {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/** All slots in a day, ignoring the lead-time rule. */
export function getAllSlots(): string[] {
  const first = slotToMinutes(pickup.firstSlot);
  const last = slotToMinutes(pickup.lastSlot);
  const slots: string[] = [];
  for (let t = first; t <= last; t += pickup.slotIntervalMinutes) {
    slots.push(minutesToSlot(t));
  }
  return slots;
}

/** Earliest acceptable pickup moment for an order placed at `now`. */
export function earliestPickup(now: Date = new Date()): Date {
  return new Date(now.getTime() + pickup.leadTimeHours * 60 * 60 * 1000);
}

/**
 * True when `date` (yyyy-mm-dd) is an operating day, `time` (HH:MM) is a
 * configured slot, and the slot is at least `leadTimeHours` after `now`.
 */
export function isSlotAllowed(
  date: string,
  time: string,
  now: Date = new Date()
): boolean {
  if (!getAllSlots().includes(time)) return false;
  const day = new Date(`${date}T00:00:00`);
  if (Number.isNaN(day.getTime())) return false;
  if (!pickup.operatingDays.includes(day.getDay())) return false;
  const slotDate = new Date(`${date}T${time}:00`);
  if (Number.isNaN(slotDate.getTime())) return false;
  return slotDate.getTime() >= earliestPickup(now).getTime();
}

/** Selectable time slots for a given date, with the lead-time rule applied. */
export function getPickupSlots(date: string, now: Date = new Date()): string[] {
  return getAllSlots().filter((t) => isSlotAllowed(date, t, now));
}

/** Upcoming operating days that still have at least one selectable slot. */
export function getPickupDates(now: Date = new Date()): PickupDateOption[] {
  const out: PickupDateOption[] = [];
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (
    let i = 0;
    i < pickup.daysAhead && out.length < pickup.maxDatesShown;
    i += 1
  ) {
    if (pickup.operatingDays.includes(cursor.getDay())) {
      const key = dateKey(cursor);
      if (getPickupSlots(key, now).length > 0) {
        out.push({
          value: key,
          label: cursor.toLocaleDateString("en-SG", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        });
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}
