import { type NextRequest, NextResponse } from "next/server";
import { isAiFetcherUserAgent } from "@/lib/public-context";
import { updateSession } from "@/lib/supabase/middleware";

const SESSION_PATHS = [
  "/",
  "/pricing",
  "/auth/",
  "/dashboard/",
  "/onboarding/",
  "/settings/",
  "/billing/",
  "/admin/",
  "/api/profile/",
  "/api/onboarding/",
  "/api/billing/",
  "/api/admin/",
  "/api/auth/",
];

function needsSessionRefresh(pathname: string): boolean {
  return SESSION_PATHS.some(
    (prefix) => pathname === prefix.replace(/\/$/, "") || pathname.startsWith(prefix)
  );
}

/** AI fetch tools hitting the HTML profile page get plain-text context instead. */
function maybeRewriteProfileForAiFetcher(request: NextRequest): NextResponse | null {
  const match = request.nextUrl.pathname.match(/^\/profile\/([^/]+)\/?$/);
  if (!match) return null;
  if (!isAiFetcherUserAgent(request.headers.get("user-agent"))) return null;

  const url = request.nextUrl.clone();
  url.pathname = `/api/public/profile/${match[1]}/context`;
  if (!url.searchParams.has("preset")) {
    url.searchParams.set("preset", "all");
  }
  return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
  const aiRewrite = maybeRewriteProfileForAiFetcher(request);
  if (aiRewrite) return aiRewrite;

  if (needsSessionRefresh(request.nextUrl.pathname)) {
    return updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/",
    "/pricing",
    "/auth/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/admin/:path*",
    "/api/profile/:path*",
    "/api/onboarding/:path*",
    "/api/billing/:path*",
    "/api/admin/:path*",
    "/api/auth/:path*",
  ],
};
