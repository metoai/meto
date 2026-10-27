"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
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
  const handlerRef = useRef<(() => void) | null>(null);

  const registerOnProfileUpdated = useCallback(
    (handler: (() => void) | null) => {
      handlerRef.current = handler;
    },
    []
  );

  const value = useMemo(
    () => ({
      get onProfileUpdated() {
        return handlerRef.current;
      },
      registerOnProfileUpdated,
    }),
    [registerOnProfileUpdated]
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
