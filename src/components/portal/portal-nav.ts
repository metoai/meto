import { LogOut, Link2, Settings, Sparkles, User } from "lucide-react";

export type DashboardViewId = "workspace" | "profile";

export const WORKSPACE_NAV = {
  id: "workspace" as const,
  label: "Workspace",
  icon: Sparkles,
  href: "/dashboard#workspace",
};

export const PROFILE_NAV = {
  id: "profile" as const,
  label: "Your profile",
  icon: User,
  href: "/dashboard#profile",
};

export const DASHBOARD_SECTIONS = [WORKSPACE_NAV, PROFILE_NAV];

export type DashboardSectionId = DashboardViewId;

export const MOBILE_NAV: {
  id: DashboardViewId | "settings";
  label: string;
  icon: typeof Sparkles;
  href: string;
}[] = [
  WORKSPACE_NAV,
  PROFILE_NAV,
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function normalizeDashboardView(hash: string): DashboardViewId {
  if (hash === "profile" || hash === "sections") return "profile";
  return "workspace";
}

export function isWorkspaceView(view: DashboardViewId) {
  return view === "workspace";
}

export { Link2, LogOut, Settings };
