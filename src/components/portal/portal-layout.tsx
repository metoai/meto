"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { MetoMark } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DashboardViewProvider,
  useDashboardViewOptional,
} from "@/components/portal/dashboard-view-context";
import {
  DASHBOARD_SECTIONS,
  Link2,
  LogOut,
  MOBILE_NAV,
  PROFILE_NAV,
  Settings,
  WORKSPACE_NAV,
  type DashboardViewId,
} from "@/components/portal/portal-nav";
import { getPublicProfileUrl } from "@/lib/username";
import { createClient } from "@/lib/supabase/client";

type PortalLayoutProps = {
  children: React.ReactNode;
  displayName?: string;
  username?: string | null;
  completion?: number;
};

function navLinkClass(active: boolean) {
  return `flex w-full items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2 text-sm transition-colors duration-150 ${
    active
      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]"
      : "border-transparent text-[var(--color-muted)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
  }`;
}

function PortalSidebarNav({
  displayName,
  username,
  completion,
}: {
  displayName?: string;
  username?: string | null;
  completion?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const viewCtx = useDashboardViewOptional();
  const [copied, setCopied] = useState(false);

  const isDashboard = pathname === "/dashboard";
  const isSettings = pathname === "/settings";
  const activeView = viewCtx?.view ?? "workspace";
  const WorkspaceIcon = WORKSPACE_NAV.icon;

  function goToView(next: DashboardViewId) {
    if (viewCtx) {
      viewCtx.setView(next);
      return;
    }
    router.push(`/dashboard#${next}`);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleCopyProfile() {
    if (!username) return;
    await navigator.clipboard.writeText(getPublicProfileUrl(username));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <aside className="hidden w-52 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md md:flex">
        <div className="border-b border-[var(--color-border)]/60 px-4 py-4">
          <button
            type="button"
            onClick={() => goToView("workspace")}
            className="flex items-center gap-2.5 text-left"
          >
            <MetoMark className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-tight">meto</span>
          </button>
          {displayName ? (
            <p className="mt-3 truncate text-sm font-medium text-[var(--color-text)]">
              {displayName}
            </p>
          ) : null}
          {completion !== undefined && isDashboard ? (
            completion >= 100 ? (
              <p className="mt-2 text-xs text-[var(--color-accent)]">✓ Profile complete</p>
            ) : (
              <div
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
                role="progressbar"
                aria-valuenow={completion}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            )
          ) : null}
          {username ? (
            <Link
              href={`/profile/${username}`}
              className="mt-1 block truncate text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              /profile/{username}
            </Link>
          ) : isDashboard ? (
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Claim username in Settings
            </p>
          ) : null}
        </div>

        {isDashboard ? (
          <div className="flex-1 overflow-y-auto px-2 py-3">
            <nav aria-label="Dashboard">
              <ul className="space-y-0.5">
                <li>
                  <button
                    type="button"
                    onClick={() => goToView("workspace")}
                    className={navLinkClass(activeView === "workspace")}
                  >
                    <WorkspaceIcon className="h-4 w-4 shrink-0" />
                    {WORKSPACE_NAV.label}
                  </button>
                </li>
              </ul>
            </nav>

            <nav className="mt-5" aria-label="Profile">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Profile
              </p>
              <ul className="space-y-0.5">
                <li>
                  <button
                    type="button"
                    onClick={() => goToView("profile")}
                    className={navLinkClass(activeView === "profile")}
                  >
                    <PROFILE_NAV.icon className="h-4 w-4 shrink-0" />
                    {PROFILE_NAV.label}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        ) : (
          <div className="flex-1 px-2 py-3">
            <Link href="/dashboard#workspace" className={navLinkClass(false)}>
              ← Back to dashboard
            </Link>
          </div>
        )}

        <div className="border-t border-[var(--color-border)]/60 px-2 py-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Account
          </p>
          <ul className="space-y-0.5">
            <li>
              <Link href="/settings" className={navLinkClass(isSettings)}>
                <Settings className="h-4 w-4 shrink-0" />
                Settings
              </Link>
            </li>
            {username ? (
              <li>
                <button
                  type="button"
                  onClick={() => void handleCopyProfile()}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
                >
                  <Link2 className="h-4 w-4 shrink-0" />
                  {copied ? "Copied!" : "Copy profile URL"}
                </button>
              </li>
            ) : null}
            <li>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Log out
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {isDashboard ? (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--color-border)] bg-[var(--color-card)]/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
          aria-label="Dashboard navigation"
        >
          {MOBILE_NAV.map(({ id, label, icon: Icon, href }) => {
            const isActive = id !== "settings" && activeView === id;
            if (id === "settings") {
              return (
                <Link
                  key={id}
                  href={href}
                  className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${isSettings ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"}`}
                >
                  <Icon className="h-4 w-4" />
                  Settings
                </Link>
              );
            }
            return (
              <button
                key={id}
                type="button"
                onClick={() => goToView(id)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                  isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {id === "profile" ? "Profile" : label}
              </button>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}

function PortalLayoutInner({
  children,
  displayName,
  username,
  completion,
}: PortalLayoutProps) {
  const pathname = usePathname();
  const viewCtx = useDashboardViewOptional();

  const isSettings = pathname === "/settings";
  const isDashboard = pathname === "/dashboard";
  const activeView = viewCtx?.view ?? "workspace";

  const headerLabel = isSettings
    ? "Account & profile settings"
    : DASHBOARD_SECTIONS.find((s) => s.id === activeView)?.label ?? "Workspace";

  return (
    <div className="relative min-h-screen text-[var(--color-text)]">
      <div className="landing-mesh" aria-hidden>
        <div className="landing-mesh-blob" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <PortalSidebarNav
          displayName={displayName}
          username={username}
          completion={completion}
        />

        <div className="flex min-w-0 flex-1 flex-col pb-14 md:pb-0">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--color-border)]/60 px-4 md:px-5">
            <div className="flex items-center gap-2 md:hidden">
              <MetoMark className="h-5 w-5" />
              <span className="text-sm font-normal text-[var(--color-muted)]">
                {isSettings ? "Settings" : headerLabel}
              </span>
            </div>
            <p className="hidden text-sm font-normal text-[var(--color-muted)] md:block">
              {headerLabel}
            </p>
            <div className="flex items-center gap-2">
              {isDashboard && !isSettings ? (
                <button
                  type="button"
                  onClick={() => {
                    if (viewCtx) {
                      viewCtx.setView("workspace");
                    } else {
                      window.location.assign("/dashboard#workspace");
                    }
                  }}
                  title="Quick update"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                  aria-label="Quick update"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              ) : null}
              <ThemeToggle />
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export function PortalLayout(props: PortalLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (isDashboard) {
    return (
      <DashboardViewProvider>
        <PortalLayoutInner {...props} />
      </DashboardViewProvider>
    );
  }

  return <PortalLayoutInner {...props} />;
}
