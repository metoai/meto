"use client";

import {
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ContextBuilder } from "@/components/ContextBuilder";
import type { CompileFormat, ContextSection } from "@/lib/types";
import { getSiteUrl } from "@/lib/public-profile";
import {
  formatRelativeTime,
  getProfileCompletion,
} from "@/lib/profile-utils";

type SectionDraft = ContextSection & {
  savedTitle: string;
  savedContent: string;
};

export function DashboardEditor() {
  const router = useRouter();
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [format, setFormat] = useState<CompileFormat>("universal");
  const [loading, setLoading] = useState(true);
  const [compiling, setCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [resetting, setResetting] = useState(false);

  const loadSections = useCallback(async () => {
    const res = await fetch("/api/profile/sections");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load sections.");
    setSections(
      (data.sections as ContextSection[]).map((s) => ({
        ...s,
        savedTitle: s.title,
        savedContent: s.content,
      }))
    );
  }, []);

  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/profile/me");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load profile.");
    setUsername(data.profile?.username ?? "");
    setDisplayName(
      data.profile?.display_name?.trim() ||
        data.profile?.username ||
        data.email?.split("@")[0] ||
        "Me"
    );
  }, []);

  const contextSections = useMemo(
    () =>
      sections.map((section) => ({
        section_type: section.section_type,
        title: section.title,
        content: section.content,
      })),
    [sections]
  );

  const publicSectionTypes = useMemo(
    () =>
      sections
        .filter((section) => section.is_public)
        .map((section) => section.section_type),
    [sections]
  );

  const compileProfile = useCallback(
    async (
      selectedFormat: CompileFormat,
      options: { force?: boolean; localOnly?: boolean } = {}
    ) => {
      setCompiling(true);
      setError(null);
      try {
        const res = await fetch("/api/profile/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            format: selectedFormat,
            force: options.force ?? false,
            localOnly: options.localOnly ?? false,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Compile failed.");
        setFormat(selectedFormat);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Compile failed.");
      } finally {
        setCompiling(false);
      }
    },
    []
  );

  useEffect(() => {
    async function init() {
      try {
        await Promise.all([loadSections(), loadProfile()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [loadSections, loadProfile]);

  async function handleSaveSection(section: SectionDraft) {
    setSavingId(section.id);
    setError(null);
    try {
      const res = await fetch(`/api/profile/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: section.title,
          content: section.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed.");

      setSections((prev) =>
        prev.map((s) =>
          s.id === section.id
            ? {
                ...data.section,
                savedTitle: data.section.title,
                savedContent: data.section.content,
              }
            : s
        )
      );
      setSavedId(section.id);
      setTimeout(() => setSavedId(null), 1500);
      await compileProfile(format, { localOnly: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDeleteSection(id: string) {
    if (!confirm("Delete this section?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/profile/sections/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed.");
      }
      setSections((prev) => prev.filter((s) => s.id !== id));
      await compileProfile(format, { localOnly: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/profile/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          section_type: "custom",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add section.");

      setSections((prev) => [
        ...prev,
        {
          ...data.section,
          savedTitle: data.section.title,
          savedContent: data.section.content,
        },
      ]);
      setShowAddModal(false);
      setNewTitle("");
      setNewContent("");
      await compileProfile(format, { localOnly: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add section.");
    }
  }

  async function handleReset() {
    if (
      !confirm(
        "Start over? This deletes all your sections and sends you back to onboarding."
      )
    ) {
      return;
    }
    setResetting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/reset", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Reset failed.");
      }
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
      setResetting(false);
    }
  }

  function updateSection(
    id: string,
    field: "title" | "content" | "is_public",
    value: string | boolean
  ) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  async function handleTogglePublic(section: SectionDraft) {
    const next = !section.is_public;
    updateSection(section.id, "is_public", next);
    setError(null);

    try {
      const res = await fetch(`/api/profile/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed.");
      setSections((prev) =>
        prev.map((s) =>
          s.id === section.id ? { ...s, is_public: data.section.is_public } : s
        )
      );
    } catch (err) {
      updateSection(section.id, "is_public", section.is_public);
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  }

  const completion = getProfileCompletion(sections);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
        {error && (
          <p
            className="mb-6 rounded-brand-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Context Builder */}
        <section className="mb-12">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium text-brand-text">
                Your AI identity
              </h1>
              <p className="mt-1 text-sm text-brand-text-muted">
                Choose what to share, then copy a link for AI to read.
              </p>
            </div>
            <div className="rounded-brand-md border border-brand-border bg-brand-card px-4 py-2 text-right">
              <p className="text-xs text-brand-text-subtle">Profile complete</p>
              <p className="text-lg font-medium text-brand-primary">
                {completion}%
              </p>
            </div>
          </div>

          <ContextBuilder
            sections={contextSections}
            username={username}
            displayName={displayName}
            siteUrl={getSiteUrl()}
            shareSectionTypes={publicSectionTypes}
            variant="dark"
          />
        </section>

        {/* Your Sections */}
        <section id="sections" className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-brand-text">
                Your sections
              </h2>
              <p className="mt-1 text-sm text-brand-text-muted">
                Edit each part of your identity. Save after changes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-brand-md border border-brand-border px-4 py-2 text-sm text-brand-text transition-colors hover:border-brand-primary"
            >
              <Plus className="h-4 w-4" />
              Add section
            </button>
          </div>

          {sections.length === 0 ? (
            <p className="rounded-brand-lg border border-dashed border-brand-border p-8 text-center text-sm text-brand-text-muted">
              No sections yet. Add one to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => {
                const isDirty =
                  section.title !== section.savedTitle ||
                  section.content !== section.savedContent;
                const isSaving = savingId === section.id;
                const justSaved = savedId === section.id;

                return (
                  <article
                    key={section.id}
                    className={`rounded-brand-lg border bg-brand-card p-5 transition-colors ${
                      justSaved
                        ? "border-brand-primary"
                        : "border-brand-border hover:border-brand-primary/30"
                    }`}
                  >
                    <input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, "title", e.target.value)
                      }
                      className="mb-3 w-full bg-transparent text-base font-medium text-brand-text outline-none"
                    />
                    <textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(section.id, "content", e.target.value)
                      }
                      rows={4}
                      className="w-full resize-y rounded-brand-md border border-brand-border bg-brand-background px-3 py-2 text-sm leading-relaxed text-brand-text outline-none focus:border-brand-primary"
                    />
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-brand-text-subtle">
                        Last updated {formatRelativeTime(section.updated_at)}
                      </p>
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-brand-text-muted">
                        <input
                          type="checkbox"
                          checked={section.is_public}
                          onChange={() => handleTogglePublic(section)}
                          className="accent-brand-primary"
                        />
                        Make public
                      </label>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSaving || !isDirty}
                        onClick={() => handleSaveSection(section)}
                        className="rounded-brand-md bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-40"
                      >
                        {isSaving ? "Saving…" : justSaved ? "Saved ✓" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="inline-flex items-center gap-1.5 rounded-brand-md px-3 py-2 text-sm text-brand-text-muted transition-colors hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-medium text-brand-text">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={compiling}
              onClick={() => compileProfile(format, { force: true })}
              className="inline-flex items-center gap-2 rounded-brand-md border border-brand-border px-4 py-2.5 text-sm text-brand-text transition-colors hover:border-brand-primary disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${compiling ? "animate-spin" : ""}`}
              />
              {compiling ? "Regenerating…" : "Regenerate AI compile (cache)"}
            </button>
            <button
              type="button"
              disabled={resetting}
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-brand-md border border-brand-border px-4 py-2.5 text-sm text-brand-text-muted transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              {resetting ? "Resetting…" : "Start over"}
            </button>
          </div>
        </section>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-brand-lg border border-brand-border bg-brand-card p-6">
            <h3 className="text-lg font-medium text-brand-text">
              Add custom section
            </h3>
            <form onSubmit={handleAddSection} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-brand-text-muted">
                  Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. How I like feedback"
                  className="w-full rounded-brand-md border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-brand-text-muted">
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-brand-md border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-brand-md px-4 py-2 text-sm text-brand-text-muted hover:text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-brand-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
                >
                  Add section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
