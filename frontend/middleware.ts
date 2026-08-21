import { NextRequest, NextResponse } from "next/server";

// Keep this small boundary self-contained. Vercel deploys middleware as an
// Edge Function, where importing application modules can make the bundle
// reference modules that the Edge runtime cannot load.
const OWNER_ACCESS_COOKIE = "wnx-owner-access";
const DEFAULT_OWNER_ROUTE_KEY = "counter";
const OWNER_ROUTE_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getConfiguredOwnerRouteKey(): string {
  const configured = process.env.OWNER_ROUTE_KEY?.trim() ?? "";
  const withoutSlashes = configured.replace(/^\/+|\/+$/g, "");
  const candidate = withoutSlashes.startsWith("owner/")
    ? withoutSlashes.slice("owner/".length)
    : withoutSlashes;
  const normalized = candidate.toLowerCase();

  return OWNER_ROUTE_KEY_PATTERN.test(normalized)
    ? normalized
    : DEFAULT_OWNER_ROUTE_KEY;
}

/**
 * Keep the established /admin route tree internally coherent while requiring
 * the prototype owner entry to establish a short-lived HttpOnly gate cookie.
 * This is route obscurity, not production authentication or authorization.
 */
export function middleware(request: NextRequest) {
  const accessCookie = request.cookies.get(OWNER_ACCESS_COOKIE)?.value;

  if (accessCookie !== getConfiguredOwnerRouteKey()) {
    // A blank 404 reveals less about the owner workspace than a redirect.
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
