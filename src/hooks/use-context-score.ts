"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePortalDataOptional } from "@/components/portal/portal-data-context";
import type { ContextScoreResult } from "@/lib/context-score";
import {
  clearCelebratePending,
  clearFixedSectionsForScore,
  readCelebratePending,
  readFixedSectionsForScore,
} from "@/lib/context-score-actions";
import { recordScore } from "@/lib/score-history";

export function scoreColor(score: number) {
  if (score >= 60) return "var(--primary)";
  if (score >= 30) return "#B45309";
  return "#DC2626";
}

type UseContextScoreOptions = {
  /** When true, runs LLM analysis if cache is stale. Default false for fast page loads. */
  autoAnalyze?: boolean;
};

export function useContextScore(
  dataVersion = 0,
  options: UseContextScoreOptions = {}
) {
  const { autoAnalyze = false } = options;
  const portal = usePortalDataOptional();
  const [score, setScore] = useState<ContextScoreResult | null>(
    portal?.contextScore ?? null
  );
  const [loading, setLoading] = useState(!portal?.contextScore);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [scoreDelta, setScoreDelta] = useState(0);
  const previousScoreRef = useRef<number | null>(null);
  const loadInFlightRef = useRef(false);
  const lastLoadedVersionRef = useRef(-1);
  const scoreRef = useRef<ContextScoreResult | null>(null);
  scoreRef.current = score;

  useEffect(() => {
    if (portal?.contextScore && dataVersion === lastLoadedVersionRef.current) {
      return;
    }
    if (portal?.contextScore) {
      setScore(portal.contextScore);
      setLoading(false);
      lastLoadedVersionRef.current = dataVersion;
    }
  }, [portal?.contextScore, dataVersion]);

  const maybeCelebrate = useCallback((nextScore: number) => {
    const previous = previousScoreRef.current;
    if (previous !== null && nextScore > previous) {
      setScoreDelta(nextScore - previous);
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 7000);
    }
    previousScoreRef.current = nextScore;
    recordScore(nextScore);
  }, []);

  const syncIssueCount = useCallback(
    (next: ContextScoreResult | null) => {
      portal?.setIssueCount(next?.gaps?.length ?? 0);
      if (next) portal?.setContextScore(next);
    },
    [portal]
  );

  const runAnalyze = useCallback(
    async (forceCelebrate: boolean, stale: boolean) => {
      const postRes = await fetch("/api/profile/context-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          force: forceCelebrate || stale || !scoreRef.current,
          fixedSections: forceCelebrate ? readFixedSectionsForScore() : [],
        }),
      });
      const postData = await postRes.json();
      if (!postRes.ok) {
        throw new Error(postData.error ?? "Failed to analyze profile.");
      }
      const next = postData.score ?? null;
      setScore(next);
      syncIssueCount(next);
      if (next) {
        maybeCelebrate(next.score);
        clearCelebratePending();
        clearFixedSectionsForScore();
      }
    },
    [maybeCelebrate, syncIssueCount]
  );

  const loadScore = useCallback(async () => {
    if (loadInFlightRef.current) return;

    const forceCelebrate = readCelebratePending();
    const portalScore = portal?.contextScore ?? null;

    if (
      portalScore &&
      !forceCelebrate &&
      !autoAnalyze &&
      lastLoadedVersionRef.current !== dataVersion
    ) {
      setScore(portalScore);
      syncIssueCount(portalScore);
      lastLoadedVersionRef.current = dataVersion;
      setLoading(false);
      return;
    }

    if (
      portalScore &&
      !forceCelebrate &&
      !autoAnalyze &&
      lastLoadedVersionRef.current === dataVersion
    ) {
      setLoading(false);
      return;
    }

    loadInFlightRef.current = true;
    setError(null);

    const isInitial = scoreRef.current === null;
    if (isInitial) setLoading(true);

    try {
      const getRes = await fetch("/api/profile/context-score");
      const getData = await getRes.json();

      if (!getRes.ok) {
        throw new Error(getData.error ?? "Failed to load context score.");
      }

      if (getData.score) {
        setScore(getData.score);
        syncIssueCount(getData.score);
        lastLoadedVersionRef.current = dataVersion;

        const shouldAnalyze =
          forceCelebrate ||
          (autoAnalyze && (!getData.cached || Boolean(getData.stale)));

        if (!shouldAnalyze) {
          return;
        }

        setAnalyzing(true);
        await runAnalyze(forceCelebrate, Boolean(getData.stale));
        return;
      }

      if (autoAnalyze || forceCelebrate) {
        setAnalyzing(true);
        await runAnalyze(forceCelebrate, true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load context score."
      );
    } finally {
      loadInFlightRef.current = false;
      setLoading(false);
      setAnalyzing(false);
    }
  }, [autoAnalyze, dataVersion, portal?.contextScore, runAnalyze, syncIssueCount]);

  useEffect(() => {
    void loadScore();
  }, [dataVersion, loadScore]);

  const reload = useCallback(async () => {
    setAnalyzing(true);
    setError(null);
    try {
      await runAnalyze(readCelebratePending(), true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze profile."
      );
    } finally {
      setAnalyzing(false);
    }
  }, [runAnalyze]);

  return {
    score,
    loading,
    analyzing,
    error,
    celebrating,
    scoreDelta,
    reload,
    stale: portal?.contextScoreStale ?? false,
  };
}
