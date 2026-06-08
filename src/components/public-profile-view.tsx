import Link from "next/link";
import { LandingPageFooter } from "@/components/landing/landing-page-footer";
import { MetoLogo } from "@/components/meto-logo";
import { PublicProfileShareCard } from "@/components/public-profile-share-card";
import { sectionEmoji } from "@/lib/context-share/config";
import type { PublicProfile } from "@/lib/public-profile";
import { buildProfileShareClipboard } from "@/lib/profile-share";
import { getPublicContextApiUrl, getPublicProfileUrl } from "@/lib/site";

type PublicProfileViewProps = {
  profile: PublicProfile;
};

function profileInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PublicProfileView({ profile }: PublicProfileViewProps) {
  const profileUrl = getPublicProfileUrl(profile.username);
  const contextUrl = getPublicContextApiUrl(profile.username);
  const shareClipboard = buildProfileShareClipboard(contextUrl);
  const initials = profileInitials(profile.name);
  const tagline =
    profile.headline?.trim() ||
    profile.bio?.split("\n").find((line) => line.trim())?.trim() ||
    profile.aiSummary;
  const visibleSkills = profile.skills.slice(0, 10);
  const extraSkills = profile.skills.length - visibleSkills.length;

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="landing-hero-bg" aria-hidden />

      <header className="relative z-10 border-b border-[var(--border-subtle)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <MetoLogo size="lg" />
          <Link
            href="/auth/signup"
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            Build yours free
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="landing-panel brand-spot overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-xl font-semibold text-white shadow-[0_8px_24px_rgba(255,77,0,0.25)]"
              aria-hidden
            >
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                initials || profile.username.slice(0, 2).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-mono-brand text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
                @{profile.username}
              </p>
              <h1 className="mt-1 text-[28px] font-medium tracking-[-0.03em] text-[var(--text)] sm:text-[32px]">
                {profile.name}
              </h1>
              {tagline ? (
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {tagline}
                </p>
              ) : null}
            </div>
          </div>

          {visibleSkills.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className="landing-chip rounded-full text-[12px] text-[var(--text-secondary)]"
                >
                  {skill}
                </span>
              ))}
              {extraSkills > 0 ? (
                <span className="landing-chip rounded-full text-[12px] text-[var(--muted)]">
                  +{extraSkills} more
                </span>
              ) : null}
            </div>
          ) : null}

          {profile.links.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.links.slice(0, 4).map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="landing-hover-link inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--elevated)]"
                >
                  {link.label}
                  <ExternalLinkIcon />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {!profile.hasPublicContent ? (
          <div className="landing-panel mt-6 p-10 text-center">
            <p className="text-[15px] text-[var(--text-secondary)]">
              This profile hasn&apos;t shared anything publicly yet.
            </p>
            <Link
              href="/auth/signup"
              className="mt-6 inline-flex rounded-full bg-[var(--primary)] px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              Create your Meto profile
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {profile.sections.map((section) => (
              <article
                key={section.section_type}
                className="landing-panel p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-base"
                    aria-hidden
                  >
                    {sectionEmoji(section.section_type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-medium text-[var(--text)]">
                      {section.title}
                    </h2>
                    <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.7] text-[var(--text-secondary)]">
                      {section.content}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <PublicProfileShareCard
              shareText={shareClipboard}
              username={profile.username}
            />
          </div>
        )}
      </main>

      <LandingPageFooter />

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
