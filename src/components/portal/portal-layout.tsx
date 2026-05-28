"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MetoMark } from "@/components/meto-mark";
import { usePortalData } from "@/components/portal/portal-data-context";
import { QuickUpdateSidebarProvider } from "@/components/portal/quick-update-sidebar-context";
import {
  DASHBOARD_SECTIONS,
  LogOut,
  MOBILE_NAV,
  Settings,
  navIdFromPathname,
} from "@/components/portal/portal-nav";
import { createClient } from "@/lib/supabase/client";

type PortalLayoutProps = {
  children: React.ReactNode;
};

function navLinkClass(active: boolean) {
  return `flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150 ease-in-out ${
    active
      ? "bg-[var(--primary-light)] font-medium text-[var(--primary)]"
      : "text-[var(--text-secondary)] hover:bg-[#F0FAF7] hover:text-[var(--text)]"
  }`;
}

function PortalSidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = navIdFromPathname(pathname);
  const isSettings = pathname.startsWith("/settings");

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <aside className="hidden w-52 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex">
        <div className="border-b border-[var(--border)] px-3 py-3">
          <Link
            href="/dashboard/workspace"
            className="flex items-center gap-2 text-[var(--text)]"
          >
            <MetoMark className="h-5 w-5" />
            <span className="text-sm font-medium">meto</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          <nav aria-label="Main">
            <ul className="space-y-0.5">
              {DASHBOARD_SECTIONS.map(({ id, label, icon: Icon, href }) => (
                <li key={id}>
                  <Link href={href} className={navLinkClass(activeId === id)}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-[var(--border)] px-2 py-3">
          <ul className="space-y-0.5">
            <li>
              <Link href="/settings" className={navLinkClass(isSettings)}>
                <Settings className="h-4 w-4 shrink-0" />
                Settings
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-all duration-150 ease-in-out hover:bg-[#F0FAF7] hover:text-[var(--text)]"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Log out
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--border)] bg-[var(--card)] pb-[max(0.35rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Main navigation"
      >
        {MOBILE_NAV.map(({ id, label, icon: Icon, href }) => {
          const isActive = id === "settings" ? isSettings : activeId === id;
          const mobileLabel =
            id === "profile"
              ? "Profile"
              : id === "quick-update"
                ? "Update"
                : label;

          return (
            <Link
              key={id}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {id === "settings" ? "Settings" : mobileLabel}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function PortalLayoutInner({ children }: PortalLayoutProps) {
  const pathname = usePathname();
  const activeId = navIdFromPathname(pathname);

  const headerLabel =
    activeId === "settings"
      ? "Settings"
      : DASHBOARD_SECTIONS.find((section) => section.id === activeId)?.label ??
        "Workspace";

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="relative z-10 flex min-h-screen">
        <PortalSidebarNav />

        <div className="flex min-w-0 flex-1 flex-col pb-14 md:pb-0">
          <header className="flex h-12 shrink-0 items-center border-b border-[var(--border)] px-4 md:px-5">
            <p className="text-sm text-[var(--text-secondary)]">{headerLabel}</p>
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export function PortalShell({ children }: PortalLayoutProps) {
  return (
    <QuickUpdateSidebarProvider>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </QuickUpdateSidebarProvider>
  );
}
