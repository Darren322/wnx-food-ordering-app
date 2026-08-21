import assert from "node:assert/strict";
import test from "node:test";

import {
  CATEGORIES_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY,
  loadCustomerCatalog,
} from "./catalog-storage.ts";

const defaults = {
  products: [{ slug: "rice", name: "Original" }],
  categories: [{ slug: "mains", name: "Mains" }],
};

function createStorage(entries = []) {
  const values = new Map(entries);
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
  };
}

test("customer catalogue uses valid admin product and category edits", () => {
  const storage = createStorage([
    [PRODUCTS_STORAGE_KEY, JSON.stringify([{ slug: "rice", name: "Updated" }])],
    [CATEGORIES_STORAGE_KEY, JSON.stringify([{ slug: "specials", name: "Specials" }])],
  ]);

  assert.deepEqual(loadCustomerCatalog(defaults, storage), {
    products: [{ slug: "rice", name: "Updated" }],
    categories: [{ slug: "specials", name: "Specials" }],
  });
});

test("customer catalogue falls back safely when stored admin data is broken", () => {
  const storage = createStorage([
    [PRODUCTS_STORAGE_KEY, "not-json"],
    [CATEGORIES_STORAGE_KEY, JSON.stringify({ slug: "not-an-array" })],
  ]);

  assert.deepEqual(loadCustomerCatalog(defaults, storage), defaults);
});
