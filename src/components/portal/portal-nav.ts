import {
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

export type DashboardViewId =
  | "dashboard"
  | "profile"
  | "workspace"
  | "updates"
  | "fixes";

export const DASHBOARD_NAV = {
  id: "dashboard" as const,
  label: "Dashboard",
  icon: LayoutDashboard,
  href: "/dashboard",
};

export const PROFILE_NAV = {
  id: "profile" as const,
  label: "Profile",
  icon: User,
  href: "/dashboard/profile",
};

export const WORKSPACE_NAV = {
  id: "workspace" as const,
  label: "Workspace",
  icon: Sparkles,
  href: "/dashboard/workspace",
};

export const UPDATES_NAV = {
  id: "updates" as const,
  label: "Updates",
  icon: MessageSquare,
  href: "/dashboard/update",
};

export const FIXES_NAV = {
  id: "fixes" as const,
  label: "Fixes",
  icon: Wrench,
  href: "/dashboard/fixes",
};

/** Primary navigation items */
export const PRIMARY_NAV = [DASHBOARD_NAV, PROFILE_NAV, WORKSPACE_NAV];

/** Secondary navigation items (below divider) */
export const SECONDARY_NAV = [UPDATES_NAV, FIXES_NAV];

/** Mobile bottom tab bar — top 4 most-used routes */
export const MOBILE_TAB_NAV = [
  DASHBOARD_NAV,
  PROFILE_NAV,
  WORKSPACE_NAV,
  UPDATES_NAV,
];

export const DASHBOARD_HOME = DASHBOARD_NAV.href;

export type DashboardSectionId = DashboardViewId;

export function navIdFromPathname(
  pathname: string
): DashboardViewId | "settings" {
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/dashboard/fixes")) return "fixes";
  if (pathname.startsWith("/dashboard/workspace")) return "workspace";
  if (pathname.startsWith("/dashboard/profile")) return "profile";
  if (pathname.startsWith("/dashboard/update")) return "updates";
  return "dashboard";
}

export function isPortalPath(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/settings");
}

export function isWorkspaceView(view: DashboardViewId) {
  return view === "workspace";
}

export function isUpdatesView(view: DashboardViewId) {
  return view === "updates";
}

export { LogOut, Settings };
