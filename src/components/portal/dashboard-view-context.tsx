"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  normalizeDashboardView,
  type DashboardViewId,
} from "@/components/portal/portal-nav";

type DashboardViewContextValue = {
  view: DashboardViewId;
  setView: (view: DashboardViewId) => void;
};

const DashboardViewContext = createContext<DashboardViewContextValue | null>(
  null
);

function readViewFromHash(): DashboardViewId {
  if (typeof window === "undefined") return "workspace";
  return normalizeDashboardView(window.location.hash.replace("#", ""));
}

function writeHash(view: DashboardViewId) {
  const url = `${window.location.pathname}#${view}`;
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function DashboardViewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [view, setViewState] = useState<DashboardViewId>("workspace");

  useEffect(() => {
    function sync() {
      setViewState(readViewFromHash());
    }
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const setView = useCallback((next: DashboardViewId) => {
    setViewState(next);
    if (window.location.pathname === "/dashboard") {
      writeHash(next);
    }
  }, []);

  return (
    <DashboardViewContext.Provider value={{ view, setView }}>
      {children}
    </DashboardViewContext.Provider>
  );
}

export function useDashboardView() {
  const ctx = useContext(DashboardViewContext);
  if (!ctx) {
    throw new Error("useDashboardView must be used within DashboardViewProvider");
  }
  return ctx;
}

export function useDashboardViewOptional() {
  return useContext(DashboardViewContext);
}
