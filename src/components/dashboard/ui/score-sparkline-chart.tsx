"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
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
}: {
  active?: boolean;
  payload?: { value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-2.5 py-1.5 text-[11px] shadow-sm">
      <span className="font-medium tabular-nums text-[var(--text)]">
        {payload[0].value}%
      </span>
    </div>
  );
}

export function ScoreSparklineChart({
  data,
  currentScore,
  variant,
}: ScoreSparklineChartProps) {
  const color = scoreColor(currentScore);
  const fillId = `sparkFill-${currentScore}-${variant}`;
  const isHero = variant === "hero";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={
          isHero
            ? { top: 8, right: 8, left: 0, bottom: 0 }
            : { top: 4, right: 4, left: 0, bottom: 0 }
        }
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={isHero ? 0.28 : 0.2} />
            <stop offset="55%" stopColor={color} stopOpacity={isHero ? 0.08 : 0.05} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {isHero ? (
          <>
            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="4 6"
              vertical={false}
            />
            <YAxis domain={[0, 100]} hide />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              dy={6}
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
          strokeWidth={isHero ? 2.5 : 2}
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
                  <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.12} />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={color}
                    stroke="var(--card)"
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
                r={4}
                fill={color}
                stroke="var(--card)"
                strokeWidth={2}
              />
            );
          }}
          activeDot={
            isHero
              ? { r: 6, fill: color, stroke: "var(--card)", strokeWidth: 2 }
              : false
          }
          isAnimationActive
          animationDuration={800}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
