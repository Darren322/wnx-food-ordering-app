import assert from "node:assert/strict";
import test from "node:test";

import {
  PICKUP_SELECTION_STORAGE_KEY,
  getPickupContextState,
  isValidPickupSelection,
  loadPickupSelection,
  savePickupSelection,
} from "./pickup-selection.ts";

const now = new Date("2026-08-21T00:30:00.000Z");
const validSelection = { date: "2026-08-21", time: "14:30" };

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

test("persists the existing versioned pickup selection shape", () => {
  assert.equal(savePickupSelection(validSelection, now), true);

  const raw = globalThis.window.localStorage.getItem(
    PICKUP_SELECTION_STORAGE_KEY,
  );
  assert.deepEqual(JSON.parse(raw), {
    version: 1,
    date: "2026-08-21",
    time: "14:30",
  });
  assert.deepEqual(loadPickupSelection(now), validSelection);
});

test("rejects a persisted slot once Singapore lead time makes it stale", () => {
  globalThis.window.localStorage.setItem(
    PICKUP_SELECTION_STORAGE_KEY,
    JSON.stringify({ version: 1, ...validSelection }),
  );

  assert.equal(
    loadPickupSelection(new Date("2026-08-21T00:31:00.000Z")),
    null,
  );
});

test("does not write malformed or unavailable selections", () => {
  const storage = globalThis.window.localStorage;

  assert.equal(
    isValidPickupSelection({ date: "2026-08-23", time: "10:00" }, now),
    false,
  );
  assert.equal(
    savePickupSelection({ date: "2026-08-21", time: "14:31" }, now),
    false,
  );
  assert.equal(storage.getItem(PICKUP_SELECTION_STORAGE_KEY), null);
});

test("ignores malformed and unsupported stored records", () => {
  const storage = globalThis.window.localStorage;

  storage.setItem(PICKUP_SELECTION_STORAGE_KEY, "not-json");
  assert.equal(loadPickupSelection(now), null);

  storage.setItem(
    PICKUP_SELECTION_STORAGE_KEY,
    JSON.stringify({ version: 2, ...validSelection }),
  );
  assert.equal(loadPickupSelection(now), null);
});

test("builds an immediate fallback context without persisting a choice", () => {
  const context = getPickupContextState(now);

  assert.equal(context.selection, null);
  assert.equal(context.date, "2026-08-21");
  assert.equal(context.time, "14:30");
  assert.deepEqual(context.slots.slice(0, 2), ["14:30", "15:00"]);
  assert.equal(context.availability.today.available, true);
});

test("hydrates an editable context from a current stored selection", () => {
  globalThis.window.localStorage.setItem(
    PICKUP_SELECTION_STORAGE_KEY,
    JSON.stringify({ version: 1, date: "2026-08-21", time: "16:00" }),
  );

  const context = getPickupContextState(now);

  assert.deepEqual(context.selection, { date: "2026-08-21", time: "16:00" });
  assert.equal(context.date, "2026-08-21");
  assert.equal(context.time, "16:00");
});
