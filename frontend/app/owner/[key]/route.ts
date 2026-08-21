import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ROUTES,
  getOwnerAccessCookieOptions,
  isConfiguredOwnerRoute,
} from "@/lib/admin-route";

/**
 * Prototype-only owner entry. The server-side route key is a discoverability
 * gate, not production authentication or authorization.
 */
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const environment = { OWNER_ROUTE_KEY: process.env.OWNER_ROUTE_KEY };

  if (!isConfiguredOwnerRoute(key, environment)) {
    return new NextResponse(null, { status: 404 });
  }

  const response = NextResponse.redirect(
    new URL(ADMIN_ROUTES.login, request.url),
  );
  response.cookies.set(
    getOwnerAccessCookieOptions(
      environment,
      process.env.NODE_ENV === "production",
    ),
  );
  return response;
}
