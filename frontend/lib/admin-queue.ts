import type { Order } from "@/types/order";

export const ADMIN_TIME_ZONE = "Asia/Singapore";

export interface PickupQueue {
  /** Active orders whose pickup date is the current Singapore calendar date. */
  today: Order[];
  /** Active orders scheduled after the current Singapore calendar date. */
  upcoming: Order[];
  /** Active orders scheduled before the current Singapore calendar date. */
  past: Order[];
  /** First active pickup today, or the next scheduled pickup after today. */
  nextPickup: Order | null;
  todayDate: string;
}

const singaporeDateFormatter = new Intl.DateTimeFormat("en-SG", {
  timeZone: ADMIN_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const singaporeDisplayDateFormatter = new Intl.DateTimeFormat("en-SG", {
  timeZone: ADMIN_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

function datePart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

/** Return the YYYY-MM-DD calendar date in Singapore for an instant. */
export function singaporeDateKey(now: Date): string {
  if (Number.isNaN(now.getTime())) return "";

  const parts = singaporeDateFormatter.formatToParts(now);
  return `${datePart(parts, "year")}-${datePart(parts, "month")}-${datePart(
    parts,
    "day"
  )}`;
}

function parseDateKey(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? { year, month, day }
    : null;
}

export function formatSingaporeDate(value: string): string {
  const date = parseDateKey(value);
  if (!date) return value;

  const instant = new Date(
    Date.UTC(date.year, date.month - 1, date.day, 12) - 8 * 60 * 60 * 1000
  );
  return singaporeDisplayDateFormatter.format(instant);
}

function pickupInstant(order: Pick<Order, "pickupDate" | "pickupTime">): number | null {
  const date = parseDateKey(order.pickupDate);
  const time = /^(\d{2}):(\d{2})$/.exec(order.pickupTime);
  if (!date || !time) return null;

  const hours = Number(time[1]);
  const minutes = Number(time[2]);
  if (hours > 23 || minutes > 59) return null;

  return Date.UTC(date.year, date.month - 1, date.day, hours, minutes) -
    8 * 60 * 60 * 1000;
}

function comparePickup(a: Order, b: Order): number {
  const aInstant = pickupInstant(a);
  const bInstant = pickupInstant(b);

  if (aInstant === null && bInstant !== null) return 1;
  if (aInstant !== null && bInstant === null) return -1;
  if (aInstant !== null && bInstant !== null && aInstant !== bInstant) {
    return aInstant - bInstant;
  }

  return b.createdAt.localeCompare(a.createdAt);
}

function sortedByPickup(orders: Order[]): Order[] {
  return [...orders].sort(comparePickup);
}

/**
 * Split orders by their actual Singapore pickup date for the owner queue.
 * Cancelled orders stay available to the status-filtered Orders view but do
 * not count as actionable pickups here.
 */
export function getPickupQueue(
  orders: Order[],
  now: Date = new Date()
): PickupQueue {
  const todayDate = singaporeDateKey(now);
  const active = orders.filter(
    (order) => order.status !== "cancelled" && parseDateKey(order.pickupDate)
  );

  const today = sortedByPickup(
    active.filter((order) => order.pickupDate === todayDate)
  );
  const upcoming = sortedByPickup(
    active.filter((order) => order.pickupDate > todayDate)
  );
  const past = sortedByPickup(
    active.filter((order) => order.pickupDate < todayDate)
  );
  const nowInstant = now.getTime();
  const isFuturePickup = (order: Order): boolean => {
    const pickup = pickupInstant(order);
    return pickup !== null && Number.isFinite(nowInstant) && pickup >= nowInstant;
  };

  return {
    today,
    upcoming,
    past,
    nextPickup:
      today.find(isFuturePickup) ?? upcoming.find(isFuturePickup) ?? null,
    todayDate,
  };
}
