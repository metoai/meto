"use client";

import { PortalSettingsPanel } from "@/components/portal/portal-settings-panel";

export function SettingsPageClient() {
  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto p-4 md:p-5">
      <PortalSettingsPanel />
    </div>
  );
}
