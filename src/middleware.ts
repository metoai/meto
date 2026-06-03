import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/pricing",
    "/auth/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/api/profile/:path*",
    "/api/onboarding/:path*",
    "/api/billing/:path*",
  ],
};
