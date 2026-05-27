"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MetoLogo } from "@/components/meto-logo";
import { getPublicProfileUrl } from "@/lib/username";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard#sections", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-brand-md transition-colors ${
        compact
          ? "flex-col gap-1 px-2 py-2 text-[10px]"
          : "px-3 py-2.5 text-sm"
      } ${
        active
          ? "bg-brand-card text-brand-text"
          : "text-brand-text-muted hover:bg-brand-card/50 hover:text-brand-text"
      }`}
    >
      <Icon className={compact ? "h-5 w-5 shrink-0" : "h-4 w-4 shrink-0"} />
      {label}
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => r.json())
      .then((d) => setUsername(d.profile?.username ?? null))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleCopyPublicUrl() {
    if (!username) return;
    await navigator.clipboard.writeText(getPublicProfileUrl(username));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sidebarContent = (
    <>
      <div className="px-5 py-6 max-md:hidden">
        <MetoLogo />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 max-md:hidden">
        {navItems.map(({ href, label, icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === href
            }
          />
        ))}

        {username && (
          <button
            type="button"
            onClick={handleCopyPublicUrl}
            className="mt-2 flex items-center gap-3 rounded-brand-md px-3 py-2.5 text-sm text-brand-text-muted transition-colors hover:bg-brand-card/50 hover:text-brand-text"
          >
            <Link2 className="h-4 w-4 shrink-0" />
            {copied ? "URL copied!" : "My public profile"}
          </button>
        )}
      </nav>

      <div className="border-t border-brand-border p-3 max-md:hidden">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-brand-md px-3 py-2.5 text-sm text-brand-text-muted transition-colors hover:bg-brand-card/50 hover:text-brand-text"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-brand-border bg-brand-surface md:flex">
        {sidebarContent}
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-brand-border bg-brand-surface px-2 py-2 md:hidden">
        {navItems.map(({ href, label, icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            compact
            active={
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === href
            }
          />
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 rounded-brand-md px-2 py-2 text-[10px] text-brand-text-muted"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </nav>
    </>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">{children}</div>
    </div>
  );
}
