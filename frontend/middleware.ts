import { NextRequest, NextResponse } from "next/server";
import {
  OWNER_ACCESS_COOKIE,
  isOwnerAccessCookie,
} from "@/lib/admin-route";

/**
 * Keep the established /admin route tree internally coherent while requiring
 * the prototype owner entry to establish a short-lived HttpOnly gate cookie.
 * This is route obscurity, not production authentication or authorization.
 */
export function middleware(request: NextRequest) {
  const environment = { OWNER_ROUTE_KEY: process.env.OWNER_ROUTE_KEY };
  const accessCookie = request.cookies.get(OWNER_ACCESS_COOKIE)?.value;

  if (!isOwnerAccessCookie(accessCookie, environment)) {
    // A blank 404 reveals less about the owner workspace than a redirect.
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
