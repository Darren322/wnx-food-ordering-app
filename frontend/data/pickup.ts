/** Self-pickup schedule for preorders (all times are Singapore local time). */
export const pickup = {
  /** Days the stall accepts pickup. 0 = Sunday … 6 = Saturday. */
  operatingDays: [1, 2, 3, 4, 5, 6],
  /** Interval between selectable pickup time slots, in minutes. */
  slotIntervalMinutes: 30,
  /** First and last pickup slot of the day (24h "HH:MM"). */
  firstSlot: "10:00",
  lastSlot: "20:30",
  /**
   * Minimum lead time between placing the order and the pickup slot.
   * Same-day orders are only allowed when the selected pickup time is at
   * least this many hours away.
   */
  leadTimeHours: 6,
  /** IANA timezone used for every date and slot calculation. */
  timeZone: "Asia/Singapore",
  /** How many days ahead (including today) to offer for pickup. */
  daysAhead: 14,
  /** Maximum number of date options shown in the checkout selector. */
  maxDatesShown: 10,
};
