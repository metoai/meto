"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function PortalSettingsPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/profile/me");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to load settings.");
        setLoading(false);
        return;
      }
      setEmail(data.email ?? "");
      setDisplayName(data.profile.display_name ?? "");
      setUsername(data.profile.username ?? "");
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const body: Record<string, string> = {
        display_name: displayName,
        username,
      };
      if (password.trim()) body.password = password;

      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed.");

      setDisplayName(data.profile.display_name ?? "");
      setUsername(data.profile.username ?? "");
      setPassword("");
      setSuccess("Settings saved.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/account", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed.");

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 md:px-5 md:py-5">
      <p className="text-sm font-normal text-[var(--color-muted)]">
        Manage your account and public profile.
      </p>

      {error ? (
        <p className="mt-4 text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-4 text-sm text-[var(--color-accent)]" role="status">
          {success}
        </p>
      ) : null}

      <form
        onSubmit={handleSave}
        className="mt-6 space-y-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
      >
        <div>
          <label className="mb-1.5 block text-sm text-[var(--color-muted)]">
            Email
          </label>
          <input
            value={email}
            disabled
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-muted)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--color-muted)]">
            Display name
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--color-muted)]">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--color-muted)]">
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <h2 className="text-sm font-medium text-[var(--color-text)]">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Permanently delete your account and all profile data.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm text-red-500 transition-colors duration-150 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete account
        </button>
      </div>

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              Delete account?
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              This cannot be undone. All your sections and profile data will be
              removed.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-full px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDeleteAccount()}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
