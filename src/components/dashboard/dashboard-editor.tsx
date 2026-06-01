"use client";

import { Plus, RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ContextBuilder } from "@/components/ContextBuilder";
import { ProfileGridView } from "@/components/dashboard/profile-grid-view";
import { usePortalDataOptional } from "@/components/portal/portal-data-context";
import type { CompileFormat, ContextSection } from "@/lib/types";
import { getSiteUrl } from "@/lib/public-profile";
import {
  formatRelativeTime,
} from "@/lib/profile-utils";
import { sectionPlaceholder } from "@/lib/section-display";

type SectionDraft = ContextSection & {
  savedTitle: string;
  savedContent: string;
};

export function DashboardEditor({
  panel = "all",
  embedded = false,
  sidebar = false,
  inline = false,
  tieredLayout = false,
  hideLiveBanner = false,
  initialSectionType = null,
  onSectionSaved,
}: {
  panel?: "all" | "profile" | "share";
  embedded?: boolean;
  sidebar?: boolean;
  inline?: boolean;
  tieredLayout?: boolean;
  hideLiveBanner?: boolean;
  initialSectionType?: string | null;
  onSectionSaved?: () => void;
}) {
  const router = useRouter();
  const portal = usePortalDataOptional();
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [format, setFormat] = useState<CompileFormat>("universal");
  const [loading, setLoading] = useState(() => !portal?.loaded);
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

  const applyPortalData = useCallback(() => {
    if (!portal?.loaded) return false;

    setSections(
      portal.sections.map((section) => ({
        ...section,
        savedTitle: section.title,
        savedContent: section.content,
      }))
    );
    setUsername(portal.profile?.username ?? "");
    setDisplayName(
      portal.profile?.display_name?.trim() ||
        portal.profile?.username ||
        portal.email.split("@")[0] ||
        "Me"
    );
    return true;
  }, [portal]);

  useLayoutEffect(() => {
    if (!portal?.loaded) return;
    applyPortalData();
    setLoading(false);
  }, [applyPortalData, portal?.dataVersion, portal?.loaded]);

  useEffect(() => {
    if (portal?.loaded) return;

    async function init() {
      try {
        await Promise.all([loadSections(), loadProfile()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, [loadProfile, loadSections, portal?.loaded]);

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
      void portal?.refresh();
      onSectionSaved?.();
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
      void portal?.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function handleAddPresetSection(
    sectionType: string,
    title: string
  ): Promise<string | undefined> {
    setError(null);
    try {
      const res = await fetch("/api/profile/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: sectionPlaceholder(sectionType),
          section_type: sectionType,
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
      await compileProfile(format, { localOnly: true });
      void portal?.refresh();
      return data.section.id as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add section.");
      return undefined;
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
      void portal?.refresh();
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
      void portal?.refresh();
    } catch (err) {
      updateSection(section.id, "is_public", section.is_public);
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  }

  if (loading) {
    return sidebar ? (
      <div className="space-y-3 px-4 py-4">
        <div className="skeleton h-24 rounded-xl" />
        <div className="skeleton h-24 rounded-xl" />
      </div>
    ) : embedded ? (
      <div className="space-y-3">
        <div className="skeleton h-[72px] rounded-xl" />
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          <div className="skeleton min-h-[140px] rounded-xl" />
          <div className="skeleton min-h-[140px] rounded-xl" />
          <div className="skeleton min-h-[140px] rounded-xl" />
          <div className="skeleton min-h-[140px] rounded-xl" />
        </div>
      </div>
    ) : (
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-8 sm:px-6">
        <div className="skeleton h-10 w-64 rounded-lg" />
        <div className="skeleton h-48 rounded-xl" />
        <div className="skeleton h-48 rounded-xl" />
      </div>
    );
  }

  const showShare = panel === "all" || panel === "share";
  const showProfile = panel === "all" || panel === "profile";
  const showActions = panel === "all";

  const cardClass =
    embedded && !sidebar
      ? "scroll-mt-16 w-full"
      : "";

  const sidebarPanelClass = sidebar ? "flex h-full min-h-0 flex-col" : "";

  const content = (
    <>
        {error && (
          <p
            className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}

        {showShare ? (
        inline ? (
          <ContextBuilder
            sections={contextSections}
            username={username}
            displayName={displayName}
            siteUrl={getSiteUrl()}
            shareSectionTypes={publicSectionTypes}
            variant="light"
            embedded
            workspaceLayout
          />
        ) : (
        <section
          id={embedded ? "share" : undefined}
          className={`w-full ${embedded ? cardClass : ""} ${embedded ? "" : "mb-12"}`}
        >
          <ContextBuilder
            sections={contextSections}
            username={username}
            displayName={displayName}
            siteUrl={getSiteUrl()}
            shareSectionTypes={publicSectionTypes}
            variant="light"
          />
        </section>
        )
        ) : null}

        {showProfile ? (
        <section
          id="sections"
          className={`${sidebar ? sidebarPanelClass : "w-full"} ${
            embedded && !sidebar ? "w-full" : ""
          }`}
        >
          {error && embedded ? (
            <p
              className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {!embedded && !sidebar ? (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              Your sections
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Edit each part of your identity. Save after changes.
            </p>
          </div>
          ) : null}

          <div className={sidebar ? "flex-1 overflow-y-auto px-4 pb-4" : ""}>
          {embedded && !sidebar ? (
            <ProfileGridView
              sections={sections}
              username={username}
              tieredLayout={tieredLayout}
              hideLiveBanner={hideLiveBanner}
              initialSectionType={initialSectionType}
              savingId={savingId}
              onUsernameClaimed={(claimedUsername) => {
                setUsername(claimedUsername);
                if (portal?.profile) {
                  portal.setProfile({
                    ...portal.profile,
                    username: claimedUsername,
                  });
                }
              }}
              onUpdateContent={(id, value) =>
                updateSection(id, "content", value)
              }
              onRevertContent={(id, value) =>
                updateSection(id, "content", value)
              }
              onSaveSection={handleSaveSection}
              onDeleteSection={handleDeleteSection}
              onTogglePublic={handleTogglePublic}
              onAddPresetSection={handleAddPresetSection}
              onAddCustom={() => setShowAddModal(true)}
            />
          ) : sections.length === 0 ? (
            <p className={`rounded-2xl border border-dashed border-[var(--color-border)] text-center text-sm text-[var(--color-muted)] ${sidebar ? "mx-4 p-6" : "p-8"}`}>
              No sections yet. Add one to get started.
            </p>
          ) : (
            <div className={`space-y-4 ${sidebar ? "pb-2" : ""}`}>
              {sections.map((section) => {
                const isDirty =
                  section.title !== section.savedTitle ||
                  section.content !== section.savedContent;
                const isSaving = savingId === section.id;
                const justSaved = savedId === section.id;

                return (
                  <article
                    key={section.id}
                    className={`rounded-xl border bg-[var(--color-bg)]/50 transition-colors ${
                      sidebar ? "p-3" : "p-5"
                    } ${
                      justSaved
                        ? "border-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]/30"
                    }`}
                  >
                    <input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, "title", e.target.value)
                      }
                      className={`mb-2 w-full bg-transparent font-medium text-[var(--color-text)] outline-none ${sidebar ? "text-sm" : "text-base"}`}
                    />
                    <textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(section.id, "content", e.target.value)
                      }
                      rows={sidebar ? 3 : 4}
                      className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                    />
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[10px] text-[var(--color-muted)] sm:text-xs">
                        {formatRelativeTime(section.updated_at)}
                      </p>
                      <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-[var(--color-muted)] sm:text-xs">
                        <input
                          type="checkbox"
                          checked={section.is_public}
                          onChange={() => handleTogglePublic(section)}
                          className="accent-[var(--color-primary)]"
                        />
                        Public
                      </label>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSaving || !isDirty}
                        onClick={() => handleSaveSection(section)}
                        className={`rounded-full bg-[var(--color-primary)] font-medium text-white transition-colors hover:bg-[var(--color-accent)] disabled:opacity-40 ${sidebar ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
                      >
                        {isSaving ? "Saving…" : justSaved ? "Saved ✓" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className={`inline-flex items-center gap-1 rounded-full text-[var(--color-muted)] transition-colors hover:text-red-400 ${sidebar ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"}`}
                      >
                        <Trash2 className={sidebar ? "h-3.5 w-3.5" : "h-4 w-4"} />
                        {!sidebar ? "Delete" : null}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!embedded || sidebar ? (
            <div className={`${sections.length > 0 ? "mt-4" : ""}`}>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] ${sidebar ? "shrink-0 px-2.5 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
              >
                <Plus className={sidebar ? "h-3.5 w-3.5" : "h-4 w-4"} />
                Add section
              </button>
            </div>
          ) : null}
          </div>
        </section>
        ) : null}

        {showActions ? (
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={compiling}
              onClick={() => compileProfile(format, { force: true })}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] disabled:opacity-50"
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
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              {resetting ? "Resetting…" : "Start over"}
            </button>
          </div>
        </section>
        ) : null}
    </>
  );

  return (
    <>
      {embedded ? (
        content
      ) : (
      <main className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
        {content}
      </main>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              Add custom section
            </h3>
            <form onSubmit={handleAddSection} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-[var(--color-muted)]">
                  Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. How I like feedback"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--color-muted)]">
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent)]"
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
