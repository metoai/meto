"use client";

import { useCallback, useEffect, useState } from "react";
import type { Entitlements } from "@/lib/entitlements";
import { usePortalDataOptional } from "@/components/portal/portal-data-context";

export function useEntitlements() {
  const portal = usePortalDataOptional();
  const [entitlements, setEntitlements] = useState<Entitlements | null>(
    portal?.entitlements ?? null
  );
  const [loaded, setLoaded] = useState(Boolean(portal?.entitlementsLoaded));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/entitlements");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load entitlements.");
      }
      setEntitlements(data.entitlements ?? null);
      setLoaded(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (portal?.entitlements) {
      setEntitlements(portal.entitlements);
      setLoaded(portal.entitlementsLoaded);
      return;
    }
    void reload();
  }, [portal?.entitlements, portal?.entitlementsLoaded, reload]);

  return {
    entitlements,
    loaded,
    error,
    reload,
    isProAccess: entitlements?.isProAccess ?? false,
    canUseUpdateChat: entitlements?.canUseUpdateChat ?? false,
  };
}
