"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/client";

export function SettingsClient() {
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
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-8 md:px-10">
        <h1 className="text-2xl font-medium text-brand-text">Settings</h1>
        <p className="mt-1 text-sm text-brand-text-muted">
          Manage your account and public profile.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 text-sm text-brand-primary" role="status">
            {success}
          </p>
        )}

        <form onSubmit={handleSave} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm text-brand-text-muted">
              Email
            </label>
            <input
              value={email}
              disabled
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text-subtle"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-brand-text-muted">
              Display name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-brand-text-muted">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-primary"
            />
            <p className="mt-1.5 text-xs text-brand-text-subtle">
              Your public URL: /profile/{username || "yourname"}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-brand-text-muted">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              minLength={6}
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-primary"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-brand-md bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

        <section className="mt-12 border-t border-brand-border pt-8">
          <h2 className="text-lg font-medium text-brand-text">Danger zone</h2>
          <p className="mt-1 text-sm text-brand-text-muted">
            Permanently delete your account and all profile data.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-brand-md border border-red-500/40 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </section>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-brand-lg border border-brand-border bg-brand-card p-6">
            <h3 className="text-lg font-medium text-brand-text">
              Delete your account?
            </h3>
            <p className="mt-2 text-sm text-brand-text-muted">
              This permanently deletes your profile, sections, and account.
              This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-brand-md px-4 py-2 text-sm text-brand-text-muted hover:text-brand-text"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="rounded-brand-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
