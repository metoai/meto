"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  AdminButton,
  AdminFieldLabel,
  AdminInput,
  AdminPageHeader,
  AdminPageShell,
  AdminSelect,
  AdminTable,
  AdminTableHead,
  AdminTabs,
  AdminTd,
  AdminTextarea,
  AdminTh,
  EmptyState,
  formatDate,
  PlanBadge,
  StatCard,
} from "@/components/admin/admin-ui";
import type { AdminUserDetail } from "@/lib/admin-queries";
import type { AdminSection } from "@/lib/admin-crud";
import { SECTION_KEYS } from "@/lib/meto-prompts";
import type { OnboardingAiUsed, Plan } from "@/lib/entitlements";
import { COMPILE_FORMATS } from "@/lib/types";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "ai", label: "AI usage" },
  { id: "sections", label: "Sections" },
  { id: "score", label: "Context score" },
  { id: "compiled", label: "Compiled" },
  { id: "onboarding", label: "Onboarding" },
];

const SECTION_TYPES = [
  ...SECTION_KEYS,
  "custom",
] as const;

type SectionDraft = {
  title: string;
  content: string;
  section_type: string;
  is_public: boolean;
  display_order: string;
};

const emptySectionDraft = (): SectionDraft => ({
  title: "",
  content: "",
  section_type: "custom",
  is_public: false,
  display_order: "",
});

export function AdminUserDetailClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tab, setTab] = useState("profile");

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [plan, setPlan] = useState<Plan>("trial");
  const [trialEndsAt, setTrialEndsAt] = useState("");
  const [onboardingAi, setOnboardingAi] = useState<string>("");
  const [polarCustomer, setPolarCustomer] = useState("");
  const [polarSub, setPolarSub] = useState("");
  const [aiCalls, setAiCalls] = useState("0");
  const [aiPeriodStart, setAiPeriodStart] = useState("");

  const [scoreValue, setScoreValue] = useState("0");
  const [scoreHeadline, setScoreHeadline] = useState("");
  const [scoreSummary, setScoreSummary] = useState("");
  const [scoreGaps, setScoreGaps] = useState("[]");

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionDraft, setSectionDraft] = useState<SectionDraft>(emptySectionDraft());
  const [creatingSection, setCreatingSection] = useState(false);

  const [editingFormat, setEditingFormat] = useState<string | null>(null);
  const [compiledContent, setCompiledContent] = useState("");
  const [newCompileFormat, setNewCompileFormat] = useState("universal");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error("Failed");
      const data = (await res.json()) as AdminUserDetail;
      setUser(data);
      syncForms(data);
    } catch {
      setError("Could not load user.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  function syncForms(data: AdminUserDetail) {
    setUsername(data.username ?? "");
    setDisplayName(data.display_name ?? "");
    setPlan(data.plan);
    setTrialEndsAt(data.trial_ends_at ? data.trial_ends_at.slice(0, 16) : "");
    setOnboardingAi(data.onboarding_ai_used ?? "");
    setPolarCustomer(data.polar_customer_id ?? "");
    setPolarSub(data.polar_subscription_id ?? "");
    setAiCalls(String(data.ai_calls_used));
    setAiPeriodStart(
      data.ai_usage_period_start ? data.ai_usage_period_start.slice(0, 16) : "",
    );

    const score = data.context_score_detail;
    if (score) {
      setScoreValue(String(score.score));
      setScoreHeadline(score.headline);
      setScoreSummary(score.summary);
      setScoreGaps(JSON.stringify(score.gaps ?? [], null, 2));
    } else {
      setScoreValue("0");
      setScoreHeadline("");
      setScoreSummary("");
      setScoreGaps("[]");
    }
  }

  useEffect(() => {
    void load();
  }, [load]);

  async function saveProfile() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim() || null,
          display_name: displayName.trim() || null,
          plan,
          trial_ends_at: trialEndsAt ? new Date(trialEndsAt).toISOString() : null,
          onboarding_ai_used: (onboardingAi || null) as OnboardingAiUsed,
          polar_customer_id: polarCustomer.trim() || null,
          polar_subscription_id: polarSub.trim() || null,
          ai_calls_used: Number(aiCalls),
          ai_usage_period_start: aiPeriodStart
            ? new Date(aiPeriodStart).toISOString()
            : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setUser(data);
      syncForms(data);
      setMessage("Profile saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function resetAiUsage() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/ai-usage`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      await load();
      setMessage("AI usage reset.");
    } catch {
      setMessage("Reset failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser() {
    if (!confirm("Permanently delete this user and all their data?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed");
      }
      router.push("/admin/users");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Delete failed.");
      setSaving(false);
    }
  }

  async function resetUserData() {
    if (!confirm("Delete all sections, scores, compiled profiles, and onboarding chats?")) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-data`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setUser(data.user);
      syncForms(data.user);
      setMessage("User data reset.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Reset failed.");
    } finally {
      setSaving(false);
    }
  }

  function startEditSection(section: AdminSection) {
    setEditingSectionId(section.id);
    setCreatingSection(false);
    setSectionDraft({
      title: section.title,
      content: section.content,
      section_type: section.section_type,
      is_public: section.is_public,
      display_order: String(section.display_order),
    });
  }

  async function saveSection() {
    setSaving(true);
    setMessage(null);
    const payload = {
      title: sectionDraft.title,
      content: sectionDraft.content,
      section_type: sectionDraft.section_type,
      is_public: sectionDraft.is_public,
      ...(sectionDraft.display_order
        ? { display_order: Number(sectionDraft.display_order) }
        : {}),
    };

    try {
      const url = editingSectionId
        ? `/api/admin/users/${userId}/sections/${editingSectionId}`
        : `/api/admin/users/${userId}/sections`;
      const res = await fetch(url, {
        method: editingSectionId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setEditingSectionId(null);
      setCreatingSection(false);
      setSectionDraft(emptySectionDraft());
      await load();
      setMessage("Section saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Section save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSection(sectionId: string) {
    if (!confirm("Delete this section?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/sections/${sectionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      await load();
      setMessage("Section deleted.");
    } catch {
      setMessage("Delete failed.");
    } finally {
      setSaving(false);
    }
  }

  async function saveScore() {
    setSaving(true);
    setMessage(null);
    let gaps: unknown = [];
    try {
      gaps = JSON.parse(scoreGaps);
    } catch {
      setMessage("Gaps must be valid JSON.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: Number(scoreValue),
          headline: scoreHeadline,
          summary: scoreSummary,
          gaps,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      await load();
      setMessage("Context score saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Score save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteScore() {
    if (!confirm("Delete context score?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/score`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      await load();
      setMessage("Score deleted.");
    } catch {
      setMessage("Delete failed.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCompiled(format: string) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/users/${userId}/compiled/${encodeURIComponent(format)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_context: compiledContent }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setEditingFormat(null);
      await load();
      setMessage("Compiled profile saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCompiled(format: string) {
    if (!confirm(`Delete compiled profile for ${format}?`)) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/users/${userId}/compiled/${encodeURIComponent(format)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed");
      await load();
      setMessage("Compiled profile deleted.");
    } catch {
      setMessage("Delete failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAllChats() {
    if (!confirm("Delete all onboarding chats?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/onboarding-chats`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      await load();
      setMessage("Chats deleted.");
    } catch {
      setMessage("Delete failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminPageShell>
        <div className="landing-panel flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      </AdminPageShell>
    );
  }

  if (error || !user) {
    return (
      <AdminPageShell>
        <EmptyState title={error ?? "User not found"} />
      </AdminPageShell>
    );
  }

  const headerTitle = user.display_name || user.username || user.email;
  const usagePct =
    user.ai_usage.limit > 0
      ? Math.round((user.ai_usage.used / user.ai_usage.limit) * 100)
      : 0;

  return (
    <AdminPageShell>
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        All users
      </Link>

      <AdminPageHeader
        title={headerTitle}
        subtitle={user.email}
        action={
          user.username ? (
            <a
              href={`/profile/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--primary)] ring-1 ring-[var(--border-subtle)] transition-colors hover:bg-[var(--surface)]"
            >
              Public profile
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Context score"
          value={user.context_score !== null ? `${user.context_score}%` : "—"}
        />
        <StatCard label="Sections" value={user.section_count} />
        <StatCard
          label="AI usage"
          value={`${user.ai_usage.used}/${user.ai_usage.limit}`}
          hint={`${user.ai_usage.remaining} remaining · ${usagePct}%`}
        />
        <StatCard label="Onboarding" value={user.onboarding_ai_used ?? "—"} />
      </div>

      {message ? (
        <p className="mb-4 text-[13px] text-[var(--muted)]">{message}</p>
      ) : null}

      <AdminTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "profile" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="landing-panel space-y-4 p-4 sm:p-5">
            <p className="landing-panel-label">Identity</p>
            <div>
              <AdminFieldLabel>Username</AdminFieldLabel>
              <AdminInput value={username} onChange={setUsername} placeholder="username" />
            </div>
            <div>
              <AdminFieldLabel>Display name</AdminFieldLabel>
              <AdminInput value={displayName} onChange={setDisplayName} />
            </div>
            <div>
              <AdminFieldLabel>Plan</AdminFieldLabel>
              <div className="flex items-center gap-3">
                <AdminSelect
                  value={plan}
                  onChange={(v) => setPlan(v as Plan)}
                  options={[
                    { value: "trial", label: "Trial" },
                    { value: "free", label: "Free" },
                    { value: "pro", label: "Pro" },
                  ]}
                />
                <PlanBadge plan={plan} />
              </div>
            </div>
            <div>
              <AdminFieldLabel>Trial ends at</AdminFieldLabel>
              <AdminInput type="datetime-local" value={trialEndsAt} onChange={setTrialEndsAt} />
            </div>
            <div>
              <AdminFieldLabel>Onboarding AI used</AdminFieldLabel>
              <AdminSelect
                value={onboardingAi}
                onChange={setOnboardingAi}
                options={[
                  { value: "", label: "None" },
                  { value: "brain_dump", label: "Brain dump" },
                  { value: "chat", label: "Chat" },
                ]}
              />
            </div>
          </div>

          <div className="landing-panel space-y-4 p-4 sm:p-5">
            <p className="landing-panel-label">Billing & danger zone</p>
            <div>
              <AdminFieldLabel>Polar customer ID</AdminFieldLabel>
              <AdminInput value={polarCustomer} onChange={setPolarCustomer} />
            </div>
            <div>
              <AdminFieldLabel>Polar subscription ID</AdminFieldLabel>
              <AdminInput value={polarSub} onChange={setPolarSub} />
            </div>
            <dl className="space-y-2 border-t border-[var(--border-subtle)] pt-4 text-[13px]">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">User ID</dt>
                <dd className="truncate font-mono-brand text-[11px]">{user.id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Joined</dt>
                <dd>{formatDate(user.created_at)}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-4">
              <AdminButton onClick={() => void saveProfile()} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save profile
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => void resetUserData()} disabled={saving}>
                <RotateCcw className="h-4 w-4" />
                Reset data
              </AdminButton>
              <AdminButton variant="danger" onClick={() => void deleteUser()} disabled={saving}>
                <Trash2 className="h-4 w-4" />
                Delete user
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "ai" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="landing-panel p-4 sm:p-5">
            <p className="landing-panel-label">AI usage snapshot</p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--muted)]">Effective plan</span>
                <span className="font-medium capitalize text-[var(--text)]">
                  {user.ai_usage.effectivePlan}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--muted)]">Period</span>
                <span className="text-[var(--text)]">{user.ai_usage.periodLabel}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--muted)]">Used / limit</span>
                <span className="font-mono-brand tabular-nums text-[var(--text)]">
                  {user.ai_usage.used} / {user.ai_usage.limit}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--muted)]">Remaining</span>
                <span className="font-mono-brand tabular-nums text-[var(--primary)]">
                  {user.ai_usage.remaining}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${Math.min(100, usagePct)}%` }}
                />
              </div>
            </div>
            <div className="mt-4">
              <AdminButton variant="secondary" onClick={() => void resetAiUsage()} disabled={saving}>
                <RotateCcw className="h-4 w-4" />
                Reset usage to 0
              </AdminButton>
            </div>
          </div>

          <div className="landing-panel space-y-4 p-4 sm:p-5">
            <p className="landing-panel-label">Edit usage counters</p>
            <div>
              <AdminFieldLabel>AI calls used</AdminFieldLabel>
              <AdminInput type="number" value={aiCalls} onChange={setAiCalls} />
            </div>
            <div>
              <AdminFieldLabel>Usage period start</AdminFieldLabel>
              <AdminInput type="datetime-local" value={aiPeriodStart} onChange={setAiPeriodStart} />
            </div>
            <AdminButton onClick={() => void saveProfile()} disabled={saving}>
              Save AI usage
            </AdminButton>
          </div>
        </div>
      ) : null}

      {tab === "sections" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="landing-panel-label">Sections ({user.sections.length})</p>
            <AdminButton
              variant="secondary"
              onClick={() => {
                setCreatingSection(true);
                setEditingSectionId(null);
                setSectionDraft(emptySectionDraft());
              }}
            >
              <Plus className="h-4 w-4" />
              Add section
            </AdminButton>
          </div>

          {(creatingSection || editingSectionId) ? (
            <div className="landing-panel space-y-4 p-4 sm:p-5">
              <p className="landing-panel-label">
                {editingSectionId ? "Edit section" : "New section"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <AdminFieldLabel>Title</AdminFieldLabel>
                  <AdminInput value={sectionDraft.title} onChange={(v) => setSectionDraft((d) => ({ ...d, title: v }))} />
                </div>
                <div>
                  <AdminFieldLabel>Type</AdminFieldLabel>
                  <AdminSelect
                    value={sectionDraft.section_type}
                    onChange={(v) => setSectionDraft((d) => ({ ...d, section_type: v }))}
                    options={SECTION_TYPES.map((t) => ({ value: t, label: t }))}
                  />
                </div>
              </div>
              <div>
                <AdminFieldLabel>Content</AdminFieldLabel>
                <AdminTextarea
                  value={sectionDraft.content}
                  onChange={(v) => setSectionDraft((d) => ({ ...d, content: v }))}
                  rows={8}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={sectionDraft.is_public}
                    onChange={(e) =>
                      setSectionDraft((d) => ({ ...d, is_public: e.target.checked }))
                    }
                    className="rounded border-[var(--border-subtle)]"
                  />
                  Public
                </label>
                <div className="w-28">
                  <AdminFieldLabel>Order</AdminFieldLabel>
                  <AdminInput
                    type="number"
                    value={sectionDraft.display_order}
                    onChange={(v) => setSectionDraft((d) => ({ ...d, display_order: v }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <AdminButton onClick={() => void saveSection()} disabled={saving}>
                  Save section
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setCreatingSection(false);
                    setEditingSectionId(null);
                  }}
                >
                  Cancel
                </AdminButton>
              </div>
            </div>
          ) : null}

          {user.sections.length === 0 ? (
            <EmptyState title="No sections" />
          ) : (
            <AdminTable>
              <table className="w-full min-w-[640px]">
                <AdminTableHead>
                  <AdminTh>Title</AdminTh>
                  <AdminTh>Type</AdminTh>
                  <AdminTh>Public</AdminTh>
                  <AdminTh>Order</AdminTh>
                  <AdminTh className="text-right">Actions</AdminTh>
                </AdminTableHead>
                <tbody>
                  {user.sections.map((section) => (
                    <tr key={section.id} className="border-b border-[var(--border-subtle)] last:border-0">
                      <AdminTd className="max-w-[200px] font-medium text-[var(--text)]">
                        <span className="line-clamp-2">{section.title}</span>
                      </AdminTd>
                      <AdminTd>{section.section_type}</AdminTd>
                      <AdminTd>{section.is_public ? "Yes" : "No"}</AdminTd>
                      <AdminTd>{section.display_order}</AdminTd>
                      <AdminTd className="text-right">
                        <div className="flex justify-end gap-1">
                          <AdminButton
                            variant="secondary"
                            onClick={() => startEditSection(section)}
                          >
                            Edit
                          </AdminButton>
                          <AdminButton
                            variant="danger"
                            onClick={() => void deleteSection(section.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </AdminButton>
                        </div>
                      </AdminTd>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTable>
          )}
        </div>
      ) : null}

      {tab === "score" ? (
        <div className="landing-panel max-w-2xl space-y-4 p-4 sm:p-5">
          <p className="landing-panel-label">Context score</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminFieldLabel>Score (0–100)</AdminFieldLabel>
              <AdminInput type="number" value={scoreValue} onChange={setScoreValue} />
            </div>
            <div>
              <AdminFieldLabel>Analyzed at</AdminFieldLabel>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {user.context_score_detail
                  ? formatDate(user.context_score_detail.analyzed_at)
                  : "—"}
              </p>
            </div>
          </div>
          <div>
            <AdminFieldLabel>Headline</AdminFieldLabel>
            <AdminInput value={scoreHeadline} onChange={setScoreHeadline} />
          </div>
          <div>
            <AdminFieldLabel>Summary</AdminFieldLabel>
            <AdminTextarea value={scoreSummary} onChange={setScoreSummary} rows={4} />
          </div>
          <div>
            <AdminFieldLabel>Gaps (JSON)</AdminFieldLabel>
            <AdminTextarea value={scoreGaps} onChange={setScoreGaps} rows={6} className="font-mono-brand text-[12px]" />
          </div>
          <div className="flex gap-2">
            <AdminButton onClick={() => void saveScore()} disabled={saving}>
              {user.context_score_detail ? "Update score" : "Create score"}
            </AdminButton>
            {user.context_score_detail ? (
              <AdminButton variant="danger" onClick={() => void deleteScore()} disabled={saving}>
                Delete score
              </AdminButton>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "compiled" ? (
        <div className="space-y-4">
          {editingFormat ? (
            <div className="landing-panel space-y-4 p-4 sm:p-5">
              <p className="landing-panel-label">Edit {editingFormat}</p>
              <AdminTextarea
                value={compiledContent}
                onChange={setCompiledContent}
                rows={14}
                className="font-mono-brand text-[12px]"
              />
              <div className="flex gap-2">
                <AdminButton onClick={() => void saveCompiled(editingFormat)} disabled={saving}>
                  Save
                </AdminButton>
                <AdminButton variant="secondary" onClick={() => setEditingFormat(null)}>
                  Cancel
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="landing-panel flex flex-wrap items-end gap-3 p-4 sm:p-5">
              <div className="min-w-[160px] flex-1">
                <AdminFieldLabel>New compiled format</AdminFieldLabel>
                <AdminSelect
                  value={newCompileFormat}
                  onChange={setNewCompileFormat}
                  options={COMPILE_FORMATS.map((f) => ({ value: f, label: f }))}
                />
              </div>
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setEditingFormat(newCompileFormat);
                  const existing = user.compiled_profiles.find((c) => c.format === newCompileFormat);
                  setCompiledContent(existing?.full_context ?? "");
                }}
              >
                <Plus className="h-4 w-4" />
                {user.compiled_profiles.some((c) => c.format === newCompileFormat)
                  ? "Edit format"
                  : "Create format"}
              </AdminButton>
            </div>
          )}

          {user.compiled_profiles.length === 0 ? (
            <EmptyState title="No compiled profiles" />
          ) : (
            <AdminTable>
              <table className="w-full min-w-[560px]">
                <AdminTableHead>
                  <AdminTh>Format</AdminTh>
                  <AdminTh>Last compiled</AdminTh>
                  <AdminTh>Size</AdminTh>
                  <AdminTh className="text-right">Actions</AdminTh>
                </AdminTableHead>
                <tbody>
                  {user.compiled_profiles.map((c) => (
                    <tr key={c.format} className="border-b border-[var(--border-subtle)] last:border-0">
                      <AdminTd className="font-medium capitalize text-[var(--text)]">{c.format}</AdminTd>
                      <AdminTd>{formatDate(c.last_compiled)}</AdminTd>
                      <AdminTd>{c.full_context.length.toLocaleString()} chars</AdminTd>
                      <AdminTd className="text-right">
                        <div className="flex justify-end gap-1">
                          <AdminButton
                            variant="secondary"
                            onClick={() => {
                              setEditingFormat(c.format);
                              setCompiledContent(c.full_context);
                            }}
                          >
                            Edit
                          </AdminButton>
                          <AdminButton
                            variant="danger"
                            onClick={() => void deleteCompiled(c.format)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </AdminButton>
                        </div>
                      </AdminTd>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTable>
          )}
        </div>
      ) : null}

      {tab === "onboarding" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="landing-panel-label">
              Onboarding chats ({user.onboarding_chats.length})
            </p>
            {user.onboarding_chats.length > 0 ? (
              <AdminButton variant="danger" onClick={() => void deleteAllChats()} disabled={saving}>
                Delete all
              </AdminButton>
            ) : null}
          </div>
          {user.onboarding_chats.length === 0 ? (
            <EmptyState title="No onboarding chats" />
          ) : (
            <AdminTable>
              <table className="w-full min-w-[480px]">
                <AdminTableHead>
                  <AdminTh>Created</AdminTh>
                  <AdminTh>Messages</AdminTh>
                  <AdminTh>Completed</AdminTh>
                  <AdminTh className="text-right">Actions</AdminTh>
                </AdminTableHead>
                <tbody>
                  {user.onboarding_chats.map((chat) => (
                    <tr key={chat.id} className="border-b border-[var(--border-subtle)] last:border-0">
                      <AdminTd>{formatDate(chat.created_at)}</AdminTd>
                      <AdminTd>{chat.message_count}</AdminTd>
                      <AdminTd>{chat.completed ? "Yes" : "No"}</AdminTd>
                      <AdminTd className="text-right">
                        <AdminButton
                          variant="danger"
                          onClick={async () => {
                            if (!confirm("Delete this chat?")) return;
                            setSaving(true);
                            try {
                              const res = await fetch(
                                `/api/admin/users/${userId}/onboarding-chats/${chat.id}`,
                                { method: "DELETE" },
                              );
                              if (!res.ok) throw new Error("Failed");
                              await load();
                            } finally {
                              setSaving(false);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </AdminButton>
                      </AdminTd>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTable>
          )}
        </div>
      ) : null}
    </AdminPageShell>
  );
}
