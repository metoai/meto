"use client";

import { PortalDataProvider } from "@/components/portal/portal-data-context";
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
      <PortalShell>{children}</PortalShell>
    </PortalDataProvider>
  );
}
