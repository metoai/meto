"use client";

import { useEffect, useState } from "react";
import { PortalLayout } from "@/components/portal/portal-layout";
import { PortalSettingsPanel } from "@/components/portal/portal-settings-panel";
import type { UserProfile } from "@/lib/types";

export function SettingsClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile ?? null))
      .catch(() => {});
  }, []);

  const displayName =
    profile?.display_name?.trim() || profile?.username || "there";

  return (
    <PortalLayout displayName={displayName} username={profile?.username}>
      <PortalSettingsPanel />
    </PortalLayout>
  );
}
