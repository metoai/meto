"use client";

import { useEffect, useState } from "react";

export function SuccessToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ready") === "1") {
      setVisible(true);
      window.history.replaceState({}, "", "/dashboard/workspace");
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-card)] px-5 py-3 text-sm text-[var(--color-text)] shadow-lg md:bottom-6">
      Your AI identity is ready ✓
    </div>
  );
}
