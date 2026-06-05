import Link from "next/link";
import { MetoLogo } from "@/components/meto-logo";
import type { PublicProfile } from "@/lib/public-profile";
import {
  getPublicContextApiUrl,
  getPublicContextUrl,
  getPublicProfileUrl,
} from "@/lib/site";

type PublicProfileViewProps = {
  profile: PublicProfile;
};

export function PublicProfileView({ profile }: PublicProfileViewProps) {
  const profileUrl = getPublicProfileUrl(profile.username);
  const contextUrl = getPublicContextApiUrl(profile.username);
  const legacyContextUrl = getPublicContextUrl(profile.username);

  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <header className="flex items-center justify-between border-b border-brand-border px-6 py-5 md:px-10">
        <MetoLogo size="lg" />
        <Link
          href="/auth/signup"
          className="rounded-brand-md bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
        >
          Build yours free
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm text-brand-text-muted">@{profile.username}</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">
          {profile.name}
        </h1>

        {!profile.hasPublicContent ? (
          <p className="mt-10 rounded-brand-lg border border-dashed border-brand-border p-10 text-center text-brand-text-muted">
            This profile hasn&apos;t shared anything publicly yet.
          </p>
        ) : (
          <div className="mt-10 space-y-8">
            {profile.sections.map((section) => (
              <article key={section.section_type}>
                <h2 className="text-lg font-medium">{section.title}</h2>
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-brand-text-muted">
                  {section.content}
                </p>
              </article>
            ))}

            <section
              id="profile-context"
              aria-label="Machine-readable profile context"
              className="rounded-brand-lg border border-brand-border bg-brand-surface p-5"
            >
              <h2 className="text-sm font-medium text-brand-text">
                AI-readable context
              </h2>
              <p className="mt-2 text-sm text-brand-text-muted">
                Paste this into ChatGPT, Claude, or any AI tool — and tell it to{" "}
                <span className="font-medium text-brand-text">
                  open the link and read it
                </span>{" "}
                (plain text, no login):
              </p>
              <a
                href={contextUrl}
                className="mt-2 block break-all text-sm font-medium text-brand-primary hover:underline"
              >
                {contextUrl}
              </a>
              <p className="mt-3 rounded-brand-md border border-brand-border bg-[var(--card)] p-3 text-xs leading-relaxed text-brand-text-muted">
                Tip: AI chat tools sometimes answer from memory instead of
                fetching. Prompt them like this so they read the live page:
                <span className="mt-1 block font-medium text-brand-text">
                  &ldquo;Open this URL and use it as context about me:{" "}
                  {contextUrl}&rdquo;
                </span>
              </p>
              <p className="mt-2 text-xs text-brand-text-muted">
                Alternate:{" "}
                <a href={legacyContextUrl} className="underline">
                  {legacyContextUrl}
                </a>
              </p>
              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-brand-md border border-brand-border bg-[var(--card)] p-4 text-sm leading-relaxed text-brand-text-muted">
                {profile.compiled}
              </pre>
            </section>
          </div>
        )}
      </main>

      {/* Full compiled text in HTML for crawlers and AI browsers. */}
      {profile.hasPublicContent ? (
        <div className="sr-only" aria-hidden="true">
          <a href={profileUrl}>{profileUrl}</a>
          <a href={contextUrl}>{contextUrl}</a>
          <pre>{profile.compiled}</pre>
        </div>
      ) : null}
    </div>
  );
}
