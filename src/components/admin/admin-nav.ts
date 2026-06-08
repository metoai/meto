import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavId = "overview" | "users" | "billing" | "analytics";

export type AdminNavItem = {
  id: AdminNavId;
  label: string;
  href: string;
  icon: LucideIcon;
};

export const ADMIN_HOME = "/admin";

export const ADMIN_NAV: AdminNavItem[] = [
  { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { id: "users", label: "Users", href: "/admin/users", icon: Users },
  { id: "billing", label: "Billing", href: "/admin/billing", icon: CreditCard },
  { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function adminNavIdFromPathname(pathname: string): AdminNavId {
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/billing")) return "billing";
  if (pathname.startsWith("/admin/analytics")) return "analytics";
  return "overview";
}
