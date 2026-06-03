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
  setIssueCount: (count: number) => void;
  setContextScore: (score: ContextScoreResult | null) => void;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");
  const [sections, setSections] = useState<ContextSection[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [entitlementsLoaded, setEntitlementsLoaded] = useState(false);
  const [issueCount, setIssueCount] = useState(0);
  const [contextScore, setContextScore] = useState<ContextScoreResult | null>(
    null
  );
  const [contextScoreStale, setContextScoreStale] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/bootstrap");
      const data = await res.json();

      if (res.ok) {
        setProfile(data.profile ?? null);
        setEmail(data.email ?? "");
        setSections(data.sections ?? []);
        setEntitlements(data.entitlements ?? null);
        setIssueCount(data.issueCount ?? 0);
        setContextScore(data.contextScore ?? null);
        setContextScoreStale(Boolean(data.contextScoreStale));
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
    void refresh();
  }, [refresh]);

  const displayName =
    profile?.display_name?.trim() || profile?.username || "there";
  const completion = getProfileCompletion(sections);

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
      setIssueCount,
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
