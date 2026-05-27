"use client";

import { useEffect, useState } from "react";

export function SuccessToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ready") === "1") {
      setVisible(true);
      window.history.replaceState({}, "", "/dashboard");
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-brand-md border border-brand-primary/30 bg-brand-card px-5 py-3 text-sm text-brand-text shadow-lg">
      Your AI identity is ready ✓
    </div>
  );
}
