"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { scoreColor } from "@/hooks/use-context-score";

export type SparklinePoint = {
  score: number;
  label: string;
};

type ScoreSparklineChartProps = {
  data: SparklinePoint[];
  currentScore: number;
  variant: "compact" | "hero";
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--landing-panel-border)] bg-[var(--landing-panel-base)] px-2.5 py-1.5 shadow-[var(--shadow-sm)]">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-0.5 font-mono-brand text-[13px] font-semibold tabular-nums text-[var(--text)]">
        {payload[0].value}%
      </p>
    </div>
  );
}

function chartDomain(data: SparklinePoint[]) {
  const values = data.map((point) => point.score);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max(6, Math.round((max - min) * 0.35));

  return [
    Math.max(0, min - padding),
    Math.min(100, max + Math.max(4, Math.round(padding * 0.5))),
  ] as [number, number];
}

export function ScoreSparklineChart({
  data,
  currentScore,
  variant,
}: ScoreSparklineChartProps) {
  if (!data.length) {
    return <div className="h-full w-full" />;
  }

  const color = scoreColor(currentScore);
  const fillId = `sparkFill-${currentScore}-${variant}`;
  const isHero = variant === "hero";
  const domain = useMemo(() => chartDomain(data), [data]);

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <AreaChart
        data={data}
        margin={
          isHero
            ? { top: 6, right: 4, left: 0, bottom: 0 }
            : { top: 4, right: 4, left: 0, bottom: 0 }
        }
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={isHero ? 0.22 : 0.18} />
            <stop offset="45%" stopColor={color} stopOpacity={isHero ? 0.1 : 0.07} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {isHero ? (
          <>
            <YAxis domain={domain} hide />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--muted)",
                fontSize: 10,
                fontFamily: "var(--font-mono, ui-monospace, monospace)",
              }}
              dy={8}
              interval="preserveStartEnd"
            />
            <Tooltip content={<ChartTooltip />} cursor={false} />
          </>
        ) : (
          <Tooltip content={() => null} />
        )}
        <Area
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={isHero ? 2 : 1.75}
          fill={`url(#${fillId})`}
          dot={(props) => {
            const { cx, cy, index } = props as {
              cx: number;
              cy: number;
              index: number;
            };
            const isLast = index === data.length - 1;
            if (!isLast) return <circle key={index} r={0} />;
            if (isHero) {
              return (
                <g key={index}>
                  <circle cx={cx} cy={cy} r={12} fill={color} fillOpacity={0.1} />
                  <circle cx={cx} cy={cy} r={7} fill={color} fillOpacity={0.18} />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill={color}
                    stroke="var(--landing-panel-base)"
                    strokeWidth={2}
                  />
                </g>
              );
            }
            return (
              <circle
                key={index}
                cx={cx}
                cy={cy}
                r={3.5}
                fill={color}
                stroke="var(--landing-panel-base)"
                strokeWidth={2}
              />
            );
          }}
          activeDot={
            isHero
              ? {
                  r: 4.5,
                  fill: color,
                  stroke: "var(--landing-panel-base)",
                  strokeWidth: 2,
                }
              : false
          }
          isAnimationActive
          animationDuration={700}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
