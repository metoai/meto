import { ADMIN_HOME } from "@/components/admin/admin-nav";
import { isAdminUser } from "@/lib/admin-auth";
import { safeRedirectPath } from "@/lib/safe-redirect";

const USER_HOME = "/dashboard";

/** Paths admins may still land on after auth (e.g. landing save flow). */
const ADMIN_ALLOWED_PATHS = new Set(["/", "/billing/success"]);

function isUserPortalPath(path: string): boolean {
  return (
    path === USER_HOME ||
    path.startsWith("/dashboard/") ||
    path.startsWith("/settings") ||
    path.startsWith("/onboarding")
  );
}

export async function resolvePostAuthRedirect(
  userId: string,
  email: string,
  next?: string | null,
): Promise<string> {
  const requested = safeRedirectPath(next ?? null, USER_HOME);
  const isAdmin = await isAdminUser(userId, email);

  if (!isAdmin) {
    return requested;
  }

  if (ADMIN_ALLOWED_PATHS.has(requested)) {
    return requested;
  }

  if (!next || isUserPortalPath(requested)) {
    return ADMIN_HOME;
  }

  return requested;
}

export function userHomePathForAdmin(isAdmin: boolean): string {
  return isAdmin ? ADMIN_HOME : USER_HOME;
}
