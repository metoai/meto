"use client";

import dynamic from "next/dynamic";
import { getSparklineData } from "@/lib/score-history";

const ScoreSparklineChart = dynamic(
  () =>
    import("./score-sparkline-chart").then((mod) => mod.ScoreSparklineChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-md bg-black/[0.04]" />
    ),
  }
);

const HISTORY_DAYS = 7;

type ScoreSparklineProps = {
  currentScore: number;
  width?: number | string;
  height?: number;
  className?: string;
  variant?: "compact" | "hero";
};

function chartPoints(currentScore: number) {
  const values = getSparklineData(currentScore);
  return values.map((score, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (HISTORY_DAYS - 1 - index));
    return {
      score,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });
}

export function ScoreSparkline({
  currentScore,
  width = "100%",
  height = 48,
  className = "",
  variant = "compact",
}: ScoreSparklineProps) {
  const data = chartPoints(currentScore);

  return (
    <div
      className={className}
      style={{ width: typeof width === "number" ? width : undefined, height }}
    >
      <ScoreSparklineChart
        data={data}
        currentScore={currentScore}
        variant={variant}
      />
    </div>
  );
}
