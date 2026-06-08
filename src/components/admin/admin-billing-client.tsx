"use client";

import { useEffect, useState } from "react";
import {
  AdminPageHeader,
  AdminPageShell,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  EmptyState,
  formatDate,
  PlanBadge,
  StatCard,
  UserLink,
} from "@/components/admin/admin-ui";
import type { BillingOverview } from "@/lib/admin-queries";

export function AdminBillingClient() {
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/billing")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json() as Promise<BillingOverview>;
      })
      .then(setBilling)
      .catch(() => setError("Could not load billing data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminPageShell>
        <AdminPageHeader title="Billing" subtitle="Subscriptions and trial lifecycle." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="landing-panel h-[108px] animate-pulse bg-[var(--surface)]" />
          ))}
        </div>
      </AdminPageShell>
    );
  }

  if (error || !billing) {
    return (
      <AdminPageShell>
        <EmptyState title={error ?? "No data"} />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Billing"
        subtitle="Polar subscriptions, trials, and revenue signals."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Pro users" value={billing.proCount} />
        <StatCard label="Trial users" value={billing.trialCount} />
        <StatCard label="Free users" value={billing.freeCount} />
        <StatCard label="Polar customers" value={billing.withPolarCustomer} />
        <StatCard label="Active subscriptions" value={billing.withSubscription} />
      </div>

      <div className="mt-6">
        <p className="landing-panel-label mb-3">Pro subscribers</p>
        {billing.proUsers.length === 0 ? (
          <EmptyState title="No pro subscribers yet" />
        ) : (
          <AdminTable>
            <table className="w-full min-w-[640px]">
              <AdminTableHead>
                <AdminTh>User</AdminTh>
                <AdminTh>Plan</AdminTh>
                <AdminTh>Subscription ID</AdminTh>
                <AdminTh>Joined</AdminTh>
              </AdminTableHead>
              <tbody>
                {billing.proUsers.map((user) => (
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
                      <span className="font-mono-brand text-[11px]">
                        {user.polar_subscription_id ?? "—"}
                      </span>
                    </AdminTd>
                    <AdminTd>{formatDate(user.created_at)}</AdminTd>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTable>
        )}
      </div>

      <div className="mt-6">
        <p className="landing-panel-label mb-3">Trials expiring soon</p>
        {billing.expiringTrials.length === 0 ? (
          <EmptyState title="No active trials" />
        ) : (
          <AdminTable>
            <table className="w-full min-w-[560px]">
              <AdminTableHead>
                <AdminTh>User</AdminTh>
                <AdminTh>Trial ends</AdminTh>
                <AdminTh>Joined</AdminTh>
              </AdminTableHead>
              <tbody>
                {billing.expiringTrials.map((user) => (
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
                      {user.trial_ends_at ? formatDate(user.trial_ends_at) : "—"}
                    </AdminTd>
                    <AdminTd>{formatDate(user.created_at)}</AdminTd>
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
