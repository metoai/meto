"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getSparklineData } from "@/lib/score-history";
import { scoreColor } from "@/hooks/use-context-score";

type ScoreSparklineProps = {
  currentScore: number;
  width?: number | string;
  height?: number;
  className?: string;
};

export function ScoreSparkline({
  currentScore,
  width = "100%",
  height = 48,
  className = "",
}: ScoreSparklineProps) {
  const values = getSparklineData(currentScore);
  const data = values.map((score, index) => ({ index, score }));
  const color = scoreColor(currentScore);
  const fillId = `sparkFill-${currentScore}`;

  return (
    <div
      className={className}
      style={{ width: typeof width === "number" ? width : undefined, height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip content={() => null} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${fillId})`}
            dot={(props) => {
              const { cx, cy, index } = props as {
                cx: number;
                cy: number;
                index: number;
              };
              const isLast = index === data.length - 1;
              if (!isLast) return <circle key={index} r={0} />;
              return (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
