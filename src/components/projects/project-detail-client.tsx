"use client";

import {
  ArrowLeft,
  Copy,
  FolderGit2,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui/dashboard-card";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { usePortalData } from "@/components/portal/portal-data-context";
import { isDeveloperWorkspace } from "@/lib/workspace-mode";
import type { ProjectKnowledgeScore } from "@/lib/projects/knowledge-score";
import type { PromptPack } from "@/lib/projects/prompt-packs";
import type { RepoHealthReport } from "@/lib/projects/repo-health";
import type { RepositoryGraph } from "@/lib/projects/repository-graph";
import type { SmartQuestion } from "@/lib/projects/smart-questions";
import type { Project, ProjectEvent, ProjectFocus } from "@/lib/projects/types";
import type { KnowledgeObject } from "@/lib/knowledge/types";
import { ProjectGraphView } from "@/components/projects/project-graph-view";
import { ProjectHealthPanel } from "@/components/projects/project-health-panel";
import { ProjectSmartQuestions } from "@/components/projects/project-smart-questions";
import { ProjectDocsPanel } from "@/components/projects/project-docs-panel";
import { ProjectConnectPanel } from "@/components/projects/project-connect-panel";
import { ProjectDecisionForm } from "@/components/projects/project-decision-form";
import { ProjectBusinessForm } from "@/components/projects/project-business-form";

type TabId =
  | "overview"
  | "architecture"
  | "stack"
  | "rules"
  | "business"
  | "timeline"
  | "prompts"
  | "docs"
  | "connect";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "stack", label: "Stack" },
  { id: "rules", label: "Rules" },
  { id: "business", label: "Business" },
  { id: "timeline", label: "Timeline" },
  { id: "docs", label: "Docs" },
  { id: "prompts", label: "Prompt packs" },
  { id: "connect", label: "Connect" },
];

function ScoreRing({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-[var(--muted)]";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-3xl font-semibold tabular-nums ${tone}`}>
        {score}
      </span>
      <span className="text-xs text-[var(--muted)]">Knowledge score</span>
    </div>
  );
}

function MemoryBlock({ items }: { items: KnowledgeObject[] }) {
  if (!items?.length) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Not discovered yet — import or scan a repository.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-[var(--border-subtle)] p-4">
          <h3 className="text-sm font-medium text-[var(--text)]">{item.title}</h3>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-[var(--text-secondary)]">
            {item.content.trim()}
          </pre>
        </article>
      ))}
    </div>
  );
}

export function ProjectDetailClient({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { loaded, profile } = usePortalData();
  const [tab, setTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [savingFocus, setSavingFocus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [project, setProject] = useState<Project | null>(null);
  const [memories, setMemories] = useState<Record<string, KnowledgeObject[]>>({});
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [knowledgeScore, setKnowledgeScore] = useState<ProjectKnowledgeScore | null>(null);
  const [todayContext, setTodayContext] = useState("");
  const [promptPacks, setPromptPacks] = useState<PromptPack[]>([]);
  const [focus, setFocus] = useState<ProjectFocus>({});
  const [repoHealth, setRepoHealth] = useState<RepoHealthReport | null>(null);
  const [graph, setGraph] = useState<RepositoryGraph | null>(null);
  const [smartQuestions, setSmartQuestions] = useState<SmartQuestion[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load project.");
    setProject(data.project);
    setMemories(data.memories ?? {});
    setEvents(data.events ?? []);
    setKnowledgeScore(data.knowledgeScore ?? null);
    setTodayContext(data.todayContext ?? "");
    setPromptPacks(data.promptPacks ?? []);
    setFocus(data.project?.current_focus ?? {});
    setRepoHealth(data.repoHealth ?? null);
    setGraph(data.graph ?? null);
    setSmartQuestions(data.smartQuestions ?? []);
  }, [projectId]);

  useEffect(() => {
    if (!loaded) return;
    if (!isDeveloperWorkspace(profile)) {
      router.replace("/dashboard");
    }
  }, [loaded, profile, router]);

  useEffect(() => {
    if (!loaded || !isDeveloperWorkspace(profile)) return;
    void load()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load.")
      )
      .finally(() => setLoading(false));
  }, [loaded, profile, load]);

  async function handleScan() {
    setScanning(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scan failed.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed.");
    } finally {
      setScanning(false);
    }
  }

  async function handleSaveFocus(e: React.FormEvent) {
    e.preventDefault();
    setSavingFocus(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_focus: focus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save focus.");
      setProject(data.project);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSavingFocus(false);
    }
  }

  async function copyTodayContext() {
    await navigator.clipboard.writeText(todayContext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <PortalPageShell>
        <p className="text-sm text-[var(--text-secondary)]">Loading project…</p>
      </PortalPageShell>
    );
  }

  if (!project) {
    return (
      <PortalPageShell>
        <p className="text-sm text-red-600">{error ?? "Project not found."}</p>
      </PortalPageShell>
    );
  }

  return (
    <PortalPageShell>
      <div className="mb-4">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Projects
        </Link>
      </div>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title={project.name}
          subtitle={
            project.repo_url
              ? `${project.slug} · imported from ${project.import_source}`
              : `${project.slug} · ${project.status}`
          }
        />
        <div className="flex flex-wrap gap-2">
          {project.repo_url ? (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)]"
            >
              <FolderGit2 className="h-3.5 w-3.5" />
              Repo
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => void handleScan()}
            disabled={scanning}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {scanning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {scanning ? "Scanning…" : "Rescan repo"}
          </button>
          <Link
            href="/dashboard/workspace"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Connect AI
          </Link>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="mb-5 flex flex-wrap gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.id
                ? "bg-[var(--card)] text-[var(--text)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <ProjectSmartQuestions
              projectId={projectId}
              questions={smartQuestions}
              onAnswered={() => void load()}
            />

            <section className="landing-panel p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="landing-panel-label">Today&apos;s context</p>
                <button
                  type="button"
                  onClick={() => void copyTodayContext()}
                  className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap font-sans text-sm text-[var(--text-secondary)]">
                {todayContext || "Scan a repo or connect MCP to build context."}
              </pre>
              <p className="mt-2 text-xs text-[var(--muted)]">
                MCP: <code>profile://project/{project.slug}/today</code>
              </p>
            </section>

            <form onSubmit={handleSaveFocus} className="landing-panel space-y-3 p-4">
              <p className="landing-panel-label">Current focus</p>
              <input
                value={focus.sprint ?? ""}
                onChange={(e) => setFocus((f) => ({ ...f, sprint: e.target.value }))}
                placeholder="Current sprint"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
              />
              <input
                value={focus.current_task ?? ""}
                onChange={(e) =>
                  setFocus((f) => ({ ...f, current_task: e.target.value }))
                }
                placeholder="Current task"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
              />
              <input
                value={focus.blockers?.join(", ") ?? ""}
                onChange={(e) =>
                  setFocus((f) => ({
                    ...f,
                    blockers: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Blockers (comma-separated)"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={savingFocus}
                className="rounded-lg bg-[var(--text)] px-3 py-2 text-xs font-medium text-[var(--bg)] disabled:opacity-50"
              >
                {savingFocus ? "Saving…" : "Save focus"}
              </button>
            </form>

            {project.description ? (
              <section className="landing-panel p-4">
                <p className="landing-panel-label">Summary</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {project.description}
                </p>
              </section>
            ) : null}

            {graph ? <ProjectGraphView graph={graph} /> : null}
          </div>

          <aside className="space-y-4">
            {repoHealth ? <ProjectHealthPanel health={repoHealth} /> : null}

            {knowledgeScore ? (
              <section className="landing-panel p-4 text-center">
                <ScoreRing score={knowledgeScore.overall} />
                <ul className="mt-4 space-y-2 text-left">
                  {knowledgeScore.dimensions.slice(0, 6).map((d) => (
                    <li key={d.id} className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">{d.label}</span>
                      <span className="font-medium tabular-nums text-[var(--text)]">
                        {d.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {knowledgeScore?.recommendations.length ? (
              <section className="landing-panel p-4">
                <p className="landing-panel-label">AI recommends</p>
                <ul className="mt-2 space-y-2">
                  {knowledgeScore.recommendations.map((rec) => (
                    <li key={rec} className="text-xs text-[var(--text-secondary)]">
                      · {rec}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.last_scanned_at ? (
              <p className="text-xs text-[var(--muted)]">
                Last scanned {new Date(project.last_scanned_at).toLocaleString()}
              </p>
            ) : null}
          </aside>
        </div>
      ) : null}

      {tab === "architecture" ? (
        <>
          {graph ? <ProjectGraphView graph={graph} /> : null}
          <div className="mt-4">
            <MemoryBlock items={memories.architecture ?? []} />
          </div>
        </>
      ) : null}
      {tab === "stack" ? (
        <MemoryBlock items={[...(memories.stack ?? []), ...(memories.database ?? []), ...(memories.deployment ?? []), ...(memories.api ?? [])]} />
      ) : null}
      {tab === "rules" ? <MemoryBlock items={memories.rules ?? []} /> : null}
      {tab === "business" ? (
        <>
          <ProjectBusinessForm
            projectId={projectId}
            initialContent={memories.business?.[0]?.content ?? ""}
            onSaved={() => void load()}
          />
          <MemoryBlock items={memories.business ?? []} />
        </>
      ) : null}

      {tab === "timeline" ? (
        <div className="space-y-4">
          <ProjectDecisionForm projectId={projectId} onSaved={() => void load()} />
          <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">
              Timeline fills automatically as you import, scan, and update focus.
            </p>
          ) : (
            events.map((event) => (
              <article
                key={event.id}
                className="landing-panel flex gap-4 p-4"
              >
                <div className="w-24 shrink-0 text-xs text-[var(--muted)]">
                  {new Date(event.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-[var(--muted)]">
                    {event.event_type}
                  </p>
                  {event.event_type === "decision" && event.metadata?.from ? (
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      {String(event.metadata.from)} → {String(event.metadata.to)}
                      {event.metadata.reason ? (
                        <span className="block text-xs text-[var(--muted)]">
                          {String(event.metadata.reason)}
                        </span>
                      ) : null}
                    </p>
                  ) : event.content ? (
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      {event.content}
                    </p>
                  ) : null}
                </div>
              </article>
            ))
          )}
          </div>
        </div>
      ) : null}

      {tab === "docs" ? <ProjectDocsPanel projectId={projectId} /> : null}

      {tab === "connect" ? (
        <ProjectConnectPanel projectSlug={project.slug} />
      ) : null}

      {tab === "prompts" ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {promptPacks.map((pack) => (
            <li key={pack.id} className="landing-panel p-4">
              <p className="font-medium text-[var(--text)]">{pack.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{pack.description}</p>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-[var(--surface)] p-3 font-sans text-xs text-[var(--text-secondary)]">
                {pack.prompt}
              </pre>
              <button
                type="button"
                onClick={() => void navigator.clipboard.writeText(pack.prompt)}
                className="mt-2 text-xs text-[var(--primary)] hover:underline"
              >
                Copy prompt
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </PortalPageShell>
  );
}
