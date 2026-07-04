"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SuccessToast } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/dashboard/ui/dashboard-card";
import { DashboardEditor } from "@/components/dashboard/dashboard-editor";
import { MemoryEditorPanel } from "@/components/knowledge/memory-editor-panel";
import { ProfilePageHero } from "@/components/dashboard/profile-page-hero";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { usePortalData } from "@/components/portal/portal-data-context";
import {
  DEV_PROFILE_SECTION_TYPES,
  isDeveloperWorkspace,
} from "@/lib/workspace-mode";

export function ProfilePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completion, sections, profile, setProfile } = usePortalData();
  const initialSectionType = searchParams.get("section");
  const fromContextScore = searchParams.get("from") === "context-score";
  const isDev = isDeveloperWorkspace(profile);

  return (
    <>
      <SuccessToast />
      <PortalPageShell>
        <PageHeader
          title={isDev ? "Dev context" : "Your profile"}
          subtitle={
            isDev
              ? "Stack, projects, and MCP rules — not your personal bio."
              : "Living sections that teach AI who you are."
          }
        />

        {isDev ? (
          <div className="landing-panel mb-5 px-4 py-3.5">
            <p className="landing-panel-label">MCP handoff</p>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
              Cursor and Claude read these sections via MCP. Connect tools in{" "}
              <Link
                href="/dashboard/workspace"
                className="font-medium text-[var(--primary)] hover:underline"
              >
                MCP setup
              </Link>
              . Per-repo context lives in{" "}
              <Link
                href="/dashboard/projects"
                className="font-medium text-[var(--primary)] hover:underline"
              >
                Projects
              </Link>
              .
            </p>
            {profile?.username ? (
              <p className="mt-2 text-xs text-[var(--muted)]">
                @{profile.username}
              </p>
            ) : null}
          </div>
        ) : (
          <ProfilePageHero
            sections={sections}
            username={profile?.username ?? null}
            completion={completion}
            onUsernameClaimed={(username) =>
              setProfile(
                profile
                  ? {
                      ...profile,
                      username,
                    }
                  : null
              )
            }
          />
        )}

        {fromContextScore && !isDev ? (
          <div className="landing-panel mb-4 border-[var(--accent-border)] bg-[var(--primary-light)] px-4 py-3">
            <p className="text-sm text-[var(--text)]">Edit this section manually</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Save your changes and we&apos;ll recalculate your context score.
            </p>
          </div>
        ) : null}

        <DashboardEditor
          panel="profile"
          embedded
          tieredLayout
          hideLiveBanner
          sectionTypesFilter={isDev ? DEV_PROFILE_SECTION_TYPES : null}
          initialSectionType={initialSectionType}
          onSectionSaved={
            fromContextScore
              ? () =>
                  router.push(
                    isDev ? "/dashboard/projects" : "/dashboard/fixes?celebrate=1"
                  )
              : undefined
          }
        />

        {!isDev ? (
          <details className="landing-panel mt-6 p-4">
            <summary className="cursor-pointer text-sm font-medium text-[var(--text)]">
              View underlying memories (V2)
            </summary>
            <div className="mt-4">
              <MemoryEditorPanel />
            </div>
          </details>
        ) : null}
      </PortalPageShell>
    </>
  );
}
