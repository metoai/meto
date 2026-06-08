"use client";

import { PortalDataProvider } from "@/components/portal/portal-data-context";
import { PortalContextScoreSync } from "@/components/portal/portal-context-score-sync";
import { PostHogIdentify } from "@/components/posthog-identify";
import { PortalShell } from "@/components/portal/portal-layout";
import type { PortalBootstrapData } from "@/lib/portal-bootstrap";

export function PortalGroupLayoutClient({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: PortalBootstrapData;
}) {
  return (
    <PortalDataProvider initialData={initialData}>
      <PostHogIdentify
        email={initialData.email}
        username={initialData.profile?.username}
        plan={initialData.profile?.plan ?? initialData.entitlements?.plan}
      />
      <PortalContextScoreSync />
      <PortalShell>{children}</PortalShell>
    </PortalDataProvider>
  );
}
