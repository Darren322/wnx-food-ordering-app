import assert from "node:assert/strict";
import test from "node:test";

import { replaceCartLine } from "./cart-lines.ts";

const original = {
  id: "dry-laksa|regular|xiao-la|",
  productSlug: "dry-laksa",
  productName: "Dry Laksa",
  unitPriceCents: 680,
  quantity: 1,
  selection: {
    sizeId: "regular",
    sizeName: "Regular",
    choiceId: "xiao-la",
    choiceName: "Xiao La",
  },
};

test("replaces a cart line in place when its selection changes", () => {
  const other = { ...original, id: "chicken-rice|||", productSlug: "chicken-rice" };
  const replacement = {
    ...original,
    id: "dry-laksa|large|da-la|",
    quantity: 2,
    unitPriceCents: 880,
  };

  assert.deepEqual(
    replaceCartLine([other, original], original.id, replacement),
    [other, replacement]
  );
});

test("merges quantities when an edit matches another existing line", () => {
  const matching = {
    ...original,
    id: "dry-laksa|large|da-la|",
    quantity: 3,
    unitPriceCents: 880,
  };
  const replacement = { ...matching, quantity: 2 };

  assert.deepEqual(
    replaceCartLine([original, matching], original.id, replacement),
    [{ ...matching, quantity: 5 }]
  );
});

test("leaves the cart untouched when the edited line no longer exists", () => {
  assert.deepEqual(
    replaceCartLine([original], "missing-line", { ...original, quantity: 4 }),
    [original]
  );
});
