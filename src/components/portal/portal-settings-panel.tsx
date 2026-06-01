"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePortalData } from "@/components/portal/portal-data-context";
import { createClient } from "@/lib/supabase/client";

const labelClass = "mb-[5px] block text-[13px] font-medium text-[#1A1A18]";
const inputClass =
  "w-full rounded-lg border border-[#E8E8E4] px-3 py-[9px] text-sm text-[#1A1A18] outline-none transition-[border-color] duration-150 focus:border-[#0F6E56]";

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
    setUsername(profile.username?.trim() ?? "");
  }, [loaded, profile]);

  const isDirty =
    Boolean(profile) &&
    (displayName !== (profile?.display_name ?? "") ||
      username !== (profile?.username?.trim() ?? "") ||
      password.trim() !== "");

  const profileUsername = profile?.username?.trim() ?? "";

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
      setUsername(data.profile.username?.trim() ?? "");
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
      <div className="flex w-full flex-col items-start gap-10 lg:flex-row">
        <div className="w-full min-w-0 max-w-[480px] flex-1 space-y-3">
          <div className="skeleton h-56 rounded-lg" />
          <div className="skeleton h-28 rounded-lg" />
        </div>
        <div className="skeleton h-64 w-full shrink-0 rounded-xl lg:w-[280px]" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-10 lg:flex-row">
      <div className="min-w-0 max-w-[480px] flex-1">
        {error ? (
          <p
            className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {success ? (
          <p
            className="mb-4 rounded-lg border border-[#C0E0D8] bg-[#E8F5F0] px-4 py-3 text-sm text-[#0F6E56]"
            role="status"
          >
            {success}
          </p>
        ) : null}

        <form onSubmit={handleSave}>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C0C0B8]">
            Profile
          </p>

          <div className="flex flex-col gap-3.5">
            <div>
              <label htmlFor="settings-email" className={labelClass}>
                Email
              </label>
              <input
                id="settings-email"
                name="email"
                value={email}
                readOnly
                disabled
                autoComplete="email"
                className={`${inputClass} cursor-not-allowed bg-[#F7F7F5] text-[#9B9B93] focus:border-[#E8E8E4]`}
              />
              <p className="mt-1 text-[11px] text-[#C0C0B8]">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="settings-display-name" className={labelClass}>
                Display name
              </label>
              <input
                id="settings-display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="settings-username" className={labelClass}>
                Username
              </label>
              <div className="flex overflow-hidden rounded-lg border border-[#E8E8E4] focus-within:border-[#0F6E56]">
                <span className="shrink-0 select-none whitespace-nowrap border-r border-[#E8E8E4] bg-[#F7F7F5] px-3 py-[9px] text-sm text-[#9B9B93]">
                  meto.ai/profile/
                </span>
                <input
                  id="settings-username"
                  name="meto-profile-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  autoComplete="off"
                  className="min-w-0 flex-1 border-none bg-white px-3 py-[9px] text-sm text-[#1A1A18] outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="settings-password" className={labelClass}>
                New password
              </label>
              <input
                id="settings-password"
                name="settings-new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !isDirty}
            className="mt-1.5 inline-flex items-center gap-2 rounded-lg bg-[#0F6E56] px-5 py-[9px] text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1D9E75] disabled:opacity-50"
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

        <div className="mt-8 border-t border-[#E8E8E4] pt-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F87171]">
            Danger zone
          </p>
          <p className="mb-3.5 text-[13px] text-[#6B6B63]">
            Permanently delete your account and all profile data.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center rounded-lg border border-[#FCA5A5] bg-white px-4 py-2 text-[13px] font-medium text-[#EF4444] transition-all duration-150 hover:border-[#EF4444] hover:bg-[#FEF2F2]"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.75} />
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

      <aside className="w-full shrink-0 rounded-xl border border-[#E8E8E4] bg-[#F7F7F5] p-5 lg:w-[280px]">
        <p className="mb-1.5 text-[13px] font-medium text-[#1A1A18]">
          Your public profile
        </p>
        <p className="mb-3.5 text-xs leading-relaxed text-[#6B6B63]">
          Your profile is visible at your Meto link. Anyone — or any AI — can read
          the sections you&apos;ve marked public.
        </p>

        {profileUsername ? (
          <Link
            href={`/profile/${profileUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-brand text-xs text-[#0F6E56] hover:text-[#1D9E75]"
          >
            meto.ai/profile/{profileUsername}
          </Link>
        ) : (
          <p className="text-xs text-[#9B9B93]">
            Set a username above to get your link.
          </p>
        )}

        <div className="my-3.5 border-t border-[#E8E8E4]" />

        <p className="mb-1 text-xs font-medium text-[#6B6B63]">Display name</p>
        <p className="text-xs leading-normal text-[#9B9B93]">
          This appears in your sidebar and on your public profile.
        </p>
      </aside>
    </div>
  );
}
