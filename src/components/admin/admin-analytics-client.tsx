"use client";

import { useEffect, useState } from "react";
import {
  AiUsageChart,
  PlanDistributionChart,
  ScoreDistributionChart,
  SignupsChart,
} from "@/components/admin/admin-charts";
import {
  AdminPageHeader,
  AdminPageShell,
  EmptyState,
  StatCard,
} from "@/components/admin/admin-ui";
import type { AdminStats } from "@/lib/admin-queries";

export function AdminAnalyticsClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json() as Promise<AdminStats>;
      })
      .then(setStats)
      .catch(() => setError("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminPageShell>
        <AdminPageHeader title="Analytics" subtitle="Growth, engagement, and quality metrics." />
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="landing-panel h-[280px] animate-pulse bg-[var(--surface)]" />
          ))}
        </div>
      </AdminPageShell>
    );
  }

  if (error || !stats) {
    return (
      <AdminPageShell>
        <EmptyState title={error ?? "No data"} />
      </AdminPageShell>
    );
  }

  const signupTotal = stats.signupsByDay.reduce((s, d) => s + d.count, 0);
  const scoredUsers = stats.scoreDistribution.reduce((s, d) => s + d.count, 0);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Analytics"
        subtitle="Deep dive into growth, AI usage, and profile quality."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="30-day signups"
          value={signupTotal}
          hint="New accounts this month"
        />
        <StatCard
          label="Onboarding rate"
          value={
            stats.totalUsers > 0
              ? `${Math.round((stats.onboardingCompleted / stats.totalUsers) * 100)}%`
              : "0%"
          }
          hint={`${stats.onboardingCompleted} used onboarding AI`}
        />
        <StatCard
          label="Profile completion"
          value={
            stats.totalUsers > 0
              ? `${Math.round((stats.usersWithSections / stats.totalUsers) * 100)}%`
              : "0%"
          }
          hint={`${stats.usersWithSections} with sections`}
        />
        <StatCard
          label="Scored profiles"
          value={scoredUsers}
          hint={`Avg score ${stats.avgContextScore}%`}
        />
      </div>

      <div className="mt-6 grid gap-4">
        <SignupsChart data={stats.signupsByDay} />
        <div className="grid gap-4 lg:grid-cols-2">
          <PlanDistributionChart
            data={[
              { plan: "trial", count: stats.planCounts.trial },
              { plan: "free", count: stats.planCounts.free },
              { plan: "pro", count: stats.planCounts.pro },
            ]}
          />
          <AiUsageChart data={stats.aiUsageByPlan} />
        </div>
        <ScoreDistributionChart data={stats.scoreDistribution} />
      </div>
    </AdminPageShell>
  );
}
