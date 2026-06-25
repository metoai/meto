"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PanelLeft, PanelLeftClose, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ADMIN_HOME,
  ADMIN_NAV,
  adminNavIdFromPathname,
} from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/client";

type AdminLayoutProps = {
  children: React.ReactNode;
  adminEmail: string;
};

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const SIDEBAR_COLLAPSED_KEY = "meto-admin-sidebar-collapsed";

function navItemClass(active: boolean, collapsed: boolean) {
  const base = collapsed
    ? "group relative flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-150"
    : "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium leading-none transition-all duration-150";

  if (active) {
    return `${base} bg-[var(--card)] text-[var(--primary)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--border-subtle)]`;
  }

  return `${base} text-[var(--text-secondary)] hover:bg-[var(--card)]/70 hover:text-[var(--text)]`;
}

type SidebarProps = {
  activeId: ReturnType<typeof adminNavIdFromPathname>;
  adminEmail: string;
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
  onLogout: () => void;
};

function AdminSidebar({
  activeId,
  adminEmail,
  collapsed,
  onToggleCollapsed,
  onNavigate,
  onClose,
  onLogout,
}: SidebarProps) {
  const initial = (adminEmail[0] ?? "A").toUpperCase();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)]/85 backdrop-blur-xl">
      <div
        className={`flex h-[60px] shrink-0 items-center ${
          collapsed ? "justify-between px-2" : "justify-between px-4"
        }`}
      >
        <Link
          href={ADMIN_HOME}
          className={`flex min-w-0 items-center transition-opacity hover:opacity-80 ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
          onClick={onNavigate}
          title="Admin home"
        >
          <MetoMarkBadge size="sm" />
          {!collapsed ? (
            <span className="text-[16px] font-semibold tracking-[-0.03em] text-[var(--text)]">
              meto
              <span className="ml-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--primary)]">
                admin
              </span>
            </span>
          ) : null}
        </Link>
        {onToggleCollapsed && !onClose ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
        <nav aria-label="Admin">
          {!collapsed && !onClose ? (
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              Console
            </p>
          ) : null}
          <ul className="space-y-1">
            {ADMIN_NAV.map(({ id, label, href, icon: Icon }) => (
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
        </nav>
      </div>

      <div className={`shrink-0 pb-4 ${collapsed ? "px-2" : "px-3"}`}>
        {!collapsed ? (
          <div className="landing-panel mb-2 p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-xs font-semibold text-[var(--primary)]">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-[13px] font-medium text-[var(--text)]">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-[var(--primary)]" strokeWidth={2} />
                  Admin
                </p>
                <p className="truncate text-[11px] text-[var(--muted)]">{adminEmail}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div
          className={`flex items-center ${collapsed ? "flex-col gap-1" : "gap-2"}`}
        >
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              onLogout();
            }}
            className={
              collapsed
                ? "flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--card)]/70 hover:text-[var(--text-secondary)]"
                : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--card)]/70 hover:text-[var(--text-secondary)]"
            }
            title="Log out"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <ThemeToggle compact className="shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children, adminEmail }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = adminNavIdFromPathname(pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const sidebarProps: SidebarProps = {
    activeId,
    adminEmail,
    collapsed: sidebarCollapsed,
    onToggleCollapsed: toggleSidebarCollapsed,
    onLogout: () => void handleLogout(),
  };

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <div className="h-screen overflow-hidden text-[var(--text)]">
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden h-screen border-r border-[var(--border-subtle)] transition-[width] duration-200 ease-in-out md:flex"
        style={{ width: sidebarWidth }}
      >
        <AdminSidebar {...sidebarProps} />
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative flex h-full w-[260px] max-w-[85vw] border-r border-[var(--border-subtle)]">
            <AdminSidebar
              {...sidebarProps}
              onNavigate={() => setMobileNavOpen(false)}
              onClose={() => setMobileNavOpen(false)}
            />
          </aside>
        </div>
      ) : null}

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
            <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--primary)]">
              Admin
            </span>
            <Link
              href={ADMIN_HOME}
              className="flex h-9 w-9 shrink-0 items-center justify-center"
              aria-label="Admin home"
            >
              <MetoMarkBadge size="sm" />
            </Link>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
