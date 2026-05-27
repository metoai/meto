"use client";

import { useCallback, useEffect, useState } from "react";
import { SuccessToast } from "@/components/dashboard-shell";
import { DashboardEditor } from "@/components/dashboard/dashboard-editor";
import { ProfileHeaderCard } from "@/components/dashboard/profile-header-card";
import { WorkspaceCard } from "@/components/dashboard/workspace-card";
import { useDashboardView } from "@/components/portal/dashboard-view-context";
import { PortalLayout } from "@/components/portal/portal-layout";
import { isWorkspaceView } from "@/components/portal/portal-nav";
import { getProfileCompletion } from "@/lib/profile-utils";
import type { ContextSection, UserProfile } from "@/lib/types";

function DashboardMain({
  profile,
  onProfileSaved,
  editorKey,
  onProfileUpdated,
}: {
  profile: UserProfile | null;
  onProfileSaved: (p: UserProfile) => void;
  editorKey: number;
  onProfileUpdated: () => void;
}) {
  const { view: activeView } = useDashboardView();
  const showWorkspace = isWorkspaceView(activeView);

  return (
    <>
      <SuccessToast />

      <div className="min-h-0 w-full flex-1 overflow-y-auto p-4 md:p-5">
        {showWorkspace ? (
          <WorkspaceCard
            editorKey={editorKey}
            onApplied={onProfileUpdated}
          />
        ) : (
          <div className="w-full space-y-4">
            <ProfileHeaderCard profile={profile} onSaved={onProfileSaved} />
            <DashboardEditor
              key={`profile-${editorKey}`}
              panel="profile"
              embedded
            />
          </div>
        )}
      </div>
    </>
  );
}

export function DashboardClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sections, setSections] = useState<ContextSection[]>([]);
  const [editorKey, setEditorKey] = useState(0);

  const loadProfileData = useCallback(async () => {
    try {
      const [profileRes, sectionsRes] = await Promise.all([
        fetch("/api/profile/me"),
        fetch("/api/profile/sections"),
      ]);
      const profileData = await profileRes.json();
      const sectionsData = await sectionsRes.json();
      setProfile(profileData.profile ?? null);
      setSections(sectionsData.sections ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadProfileData();
  }, [loadProfileData]);

  const displayName =
    profile?.display_name?.trim() || profile?.username || "there";
  const completion = getProfileCompletion(sections);

  function handleProfileUpdated() {
    setEditorKey((k) => k + 1);
    void loadProfileData();
  }

  return (
    <PortalLayout
      displayName={displayName}
      username={profile?.username}
      completion={completion}
    >
      <DashboardMain
        profile={profile}
        onProfileSaved={setProfile}
        editorKey={editorKey}
        onProfileUpdated={handleProfileUpdated}
      />
    </PortalLayout>
  );
}
