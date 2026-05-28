"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  refresh: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  setSections: (sections: ContextSection[]) => void;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");
  const [sections, setSections] = useState<ContextSection[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const [profileRes, sectionsRes] = await Promise.all([
        fetch("/api/profile/me"),
        fetch("/api/profile/sections"),
      ]);
      const profileData = await profileRes.json();
      const sectionsData = await sectionsRes.json();

      if (profileRes.ok) {
        setProfile(profileData.profile ?? null);
        setEmail(profileData.email ?? "");
      }

      if (sectionsRes.ok) {
        setSections(sectionsData.sections ?? []);
      }

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
      refresh,
      setProfile,
      setSections,
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
