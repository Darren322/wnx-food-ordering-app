import assert from "node:assert/strict";
import test from "node:test";

import {
  PICKUP_SELECTION_STORAGE_KEY,
  getPickupContextState,
  getPickupDisplayState,
} from "./pickup-selection.ts";

const now = new Date("2026-08-21T00:30:00.000Z");

function createStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

const originalWindow = globalThis.window;
test.beforeEach(() => {
  globalThis.window = { localStorage: createStorage() };
});

test.afterEach(() => {
  if (originalWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = originalWindow;
  }
});

test("menu pickup banner shows the saved slot and a change action", () => {
  globalThis.window.localStorage.setItem(
    PICKUP_SELECTION_STORAGE_KEY,
    JSON.stringify({ version: 1, date: "2026-08-21", time: "16:00" }),
  );

  assert.deepEqual(getPickupDisplayState(getPickupContextState(now)), {
    status: "selected",
    label: "Today · 16:00",
    actionLabel: "Change pickup",
  });
});

test("menu pickup banner prompts customers to choose a time when empty", () => {
  assert.deepEqual(getPickupDisplayState(getPickupContextState(now)), {
    status: "unselected",
    label: "Choose a pickup time",
    actionLabel: "Choose pickup time",
  });
});
