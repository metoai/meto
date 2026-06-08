"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  AdminButton,
  AdminInput,
  AdminPageHeader,
  AdminPageShell,
  AdminSelect,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  EmptyState,
  formatDate,
  PlanBadge,
  UserLink,
} from "@/components/admin/admin-ui";
import type { AdminUserRow } from "@/lib/admin-queries";
import type { Plan } from "@/lib/entitlements";

type UsersResponse = {
  users: AdminUserRow[];
  total: number;
  page: number;
  perPage: number;
};

export function AdminUsersClient() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<Plan | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: String(page),
      perPage: "20",
      search: query,
      plan,
    });

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed");
      setData(await res.json());
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, [page, plan, query]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Users"
        subtitle="Search, filter, and manage every Meto account."
        action={
          <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <AdminInput
                value={search}
                onChange={setSearch}
                placeholder="Search name, username, email…"
                className="pl-9"
              />
            </div>
            <AdminSelect
              value={plan}
              onChange={(v) => {
                setPlan(v as Plan | "all");
                setPage(1);
              }}
              options={[
                { value: "all", label: "All plans" },
                { value: "trial", label: "Trial" },
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
              ]}
            />
            <AdminButton type="submit">Search</AdminButton>
          </form>
        }
      />

      {loading ? (
        <div className="landing-panel h-64 animate-pulse bg-[var(--surface)]" />
      ) : error ? (
        <EmptyState title={error} />
      ) : !data || data.users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search or filter." />
      ) : (
        <>
          <AdminTable>
            <table className="w-full min-w-[760px]">
              <AdminTableHead>
                <AdminTh>User</AdminTh>
                <AdminTh>Plan</AdminTh>
                <AdminTh>Score</AdminTh>
                <AdminTh>Sections</AdminTh>
                <AdminTh>AI usage</AdminTh>
                <AdminTh>Joined</AdminTh>
              </AdminTableHead>
              <tbody>
                {data.users.map((user) => (
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
                      <span className="font-mono-brand tabular-nums text-[var(--text)]">
                        {user.ai_calls_used}
                        <span className="text-[var(--muted)]">/{user.ai_usage_limit}</span>
                      </span>
                      <span className="ml-1.5 text-[11px] text-[var(--muted)]">
                        ({user.ai_usage_remaining} left)
                      </span>
                    </AdminTd>
                    <AdminTd>{formatDate(user.created_at)}</AdminTd>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTable>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[13px] text-[var(--muted)]">
              {data.total} user{data.total === 1 ? "" : "s"} · page {data.page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <AdminButton
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </AdminButton>
              <AdminButton
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </AdminButton>
            </div>
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
