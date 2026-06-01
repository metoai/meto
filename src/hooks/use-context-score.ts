"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContextScoreResult } from "@/lib/context-score";
import {
  clearCelebratePending,
  clearFixedSectionsForScore,
  readCelebratePending,
  readFixedSectionsForScore,
} from "@/lib/context-score-actions";
import { recordScore } from "@/lib/score-history";

export function scoreColor(score: number) {
  if (score >= 60) return "#0F6E56";
  if (score >= 30) return "#B45309";
  return "#DC2626";
}

export function useContextScore(dataVersion = 0) {
  const [score, setScore] = useState<ContextScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [scoreDelta, setScoreDelta] = useState(0);
  const previousScoreRef = useRef<number | null>(null);
  const loadInFlightRef = useRef(false);
  const lastLoadedVersionRef = useRef(-1);
  const lastAnalyzeAtRef = useRef(0);
  const scoreRef = useRef<ContextScoreResult | null>(null);
  scoreRef.current = score;

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

  const loadScore = useCallback(async () => {
    if (loadInFlightRef.current) return;

    const forceCelebrate = readCelebratePending();
    const recentlyAnalyzed = Date.now() - lastAnalyzeAtRef.current < 4000;

    if (
      recentlyAnalyzed &&
      scoreRef.current &&
      !forceCelebrate &&
      lastLoadedVersionRef.current === dataVersion
    ) {
      return;
    }

    loadInFlightRef.current = true;
    setError(null);
    setAnalyzing(true);

    const isInitial = scoreRef.current === null;
    if (isInitial) setLoading(true);

    try {
      const getRes = await fetch("/api/profile/context-score");
      const getData = await getRes.json();

      if (!getRes.ok) {
        throw new Error(getData.error ?? "Failed to load context score.");
      }

      const shouldAnalyze =
        forceCelebrate ||
        !getData.score ||
        !getData.cached ||
        Boolean(getData.stale);

      if (!shouldAnalyze && getData.score) {
        setScore(getData.score);
        maybeCelebrate(getData.score.score);
        lastLoadedVersionRef.current = dataVersion;
        return;
      }

      const postRes = await fetch("/api/profile/context-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          force: forceCelebrate || Boolean(getData.stale) || !getData.score,
          fixedSections: forceCelebrate ? readFixedSectionsForScore() : [],
        }),
      });
      const postData = await postRes.json();

      if (!postRes.ok) {
        throw new Error(postData.error ?? "Failed to analyze profile.");
      }

      const next = postData.score ?? null;
      setScore(next);
      if (next) {
        maybeCelebrate(next.score);
        lastAnalyzeAtRef.current = Date.now();
        lastLoadedVersionRef.current = dataVersion;
        clearCelebratePending();
        clearFixedSectionsForScore();
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
  }, [dataVersion, maybeCelebrate]);

  useEffect(() => {
    void loadScore();
  }, [dataVersion, loadScore]);

  return {
    score,
    loading,
    analyzing,
    error,
    celebrating,
    scoreDelta,
    reload: loadScore,
  };
}
