import { LogOut, MessageSquare, Settings, Sparkles, User } from "lucide-react";

export type DashboardViewId = "workspace" | "profile" | "quick-update";

export const WORKSPACE_NAV = {
  id: "workspace" as const,
  label: "Workspace",
  icon: Sparkles,
  href: "/dashboard/workspace",
};

export const QUICK_UPDATE_NAV = {
  id: "quick-update" as const,
  label: "Update profile",
  icon: MessageSquare,
  href: "/dashboard/update",
};

export const PROFILE_NAV = {
  id: "profile" as const,
  label: "Your profile",
  icon: User,
  href: "/dashboard/profile",
};

export const DASHBOARD_SECTIONS = [WORKSPACE_NAV, QUICK_UPDATE_NAV, PROFILE_NAV];

export type DashboardSectionId = DashboardViewId;

export const MOBILE_NAV: {
  id: DashboardViewId | "settings";
  label: string;
  icon: typeof Sparkles;
  href: string;
}[] = [
  WORKSPACE_NAV,
  QUICK_UPDATE_NAV,
  PROFILE_NAV,
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function navIdFromPathname(pathname: string): DashboardViewId | "settings" {
  if (pathname.startsWith("/dashboard/profile")) return "profile";
  if (pathname.startsWith("/dashboard/update")) return "quick-update";
  if (pathname.startsWith("/settings")) return "settings";
  return "workspace";
}

export function isPortalPath(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/settings");
}

export function isWorkspaceView(view: DashboardViewId) {
  return view === "workspace";
}

export function isQuickUpdateView(view: DashboardViewId) {
  return view === "quick-update";
}

export { LogOut, Settings };
