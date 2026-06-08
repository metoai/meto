"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BRAND_ORANGE = "#FF4D00";
const CHART_COLORS = ["#FF4D00", "#FF8A4C", "#FFB380", "#737373"];

type SignupPoint = { date: string; count: number };
type PlanPoint = { plan: string; count: number };
type BucketPoint = { bucket: string; count: number };
type AiPoint = { plan: string; calls: number };

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: { value: number; name?: string }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--landing-panel-border)] bg-[var(--landing-panel-base)] px-2.5 py-1.5 shadow-[var(--shadow-sm)]">
      {label ? (
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
          {label}
        </p>
      ) : null}
      <p className="mt-0.5 font-mono-brand text-[13px] font-semibold tabular-nums text-[var(--text)]">
        {payload[0].value}
        {suffix}
      </p>
    </div>
  );
}

function formatShortDate(date: string) {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function SignupsChart({ data }: { data: SignupPoint[] }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        label: formatShortDate(d.date),
      })),
    [data],
  );

  return (
    <div className="landing-panel p-4 sm:p-5">
      <p className="landing-panel-label">Signups — last 30 days</p>
      <div className="mt-4 h-[200px] w-full sm:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND_ORANGE} stopOpacity={0.2} />
                <stop offset="100%" stopColor={BRAND_ORANGE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={BRAND_ORANGE}
              strokeWidth={2}
              fill="url(#signupFill)"
              dot={false}
              activeDot={{ r: 4, fill: BRAND_ORANGE, stroke: "var(--card)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PlanDistributionChart({ data }: { data: PlanPoint[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="landing-panel p-4 sm:p-5">
      <p className="landing-panel-label">Plan distribution</p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="h-[180px] w-full max-w-[200px] sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="plan"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                stroke="var(--card)"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex w-full flex-1 flex-wrap gap-3 sm:flex-col sm:gap-2">
          {data.map((d, i) => (
            <li key={d.plan} className="flex min-w-[120px] items-center gap-2 text-[13px]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="capitalize text-[var(--text-secondary)]">{d.plan}</span>
              <span className="ml-auto font-mono-brand tabular-nums text-[var(--text)]">
                {d.count}
                <span className="ml-1 text-[11px] text-[var(--muted)]">
                  ({total > 0 ? Math.round((d.count / total) * 100) : 0}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ScoreDistributionChart({ data }: { data: BucketPoint[] }) {
  return (
    <div className="landing-panel p-4 sm:p-5">
      <p className="landing-panel-label">Context score distribution</p>
      <div className="mt-4 h-[200px] w-full sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="bucket"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[Math.min(i, CHART_COLORS.length - 1)]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AiUsageChart({ data }: { data: AiPoint[] }) {
  return (
    <div className="landing-panel p-4 sm:p-5">
      <p className="landing-panel-label">AI calls by plan</p>
      <div className="mt-4 h-[200px] w-full sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="plan"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip suffix=" calls" />} />
            <Bar dataKey="calls" fill={BRAND_ORANGE} radius={[6, 6, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
