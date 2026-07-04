import {
  FolderKanban,
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
  | "fixes"
  | "projects"
  | "mcp";

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

export const MCP_NAV = {
  id: "mcp" as const,
  label: "MCP",
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

export const PROJECTS_NAV = {
  id: "projects" as const,
  label: "Projects",
  icon: FolderKanban,
  href: "/dashboard/projects",
};

/** Personal users — profile-first, copy context, no MCP in nav */
export const PERSONAL_PRIMARY_NAV = [DASHBOARD_NAV, PROFILE_NAV, WORKSPACE_NAV];
export const PERSONAL_SECONDARY_NAV = [UPDATES_NAV, FIXES_NAV];

/** Developer users — projects + MCP; profile lives in Settings */
export const DEV_PRIMARY_NAV = [PROJECTS_NAV, MCP_NAV];
/** Devs only need chat updates; skip gap-fix strip unless they opt in via score */
export const DEV_SECONDARY_NAV = [UPDATES_NAV];

/** @deprecated use PERSONAL_PRIMARY_NAV */
export const PRIMARY_NAV = PERSONAL_PRIMARY_NAV;
/** @deprecated use PERSONAL_SECONDARY_NAV */
export const SECONDARY_NAV = PERSONAL_SECONDARY_NAV;

/** Mobile bottom tab bar — personal */
export const PERSONAL_MOBILE_TAB_NAV = [
  DASHBOARD_NAV,
  PROFILE_NAV,
  WORKSPACE_NAV,
  UPDATES_NAV,
];

/** Mobile bottom tab bar — developer */
export const DEV_MOBILE_TAB_NAV = [PROJECTS_NAV, MCP_NAV, UPDATES_NAV];

export const MOBILE_TAB_NAV = PERSONAL_MOBILE_TAB_NAV;

export const DASHBOARD_HOME = DASHBOARD_NAV.href;

export type DashboardSectionId = DashboardViewId;

export function navIdFromPathname(
  pathname: string
): DashboardViewId | "settings" {
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/dashboard/projects")) return "projects";
  if (pathname.startsWith("/dashboard/workspace")) return "workspace";
  if (pathname.startsWith("/dashboard/fixes")) return "fixes";
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
