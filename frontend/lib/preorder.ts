// @ts-expect-error Node's test runner resolves explicit TypeScript extensions.
import { pickup } from "../data/pickup.ts";

/** The timezone that owns every pickup date and time in this module. */
export const PICKUP_TIME_ZONE = pickup.timeZone;

const SINGAPORE_OFFSET_MINUTES = 8 * 60;

export interface PickupDateOption {
  /** ISO date, yyyy-mm-dd, in Singapore time. */
  value: string;
  /** Human label, e.g. "Mon, 10 Aug 2026". */
  label: string;
}

export interface PickupAvailability {
  today: PickupDateOption & {
    available: boolean;
    slots: string[];
    /** Last Singapore-local time at which a same-day order can be placed. */
    cutoff: string | null;
    cutoffAt: Date | null;
  };
  dates: PickupDateOption[];
  earliestNext: {
    date: PickupDateOption;
    time: string;
  } | null;
}

interface CalendarDate {
  year: number;
  month: number;
  day: number;
  weekday: number;
}

const dateLabelFormatter = new Intl.DateTimeFormat("en-SG", {
  timeZone: PICKUP_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const singaporeDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: PICKUP_TIME_ZONE,
  calendar: "iso8601",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function dateKey(date: CalendarDate): string {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(
    date.day,
  ).padStart(2, "0")}`;
}

function parseDateKey(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const candidate = new Date(timestamp);

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day, weekday: candidate.getUTCDay() };
}

function singaporeDateKey(now: Date): string | null {
  if (Number.isNaN(now.getTime())) return null;

  const value = singaporeDateFormatter.format(now);
  return parseDateKey(value) ? value : null;
}

function slotToMinutes(slot: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(slot);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function minutesToSlot(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;
}

function addCalendarDays(value: string, days: number): string | null {
  const parsed = parseDateKey(value);
  if (!parsed) return null;

  const next = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  next.setUTCDate(next.getUTCDate() + days);
  return dateKey({
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
    weekday: next.getUTCDay(),
  });
}

export function pickupDateRelation(
  date: string,
  today: string,
): "Today" | "Tomorrow" | null {
  const selected = parseDateKey(date);
  const current = parseDateKey(today);
  if (!selected || !current) return null;

  const selectedDay = Date.UTC(selected.year, selected.month - 1, selected.day);
  const currentDay = Date.UTC(current.year, current.month - 1, current.day);
  const difference = (selectedDay - currentDay) / (24 * 60 * 60 * 1000);

  if (difference === 0) return "Today";
  if (difference === 1) return "Tomorrow";
  return null;
}

function slotInstant(date: string, time: string): Date | null {
  const parsedDate = parseDateKey(date);
  const minutes = slotToMinutes(time);
  if (!parsedDate || minutes === null) return null;

  return new Date(
    Date.UTC(
      parsedDate.year,
      parsedDate.month - 1,
      parsedDate.day,
      Math.floor(minutes / 60),
      minutes % 60,
    ) -
      SINGAPORE_OFFSET_MINUTES * 60 * 1000,
  );
}

export function formatPickupDate(date: string): string {
  const instant = slotInstant(date, "12:00");
  return instant ? dateLabelFormatter.format(instant) : date;
}

/** All configured slots in a Singapore-local operating day. */
export function getAllSlots(): string[] {
  const first = slotToMinutes(pickup.firstSlot);
  const last = slotToMinutes(pickup.lastSlot);
  if (first === null || last === null || first > last) return [];

  const slots: string[] = [];
  for (let time = first; time <= last; time += pickup.slotIntervalMinutes) {
    slots.push(minutesToSlot(time));
  }
  return slots;
}

/** Earliest acceptable pickup instant for an order placed at `now`. */
export function earliestPickup(now: Date = new Date()): Date {
  return new Date(now.getTime() + pickup.leadTimeHours * 60 * 60 * 1000);
}

/**
 * True when `date` and `time` identify a configured Singapore slot that is at
 * least six hours after the instant at which the order is placed.
 */
export function isSlotAllowed(
  date: string,
  time: string,
  now: Date = new Date(),
): boolean {
  const parsedDate = parseDateKey(date);
  if (!parsedDate || !getAllSlots().includes(time)) return false;
  if (!pickup.operatingDays.includes(parsedDate.weekday)) return false;

  const selected = slotInstant(date, time);
  const earliest = earliestPickup(now);
  if (!selected || Number.isNaN(earliest.getTime())) return false;
  return selected.getTime() >= earliest.getTime();
}

/** Selectable slots for a Singapore-local date, with lead time applied. */
export function getPickupSlots(
  date: string,
  now: Date = new Date(),
): string[] {
  return getAllSlots().filter((time) => isSlotAllowed(date, time, now));
}

/** Upcoming operating dates that still have at least one selectable slot. */
export function getPickupDates(now: Date = new Date()): PickupDateOption[] {
  const today = singaporeDateKey(now);
  if (!today) return [];

  const out: PickupDateOption[] = [];
  let cursor = today;
  for (
    let dayOffset = 0;
    dayOffset < pickup.daysAhead && out.length < pickup.maxDatesShown;
    dayOffset += 1
  ) {
    const parsed = parseDateKey(cursor);
    if (parsed && pickup.operatingDays.includes(parsed.weekday)) {
      if (getPickupSlots(cursor, now).length > 0) {
        out.push({ value: cursor, label: formatPickupDate(cursor) });
      }
    }

    cursor = addCalendarDays(cursor, 1) ?? cursor;
  }
  return out;
}

function todayCutoff(today: string): { time: string; at: Date } | null {
  const parsed = parseDateKey(today);
  const lastSlot = slotToMinutes(pickup.lastSlot);
  if (
    !parsed ||
    lastSlot === null ||
    !pickup.operatingDays.includes(parsed.weekday)
  ) {
    return null;
  }

  const cutoffMinutes = lastSlot - pickup.leadTimeHours * 60;
  if (cutoffMinutes < 0) return null;

  const time = minutesToSlot(cutoffMinutes);
  const at = slotInstant(today, time);
  return at ? { time, at } : null;
}

/**
 * Availability context for clear pickup messaging. `today` is always the
 * Singapore calendar date, even when it is closed or past its cutoff.
 */
export function getPickupAvailability(
  now: Date = new Date(),
): PickupAvailability {
  const todayValue = singaporeDateKey(now) ?? "";
  const todaySlots = todayValue ? getPickupSlots(todayValue, now) : [];
  const cutoff = todayValue ? todayCutoff(todayValue) : null;
  const dates = getPickupDates(now);
  const firstDate = dates[0];

  return {
    today: {
      value: todayValue,
      label: todayValue ? formatPickupDate(todayValue) : "Today",
      available: todaySlots.length > 0,
      slots: todaySlots,
      cutoff: cutoff?.time ?? null,
      cutoffAt: cutoff?.at ?? null,
    },
    dates,
    earliestNext: firstDate
      ? { date: firstDate, time: getPickupSlots(firstDate.value, now)[0] }
      : null,
  };
}
