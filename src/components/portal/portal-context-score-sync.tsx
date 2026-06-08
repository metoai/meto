"use client";

import { usePortalDataOptional } from "@/components/portal/portal-data-context";
import { useContextScore } from "@/hooks/use-context-score";

/** Runs gap analysis on login and whenever portal data refreshes after profile changes. */
export function PortalContextScoreSync() {
  const portal = usePortalDataOptional();
  useContextScore(portal?.dataVersion ?? 0, { autoAnalyze: true });
  return null;
}
