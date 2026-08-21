/**
 * Central business facts for Whampoa Nan Xiang Chicken Rice.
 *
 * Anything marked TODO is UNKNOWN and must not be shown in JSON-LD
 * structured data until confirmed with the stall owner.
 */
export const business = {
  name: "Whampoa Nan Xiang Chicken Rice",
  nameZh: "海南鸡饭",
  since: 1982,
  stallUnit: "#04-57/58",
  /** Short, editable heritage blurb — do not extend with invented history. */
  heritage:
    "Serving Hainanese chicken rice at Whampoa since 1982 — tender poached chicken, fragrant rice, and our signature dry laksa.",
  paymentsAccepted: ["PayNow (online preorders)", "DBS PayLah (at the counter)"],

  // TODO: confirm stall address (Whampoa hawker centre) with the owner.
  address: null as string | null,
  // TODO: confirm telephone number.
  telephone: null as string | null,
  openingHours: "Monday–Saturday, 10:00–20:30",
  // TODO: confirm legal business name (for receipts / Stripe).
  legalName: null as string | null,
  // TODO: add social-media profile URLs once provided.
  social: [] as string[],
};

/**
 * PROTOTYPE ONLY — hardcoded demo admin credentials, not real auth.
 * Replace with a proper auth provider before any real deployment.
 */
export const adminCredentials = {
  username: "owner",
  password: "demo1234",
};
