"use client";

import { useEffect, useState } from "react";

/** Cycles through status labels while a long-running task is in progress. */
export function useProgressiveStatus(labels: string[], intervalMs = 2400) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [labels]);

  useEffect(() => {
    if (labels.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % labels.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [labels, intervalMs]);

  return labels[index] ?? labels[0] ?? "";
}
