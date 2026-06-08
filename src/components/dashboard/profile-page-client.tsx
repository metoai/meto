"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SuccessToast } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/dashboard/ui/dashboard-card";
import { DashboardEditor } from "@/components/dashboard/dashboard-editor";
import { ProfilePageHero } from "@/components/dashboard/profile-page-hero";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { usePortalData } from "@/components/portal/portal-data-context";

export function ProfilePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completion, sections, profile, setProfile } = usePortalData();
  const initialSectionType = searchParams.get("section");
  const fromContextScore = searchParams.get("from") === "context-score";

  return (
    <>
      <SuccessToast />
      <PortalPageShell>
        <PageHeader
          title="Your profile"
          subtitle="Living sections that teach AI who you are."
        />

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

        {fromContextScore ? (
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
          initialSectionType={initialSectionType}
          onSectionSaved={
            fromContextScore
              ? () => router.push("/dashboard/fixes?celebrate=1")
              : undefined
          }
        />
      </PortalPageShell>
    </>
  );
}
