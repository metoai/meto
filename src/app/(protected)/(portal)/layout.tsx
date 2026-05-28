"use client";

import { PortalDataProvider } from "@/components/portal/portal-data-context";
import { PortalShell } from "@/components/portal/portal-layout";

export default function PortalGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalDataProvider>
      <PortalShell>{children}</PortalShell>
    </PortalDataProvider>
  );
}
