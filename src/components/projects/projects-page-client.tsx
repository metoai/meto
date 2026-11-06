"use client";

import {
  FolderGit2,
  FolderKanban,
  FolderOpen,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui/dashboard-card";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { usePortalData } from "@/components/portal/portal-data-context";
import {
  projectNameFromFiles,
  readFilesFromFileList,
} from "@/lib/projects/local-import";
import { isDeveloperWorkspace } from "@/lib/workspace-mode";
import type { Project } from "@/lib/projects/types";

type ImportSource = "github" | "gitlab" | "local";

export function ProjectsPageClient() {
  const router = useRouter();
  const folderRef = useRef<HTMLInputElement>(null);
  const { loaded, profile } = usePortalData();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importSource, setImportSource] = useState<ImportSource>("github");
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load projects.");
    setProjects(data.projects ?? []);
  }

  useEffect(() => {
    if (!loaded) return;
    if (!isDeveloperWorkspace(profile)) {
      router.replace("/dashboard");
    }
  }, [loaded, profile, router]);

  useEffect(() => {
    if (!loaded || !isDeveloperWorkspace(profile)) return;
    void fetch("/api/projects/sync", { method: "POST" }).catch(() => {});
    void loadProjects()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load.")
      )
      .finally(() => setLoading(false));
  }, [loaded, profile]);

  async function importWithPayload(payload: Record<string, unknown>) {
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to import.");
      setRepoUrl("");
      await loadProjects();
      if (data.project?.id) {
        router.push(`/dashboard/projects/${data.project.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  }

  async function handleRepoImport(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    await importWithPayload({
      source: importSource,
      githubUrl: importSource === "github" ? repoUrl.trim() : undefined,
      gitlabUrl: importSource === "gitlab" ? repoUrl.trim() : undefined,
    });
  }

  async function handleFolderPick(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList?.length) return;
    const files = await readFilesFromFileList(fileList);
    if (!Object.keys(files).length) {
      setError("No manifest files found — pick a project root with package.json.");
      return;
    }
    await importWithPayload({
      source: "local",
      name: projectNameFromFiles(files),
      files,
    });
    e.target.value = "";
  }

  const placeholders: Record<ImportSource, string> = {
    github: "https://github.com/owner/repo",
    gitlab: "https://gitlab.com/owner/repo",
    local: "",
  };

  return (
    <PortalPageShell>
      <PageHeader
        title="Projects"
        subtitle="AI Project OS — import a repo, Meto infers the rest."
      />

      <section className="landing-panel mb-4 p-4">
        <p className="landing-panel-label mb-3">Zero-manual import</p>

        <div className="mb-3 flex flex-wrap gap-1">
          {(
            [
              ["github", "GitHub"],
              ["gitlab", "GitLab"],
              ["local", "Local folder"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setImportSource(id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                importSource === id
                  ? "bg-[var(--text)] text-[var(--bg)]"
                  : "bg-[var(--surface)] text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {importSource === "local" ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              ref={folderRef}
              type="file"
              // @ts-expect-error webkitdirectory is non-standard but widely supported
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
              onChange={(e) => void handleFolderPick(e)}
            />
            <button
              type="button"
              disabled={importing}
              onClick={() => folderRef.current?.click()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-4 py-6 text-sm text-[var(--text-secondary)] hover:border-[var(--primary)]"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderOpen className="h-4 w-4" />
              )}
              {importing ? "Scanning folder…" : "Choose project folder"}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleRepoImport}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <FolderGit2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder={placeholders[importSource]}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
              />
            </div>
            <button
              type="submit"
              disabled={importing || !repoUrl.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {importing ? "Scanning…" : "Import & scan"}
            </button>
          </form>
        )}

        <p className="mt-3 text-xs text-[var(--muted)]">
          Meto auto-detects languages, frameworks, database, CI/CD, and deployment.
          No forms — everything inferred, then you confirm.
        </p>
      </section>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-[var(--text-secondary)]">Loading projects…</p>
      ) : projects.length === 0 ? (
        <div className="landing-panel p-6 text-center">
          <FolderKanban className="mx-auto h-8 w-8 text-[var(--muted)]" />
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            No projects yet. Import a repo or folder to create your first knowledge graph.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="landing-panel block p-4 transition-[border-color] hover:border-[var(--accent-border)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-[var(--text)]">{project.name}</p>
                  {project.import_source !== "manual" ? (
                    <span className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {project.import_source}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {project.slug} · {project.status}
                  {project.last_scanned_at
                    ? ` · scanned ${new Date(project.last_scanned_at).toLocaleDateString()}`
                    : ""}
                </p>
                {project.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">
                    {project.description}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PortalPageShell>
  );
}
