"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PanelLeft, PanelLeftClose, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MetoMark } from "@/components/meto-mark";
import { usePortalDataOptional } from "@/components/portal/portal-data-context";
import { QuickUpdateSidebarProvider } from "@/components/portal/quick-update-sidebar-context";
import {
  DASHBOARD_HOME,
  FIXES_NAV,
  navIdFromPathname,
  PRIMARY_NAV,
  SECONDARY_NAV,
} from "@/components/portal/portal-nav";
import { TrialBanner } from "@/components/billing/trial-banner";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";

type PortalLayoutProps = {
  children: React.ReactNode;
};

type SidebarNavId = ReturnType<typeof navIdFromPathname>;

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const SIDEBAR_COLLAPSED_KEY = "meto-sidebar-collapsed";

function navItemClass(active: boolean, collapsed: boolean, muted = false) {
  const base = collapsed
    ? "group relative flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-150"
    : "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium leading-none transition-all duration-150";

  if (active) {
    return `${base} bg-[var(--card)] text-[var(--primary)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--border-subtle)]`;
  }

  if (muted) {
    return `${base} text-[var(--muted)] hover:bg-[var(--card)]/70 hover:text-[var(--text-secondary)]`;
  }

  return `${base} text-[var(--text-secondary)] hover:bg-[var(--card)]/70 hover:text-[var(--text)]`;
}

type SidebarContentProps = {
  activeId: SidebarNavId;
  issueCount?: number;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
  onLogout: () => void;
};

function SidebarContent({
  activeId,
  issueCount = 0,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
  onClose,
  onLogout,
}: SidebarContentProps) {
  const portal = usePortalDataOptional();
  const [authFullName, setAuthFullName] = useState("");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        const fullName = user?.user_metadata?.full_name;
        setAuthFullName(typeof fullName === "string" ? fullName.trim() : "");
      })
      .catch(() => {});
  }, []);

  const profileDisplayName = portal?.profile?.display_name?.trim();
  const sidebarDisplayName =
    profileDisplayName || authFullName || portal?.email?.trim() || "";
  const username = portal?.profile?.username?.trim();
  const initial = (sidebarDisplayName || username || "?")[0]?.toUpperCase();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)]/85 backdrop-blur-xl">
      <div
        className={`flex h-[60px] shrink-0 items-center ${
          collapsed ? "justify-between px-2" : "justify-between px-4"
        }`}
      >
        <Link
          href={DASHBOARD_HOME}
          className={`flex min-w-0 items-center transition-opacity hover:opacity-80 ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
          onClick={onNavigate}
          title="Meto home"
        >
          <MetoMark className="h-6 w-6 shrink-0" />
          {!collapsed ? (
            <span className="text-[16px] font-semibold tracking-[-0.03em] text-[var(--text)]">
              meto
            </span>
          ) : null}
        </Link>
        {!onClose ? <ThemeToggle compact className="shrink-0" /> : null}
        {onToggleCollapsed && !onClose ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        ) : null}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)]"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className={`flex-1 overflow-y-auto pb-3 ${collapsed ? "px-2" : "px-3"}`}>
        <nav aria-label="Main">
          {!collapsed && !onClose ? (
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              Menu
            </p>
          ) : null}
          <ul className="space-y-1">
            {PRIMARY_NAV.map(({ id, label, href, icon: Icon }) => (
              <li key={id}>
                <Link
                  href={href}
                  className={navItemClass(activeId === id, collapsed)}
                  onClick={onNavigate}
                  title={collapsed ? label : undefined}
                >
                  {activeId === id && !collapsed ? (
                    <span
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--primary)]"
                      aria-hidden
                    />
                  ) : null}
                  <Icon
                    className={`h-[17px] w-[17px] shrink-0 ${
                      activeId === id
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted)] group-hover:text-[var(--text-secondary)]"
                    }`}
                    strokeWidth={1.75}
                  />
                  {!collapsed ? <span>{label}</span> : null}
                </Link>
              </li>
            ))}
          </ul>

          {!collapsed && !onClose ? (
            <p className="mb-2 mt-5 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              Improve
            </p>
          ) : collapsed ? (
            <div className="my-3 border-t border-[var(--border-subtle)]" aria-hidden />
          ) : (
            <div className="my-2 border-t border-[var(--border-subtle)]" aria-hidden />
          )}
          <ul className="space-y-1">
            {SECONDARY_NAV.map(({ id, label, href, icon: Icon }) => {
              const isFixes = id === "fixes";
              const badge = isFixes && issueCount > 0 ? issueCount : 0;

              return (
                <li key={id}>
                  <Link
                    href={href}
                    className={navItemClass(activeId === id, collapsed)}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                  >
                    {activeId === id && !collapsed ? (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--primary)]"
                        aria-hidden
                      />
                    ) : null}
                    <span className="relative shrink-0">
                      <Icon
                        className={`h-[17px] w-[17px] ${
                          activeId === id
                            ? "text-[var(--primary)]"
                            : "text-[var(--muted)] group-hover:text-[var(--text-secondary)]"
                        }`}
                        strokeWidth={1.75}
                      />
                      {collapsed && badge > 0 ? (
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#DC2626] ring-2 ring-[var(--surface)]" />
                      ) : null}
                    </span>
                    {!collapsed ? (
                      <>
                        <span className="flex-1">{label}</span>
                        {badge > 0 ? (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-[#FEE2E2] px-1.5 text-[10px] font-semibold text-[#DC2626]">
                            {badge}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className={`shrink-0 pb-4 ${collapsed ? "px-2" : "px-3"}`}>
        {portal?.loaded && (sidebarDisplayName || username) ? (
          collapsed ? (
            <div className="mb-2 flex flex-col items-center gap-1">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-light)] text-xs font-semibold text-[var(--primary)]"
                title={sidebarDisplayName || username || "Profile"}
              >
                {initial}
              </div>
              <Link
                href="/settings"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--card)] ${
                  activeId === "settings" ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }`}
                onClick={onNavigate}
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          ) : (
            <div className="mb-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-xs font-semibold text-[var(--primary)]">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  {sidebarDisplayName ? (
                    <p className="truncate text-[13px] font-medium text-[var(--text)]">
                      {sidebarDisplayName}
                    </p>
                  ) : null}
                  {username ? (
                    <p className="truncate text-[11px] text-[var(--muted)]">@{username}</p>
                  ) : null}
                </div>
                <Link
                  href="/settings"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface)] ${
                    activeId === "settings" ? "text-[var(--primary)]" : "text-[var(--muted)]"
                  }`}
                  onClick={onNavigate}
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          )
        ) : null}
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            onLogout();
          }}
          className={navItemClass(false, collapsed, true)}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
          {!collapsed ? <span>Log out</span> : null}
        </button>
      </div>
    </div>
  );
}

type PortalSidebarNavProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
  issueCount?: number;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

function PortalSidebarNav({
  mobileOpen,
  onMobileClose,
  issueCount,
  collapsed,
  onToggleCollapsed,
}: PortalSidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = navIdFromPathname(pathname);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const sidebarProps: SidebarContentProps = {
    activeId,
    issueCount,
    collapsed,
    onToggleCollapsed,
    onLogout: () => void handleLogout(),
  };

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <>
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden h-screen border-r border-[var(--border-subtle)] transition-[width] duration-200 ease-in-out md:flex"
        style={{ width: sidebarWidth }}
      >
        <SidebarContent {...sidebarProps} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full w-[260px] max-w-[85vw] border-r border-[var(--border-subtle)]">
            <SidebarContent
              {...sidebarProps}
              onNavigate={onMobileClose}
              onClose={onMobileClose}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function PortalLayoutInner({ children }: PortalLayoutProps) {
  const pathname = usePathname();
  const portal = usePortalDataOptional();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const issueCount = portal?.issueCount ?? 0;

  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleSidebarCollapsed() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (typeof window === "undefined" || !portal?.refresh) return;
    if (!window.location.search.includes("upgraded=1")) return;

    void fetch("/api/billing/sync", { method: "POST" })
      .then(() => portal.refresh())
      .catch(() => {})
      .finally(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("upgraded");
        window.history.replaceState({}, "", url.pathname + url.search);
      });
  }, [portal]);

  return (
    <div className="h-screen overflow-hidden text-[var(--text)]">
      <PortalSidebarNav
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
        issueCount={issueCount}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
      />

      <div
        className={`flex h-full min-w-0 flex-col transition-[margin-left] duration-200 ease-in-out ${
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[240px]"
        }`}
      >
        <header className="shrink-0 border-b border-[var(--border-subtle)] bg-[var(--card)] md:hidden">
          <div className="flex h-12 items-center justify-between px-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
            >
              <PanelLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              href={FIXES_NAV.href}
              className="rounded-full bg-[var(--surface)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)]"
            >
              {issueCount > 0 ? `${issueCount} fixes` : "Fixes"}
            </Link>

            <Link
              href={DASHBOARD_HOME}
              className="flex h-9 w-9 shrink-0 items-center justify-center"
              aria-label="Meto home"
            >
              <MetoMark className="h-[22px] w-[22px]" />
            </Link>
          </div>
        </header>

        {portal?.entitlements ? (
          <TrialBanner entitlements={portal.entitlements} />
        ) : null}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
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
