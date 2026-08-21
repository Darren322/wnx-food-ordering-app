/**
 * Stable paths for the existing owner workspace.
 *
 * Keep these paths independent from the optional owner entry alias so that
 * links and redirects inside /admin remain coherent if the alias changes.
 */
export const ADMIN_ROUTES = {
  base: "/admin",
  login: "/admin/login",
  orders: "/admin/orders",
  products: "/admin/products",
} as const;

export const OWNER_ACCESS_COOKIE = "wnx-owner-access";
export const OWNER_ACCESS_COOKIE_MAX_AGE_SECONDS = 15 * 60;

const DEFAULT_OWNER_ROUTE_KEY = "counter";
const OWNER_ROUTE_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface OwnerRouteEnvironment {
  OWNER_ROUTE_KEY?: string;
}

export interface OwnerAccessCookieOptions {
  name: typeof OWNER_ACCESS_COOKIE;
  value: string;
  maxAge: typeof OWNER_ACCESS_COOKIE_MAX_AGE_SECONDS;
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
}

/**
 * Read the prototype-only owner entry key from configuration.
 *
 * Set the server-only OWNER_ROUTE_KEY environment value to a URL-safe segment
 * (for example `stockroom` or `/owner/stockroom`). The value only changes
 * discoverability; it is obscurity, not authentication or authorization. Keep
 * real production credentials and access control on the server before
 * deploying.
 */
export function getOwnerRouteKey(
  environment: OwnerRouteEnvironment = {}
): string {
  const configured = environment.OWNER_ROUTE_KEY?.trim() ?? "";
  const withoutSlashes = configured.replace(/^\/+|\/+$/g, "");
  const candidate = withoutSlashes.startsWith("owner/")
    ? withoutSlashes.slice("owner/".length)
    : withoutSlashes;
  const normalized = candidate.toLowerCase();

  return OWNER_ROUTE_KEY_PATTERN.test(normalized)
    ? normalized
    : DEFAULT_OWNER_ROUTE_KEY;
}

export function getOwnerEntryPath(
  environment: OwnerRouteEnvironment = {}
): string {
  return `/owner/${getOwnerRouteKey(environment)}`;
}

export function isConfiguredOwnerRoute(
  key: string,
  environment: OwnerRouteEnvironment = {}
): boolean {
  return key === getOwnerRouteKey(environment);
}

export function getOwnerAccessCookieOptions(
  environment: OwnerRouteEnvironment,
  isProduction: boolean
): OwnerAccessCookieOptions {
  return {
    name: OWNER_ACCESS_COOKIE,
    value: getOwnerRouteKey(environment),
    maxAge: OWNER_ACCESS_COOKIE_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
  };
}

export function isOwnerAccessCookie(
  value: string | undefined,
  environment: OwnerRouteEnvironment
): boolean {
  return value === getOwnerRouteKey(environment);
}
