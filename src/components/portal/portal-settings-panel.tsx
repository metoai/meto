"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePortalData } from "@/components/portal/portal-data-context";
import { createClient } from "@/lib/supabase/client";

export function PortalSettingsPanel() {
  const router = useRouter();
  const { profile, email, loaded, refresh, setProfile } = usePortalData();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!loaded || !profile) return;
    setDisplayName(profile.display_name ?? "");
    setUsername(profile.username ?? "");
  }, [loaded, profile]);

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

      setProfile(data.profile);
      setDisplayName(data.profile.display_name ?? "");
      setUsername(data.profile.username ?? "");
      setPassword("");
      setSuccess("Settings saved.");
      setTimeout(() => setSuccess(null), 3000);
      void refresh();
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

  if (!loaded) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-[72px] rounded-xl" />
        <div className="skeleton h-56 rounded-xl" />
        <div className="skeleton h-36 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4 rounded-xl border border-[#E8E8E4] bg-white px-[18px] py-[14px]">
        <p className="text-[13px] font-medium text-[#0F6E56]">Account settings</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Manage your login details and public profile URL.
        </p>
      </div>

      {error ? (
        <p
          className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          className="mb-4 rounded-xl border border-[#C0E0D8] bg-[#E8F5F0] px-4 py-3 text-sm text-[#0F6E56]"
          role="status"
        >
          {success}
        </p>
      ) : null}

      <form
        onSubmit={handleSave}
        className="rounded-xl border border-[#E8E8E4] bg-white p-[18px]"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#9B9B93]">
          Profile
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6B6B63]">
              Email
            </label>
            <input
              value={email}
              disabled
              className="w-full rounded-[10px] border border-[#E8E8E4] bg-[#F7F7F5] px-3 py-2.5 text-sm text-[#9B9B93]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6B6B63]">
              Display name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-[10px] border border-[#E8E8E4] bg-white px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[#C0C0B8]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6B6B63]">
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#9B9B93]">meto.ai/profile/</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="min-w-0 flex-1 rounded-[10px] border border-[#E8E8E4] bg-white px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[#C0C0B8]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6B6B63]">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full rounded-[10px] border border-[#E8E8E4] bg-white px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[#C0C0B8]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-[7px] bg-[#0F6E56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D9E75] disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-[#E8E8E4] bg-white p-[18px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#9B9B93]">
          Danger zone
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Permanently delete your account and all profile data.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-[7px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#F87171] transition-colors hover:bg-[#FEE2E2]"
        >
          <Trash2 className="h-4 w-4" />
          Delete account
        </button>
      </div>

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#E8E8E4] bg-white p-6">
            <h3 className="text-lg font-semibold text-[var(--text)]">
              Delete account?
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              This cannot be undone. All your sections and profile data will be
              removed.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-[7px] px-4 py-2 text-sm text-[#9B9B93] hover:text-[var(--text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDeleteAccount()}
                className="inline-flex items-center gap-2 rounded-[7px] bg-[#F87171] px-4 py-2 text-sm font-medium text-white hover:bg-[#EF4444] disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Deleting...
                  </>
                ) : (
                  "Delete forever"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
