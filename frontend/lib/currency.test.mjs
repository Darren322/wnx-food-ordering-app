import assert from "node:assert/strict";
import test from "node:test";

import {
  centsToDollars,
  formatCents,
  parseDollarsToCents,
} from "./currency.ts";

test("formats customer-facing prices explicitly as Singapore dollars", () => {
  assert.equal(formatCents(450), "S$4.50");
  assert.equal(formatCents(0), "S$0.00");
});

test("parses and serialises form prices at the cents boundary", () => {
  assert.equal(parseDollarsToCents("4.50"), 450);
  assert.equal(parseDollarsToCents("-1"), null);
  assert.equal(centsToDollars(450), "4.50");
});
