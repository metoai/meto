"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type QuickUpdateSidebarContextValue = {
  onProfileUpdated: (() => void) | null;
  registerOnProfileUpdated: (handler: (() => void) | null) => void;
};

const QuickUpdateSidebarContext =
  createContext<QuickUpdateSidebarContextValue | null>(null);

export function QuickUpdateSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onProfileUpdated, setOnProfileUpdated] = useState<
    (() => void) | null
  >(null);

  const registerOnProfileUpdated = useCallback(
    (handler: (() => void) | null) => {
      setOnProfileUpdated(handler);
    },
    []
  );

  const value = useMemo(
    () => ({
      onProfileUpdated,
      registerOnProfileUpdated,
    }),
    [onProfileUpdated, registerOnProfileUpdated]
  );

  return (
    <QuickUpdateSidebarContext.Provider value={value}>
      {children}
    </QuickUpdateSidebarContext.Provider>
  );
}

export function useQuickUpdateSidebar() {
  const ctx = useContext(QuickUpdateSidebarContext);
  if (!ctx) {
    throw new Error(
      "useQuickUpdateSidebar must be used within QuickUpdateSidebarProvider"
    );
  }
  return ctx;
}

export function useQuickUpdateSidebarOptional() {
  return useContext(QuickUpdateSidebarContext);
}
