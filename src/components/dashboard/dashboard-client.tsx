"use client";

import { useEffect, useState } from "react";
import { SuccessToast } from "@/components/dashboard-shell";
import { DashboardEditor } from "@/components/dashboard/dashboard-editor";
import { DashboardLayout } from "@/components/dashboard/sidebar";
import { UsernameBanner } from "@/components/dashboard/username-banner";
import type { UserProfile } from "@/lib/types";

export function DashboardClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile ?? null))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <SuccessToast />
      <UsernameBanner profile={profile} onSaved={setProfile} />
      <DashboardEditor />
    </DashboardLayout>
  );
}
