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
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  EmptyState,
  formatRelativeDate,
  PlanBadge,
  StatCard,
  UserLink,
} from "@/components/admin/admin-ui";
import type { AdminStats } from "@/lib/admin-queries";

export function AdminOverviewClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json() as Promise<AdminStats>;
      })
      .then(setStats)
      .catch(() => setError("Could not load admin stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminPageShell>
        <AdminPageHeader title="Overview" subtitle="Platform health at a glance." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="landing-panel h-[108px] animate-pulse bg-[var(--surface)]" />
          ))}
        </div>
      </AdminPageShell>
    );
  }

  if (error || !stats) {
    return (
      <AdminPageShell>
        <EmptyState title={error ?? "No data"} description="Try refreshing the page." />
      </AdminPageShell>
    );
  }

  const completionRate =
    stats.totalUsers > 0
      ? Math.round((stats.usersWithSections / stats.totalUsers) * 100)
      : 0;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Overview"
        subtitle="Users, billing, AI usage, and context quality across Meto."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.totalUsers} />
        <StatCard
          label="Pro subscribers"
          value={stats.proSubscribers}
          hint={`${stats.planCounts.pro} on pro plan`}
        />
        <StatCard
          label="Active trials"
          value={stats.activeTrials}
          hint={
            stats.trialsExpiringSoon > 0
              ? `${stats.trialsExpiringSoon} expiring in 3 days`
              : undefined
          }
          trend={stats.trialsExpiringSoon > 0 ? "Trials need attention" : undefined}
        />
        <StatCard
          label="Total AI calls"
          value={stats.totalAiCalls.toLocaleString()}
          hint="Across all users this period"
        />
        <StatCard label="Context sections" value={stats.totalSections} />
        <StatCard
          label="Avg context score"
          value={`${stats.avgContextScore}%`}
          hint="Across scored profiles"
        />
        <StatCard
          label="Profiles with sections"
          value={stats.usersWithSections}
          hint={`${completionRate}% completion rate`}
        />
        <StatCard
          label="Onboarding AI used"
          value={stats.onboardingCompleted}
          hint="Brain dump or chat"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SignupsChart data={stats.signupsByDay} />
        <PlanDistributionChart
          data={[
            { plan: "trial", count: stats.planCounts.trial },
            { plan: "free", count: stats.planCounts.free },
            { plan: "pro", count: stats.planCounts.pro },
          ]}
        />
        <ScoreDistributionChart data={stats.scoreDistribution} />
        <AiUsageChart data={stats.aiUsageByPlan} />
      </div>

      <div className="mt-6">
        <p className="landing-panel-label mb-3">Recent signups</p>
        {stats.recentSignups.length === 0 ? (
          <EmptyState title="No users yet" />
        ) : (
          <AdminTable>
            <table className="w-full min-w-[640px]">
              <AdminTableHead>
                <AdminTh>User</AdminTh>
                <AdminTh>Plan</AdminTh>
                <AdminTh>Score</AdminTh>
                <AdminTh>Sections</AdminTh>
                <AdminTh>AI usage</AdminTh>
                <AdminTh>Joined</AdminTh>
              </AdminTableHead>
              <tbody>
                {stats.recentSignups.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--border-subtle)] last:border-0 transition-colors hover:bg-[var(--surface)]/40"
                  >
                    <AdminTd>
                      <UserLink
                        id={user.id}
                        username={user.username}
                        displayName={user.display_name}
                        email={user.email}
                      />
                    </AdminTd>
                    <AdminTd>
                      <PlanBadge plan={user.plan} />
                    </AdminTd>
                    <AdminTd>
                      <span className="font-mono-brand tabular-nums text-[var(--text)]">
                        {user.context_score !== null ? `${user.context_score}%` : "—"}
                      </span>
                    </AdminTd>
                    <AdminTd>{user.section_count}</AdminTd>
                    <AdminTd>
                      <span className="font-mono-brand tabular-nums">
                        {user.ai_calls_used}/{user.ai_usage_limit}
                      </span>
                    </AdminTd>
                    <AdminTd>{formatRelativeDate(user.created_at)}</AdminTd>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTable>
        )}
      </div>
    </AdminPageShell>
  );
}
