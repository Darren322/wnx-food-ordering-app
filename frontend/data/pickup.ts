/**
 * Self-pickup schedule for preorders.
 * Adjust these values when the stall confirms its actual operating days
 * and hours — the 6-hour lead-time rule is enforced in lib/preorder.ts.
 */
export const pickup = {
  /** Days the stall accepts pickup. 0 = Sunday … 6 = Saturday. */
  // TODO: confirm actual operating days with the stall owner.
  operatingDays: [1, 2, 3, 4, 5, 6],
  /** Interval between selectable pickup time slots, in minutes. */
  slotIntervalMinutes: 30,
  /** First and last pickup slot of the day (24h "HH:MM"). */
  firstSlot: "09:00",
  lastSlot: "18:00",
  /**
   * Minimum lead time between placing the order and the pickup slot.
   * Same-day orders are only allowed when the selected pickup time is at
   * least this many hours away.
   */
  leadTimeHours: 6,
  /** How many days ahead (including today) to offer for pickup. */
  daysAhead: 14,
  /** Maximum number of date options shown in the checkout selector. */
  maxDatesShown: 10,
};
