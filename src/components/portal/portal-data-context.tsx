"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ContextScoreResult } from "@/lib/context-score";
import type { Entitlements } from "@/lib/entitlements";
import type { PortalBootstrapData } from "@/lib/portal-bootstrap";
import { getProfileCompletion } from "@/lib/profile-utils";
import type { ContextSection, UserProfile } from "@/lib/types";

type PortalDataContextValue = {
  profile: UserProfile | null;
  email: string;
  sections: ContextSection[];
  completion: number;
  displayName: string;
  loaded: boolean;
  loading: boolean;
  dataVersion: number;
  entitlements: Entitlements | null;
  entitlementsLoaded: boolean;
  issueCount: number;
  contextScore: ContextScoreResult | null;
  contextScoreStale: boolean;
  refresh: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  setSections: (sections: ContextSection[]) => void;
  setContextScore: (score: ContextScoreResult | null) => void;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

function applyBootstrapState(
  data: PortalBootstrapData,
  setters: {
    setProfile: (profile: UserProfile | null) => void;
    setEmail: (email: string) => void;
    setSections: (sections: ContextSection[]) => void;
    setEntitlements: (entitlements: Entitlements | null) => void;
    setContextScore: (score: ContextScoreResult | null) => void;
    setContextScoreStale: (stale: boolean) => void;
  }
) {
  setters.setProfile(data.profile ?? null);
  setters.setEmail(data.email ?? "");
  setters.setSections(data.sections ?? []);
  setters.setEntitlements(data.entitlements ?? null);
  setters.setContextScore(data.contextScore ?? null);
  setters.setContextScoreStale(Boolean(data.contextScoreStale));
}

export function PortalDataProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: PortalBootstrapData;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(
    initialData?.profile ?? null
  );
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [sections, setSections] = useState<ContextSection[]>(
    initialData?.sections ?? []
  );
  const [loaded, setLoaded] = useState(Boolean(initialData));
  const [loading, setLoading] = useState(!initialData);
  const [dataVersion, setDataVersion] = useState(0);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(
    initialData?.entitlements ?? null
  );
  const [entitlementsLoaded, setEntitlementsLoaded] = useState(
    Boolean(initialData)
  );
  const [contextScore, setContextScore] = useState<ContextScoreResult | null>(
    initialData?.contextScore ?? null
  );
  const [contextScoreStale, setContextScoreStale] = useState(
    Boolean(initialData?.contextScoreStale)
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/bootstrap");
      const data = (await res.json()) as PortalBootstrapData & {
        error?: string;
      };

      if (res.ok) {
        applyBootstrapState(data, {
          setProfile,
          setEmail,
          setSections,
          setEntitlements,
          setContextScore,
          setContextScoreStale,
        });
      }

      setEntitlementsLoaded(true);
      setDataVersion((version) => version + 1);
      setLoaded(true);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialData) return;
    void refresh();
  }, [initialData, refresh]);

  const displayName =
    profile?.display_name?.trim() || profile?.username || "there";
  const completion = getProfileCompletion(sections);
  const issueCount = contextScore?.gaps.length ?? 0;

  const value = useMemo(
    () => ({
      profile,
      email,
      sections,
      completion,
      displayName,
      loaded,
      loading,
      dataVersion,
      entitlements,
      entitlementsLoaded,
      issueCount,
      contextScore,
      contextScoreStale,
      refresh,
      setProfile,
      setSections,
      setContextScore,
    }),
    [
      profile,
      email,
      sections,
      completion,
      displayName,
      loaded,
      loading,
      dataVersion,
      entitlements,
      entitlementsLoaded,
      issueCount,
      contextScore,
      contextScoreStale,
      refresh,
    ]
  );

  return (
    <PortalDataContext.Provider value={value}>
      {children}
    </PortalDataContext.Provider>
  );
}

export function usePortalData() {
  const ctx = useContext(PortalDataContext);
  if (!ctx) {
    throw new Error("usePortalData must be used within PortalDataProvider");
  }
  return ctx;
}

export function usePortalDataOptional() {
  return useContext(PortalDataContext);
}
