import assert from "node:assert/strict";
import test from "node:test";

import {
  replaceProductBySlug,
  validateProductOptions,
} from "./admin-products.ts";

const products = [
  { slug: "chicken-rice", name: "Chicken Rice" },
  { slug: "dry-laksa", name: "Dry Laksa" },
];

test("replaces the original product when its page link changes", () => {
  assert.deepEqual(
    replaceProductBySlug(products, "dry-laksa", {
      slug: "signature-dry-laksa",
      name: "Dry Laksa",
    }),
    [
      products[0],
      { slug: "signature-dry-laksa", name: "Dry Laksa" },
    ],
  );
});

test("rejects a page link already owned by another product", () => {
  assert.equal(
    replaceProductBySlug(products, "dry-laksa", {
      slug: "chicken-rice",
      name: "Dry Laksa",
    }),
    null,
  );
});

test("adds a new product only when its page link is unique", () => {
  const added = { slug: "soy-chicken", name: "Soy Chicken" };
  assert.deepEqual(replaceProductBySlug(products, null, added), [
    ...products,
    added,
  ]);
});

test("rejects incomplete required choices before they reach the customer menu", () => {
  assert.match(
    validateProductOptions({
      requiredChoice: { name: "Spice level", choices: [] },
    }),
    /at least one choice/i,
  );
  assert.match(
    validateProductOptions({
      requiredChoice: {
        name: "Spice level",
        choices: [{ id: "mild", name: "" }],
      },
    }),
    /choice name/i,
  );
});

test("rejects blank or zero-priced option rows", () => {
  assert.match(
    validateProductOptions({ sizes: [{ id: "regular", name: "", priceCents: 0 }] }),
    /size name/i,
  );
  assert.match(
    validateProductOptions({ sizes: [{ id: "regular", name: "Regular", priceCents: 0 }] }),
    /greater than zero/i,
  );
  assert.match(
    validateProductOptions({ checkboxes: [{ id: "no-sprouts", name: "" }] }),
    /preference label/i,
  );
});

test("accepts a complete set of product options", () => {
  assert.equal(
    validateProductOptions({
      sizes: [{ id: "regular", name: "Regular", priceCents: 680 }],
      requiredChoice: {
        name: "Spice level",
        choices: [{ id: "mild", name: "Mild" }],
      },
      checkboxes: [{ id: "no-sprouts", name: "No bean sprouts" }],
    }),
    null,
  );
});
