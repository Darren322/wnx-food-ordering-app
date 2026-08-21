import assert from "node:assert/strict";
import test from "node:test";

import {
  ADMIN_ROUTES,
  OWNER_ACCESS_COOKIE,
  OWNER_ACCESS_COOKIE_MAX_AGE_SECONDS,
  getOwnerEntryPath,
  getOwnerAccessCookieOptions,
  getOwnerRouteKey,
  isOwnerAccessCookie,
  isConfiguredOwnerRoute,
} from "./admin-route.ts";

test("keeps internal admin paths stable for the existing route tree", () => {
  assert.deepEqual(ADMIN_ROUTES, {
    base: "/admin",
    login: "/admin/login",
    orders: "/admin/orders",
    products: "/admin/products",
  });
});

test("uses a safe configured owner route key for the prototype entry", () => {
  const environment = { OWNER_ROUTE_KEY: "stockroom" };

  assert.equal(getOwnerRouteKey(environment), "stockroom");
  assert.equal(getOwnerEntryPath(environment), "/owner/stockroom");
  assert.equal(isConfiguredOwnerRoute("stockroom", environment), true);
});

test("falls back to the documented route when configuration is invalid", () => {
  const environment = { OWNER_ROUTE_KEY: "../admin" };

  assert.equal(getOwnerRouteKey(environment), "counter");
  assert.equal(getOwnerEntryPath(environment), "/owner/counter");
  assert.equal(isConfiguredOwnerRoute("admin", environment), false);
});

test("describes a short-lived HttpOnly owner access cookie", () => {
  const environment = { OWNER_ROUTE_KEY: "stockroom" };

  assert.deepEqual(getOwnerAccessCookieOptions(environment, false), {
    name: OWNER_ACCESS_COOKIE,
    value: "stockroom",
    maxAge: OWNER_ACCESS_COOKIE_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  assert.equal(getOwnerAccessCookieOptions(environment, true).secure, true);
  assert.equal(isOwnerAccessCookie("stockroom", environment), true);
  assert.equal(isOwnerAccessCookie("1", environment), false);
  assert.equal(isOwnerAccessCookie("forged", environment), false);
});
