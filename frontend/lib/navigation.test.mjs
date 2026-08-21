import assert from "node:assert/strict";
import test from "node:test";

import { getHeaderNavState } from "./navigation.ts";

test("distinguishes the landing page from menu browsing routes", () => {
  assert.deepEqual(getHeaderNavState("/"), {
    home: true,
    menu: false,
    cart: false,
  });
  assert.deepEqual(getHeaderNavState("/menu"), {
    home: false,
    menu: true,
    cart: false,
  });
  assert.deepEqual(getHeaderNavState("/menu/dry-laksa"), {
    home: false,
    menu: true,
    cart: false,
  });
});

test("keeps cart selected through checkout and payment", () => {
  for (const pathname of ["/cart", "/checkout", "/payment"]) {
    assert.deepEqual(getHeaderNavState(pathname), {
      home: false,
      menu: false,
      cart: true,
    });
  }
});

test("does not mislabel unrelated or completed-order pages", () => {
  assert.deepEqual(getHeaderNavState("/order-confirmation"), {
    home: false,
    menu: false,
    cart: false,
  });
  assert.deepEqual(getHeaderNavState("/admin"), {
    home: false,
    menu: false,
    cart: false,
  });
});
