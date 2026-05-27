import Link from "next/link";
import { ContextBuilder } from "@/components/ContextBuilder";
import { MetoLogo } from "@/components/meto-logo";
import { getSiteUrl, type PublicProfile } from "@/lib/public-profile";

type PublicProfileViewProps = {
  profile: PublicProfile;
};

export function PublicProfileView({ profile }: PublicProfileViewProps) {
  const siteUrl = getSiteUrl();

  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <header className="flex items-center justify-between border-b border-brand-border px-6 py-5 md:px-10">
        <MetoLogo />
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

        {profile.headline ? (
          <p className="mt-3 text-base leading-relaxed text-brand-text-muted">
            {profile.headline}
          </p>
        ) : null}

        {profile.bio ? (
          <p className="mt-4 text-sm leading-relaxed text-brand-text-muted">
            {profile.bio}
          </p>
        ) : null}

        {profile.skills.length > 0 ? (
          <section className="mt-6" aria-label="Skills">
            <h2 className="text-sm font-medium">Skills</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-brand-border bg-brand-card px-3 py-1 text-xs text-brand-text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!profile.hasPublicContent ? (
          <p className="mt-10 rounded-brand-lg border border-dashed border-brand-border p-10 text-center text-brand-text-muted">
            This profile is private.
          </p>
        ) : (
          <>
            <div className="mt-8">
              <ContextBuilder
                sections={profile.sections}
                username={profile.username}
                displayName={profile.name}
                siteUrl={siteUrl}
              />
            </div>

            <div
              className="my-10 border-t border-brand-border"
              aria-hidden
            />

            <div className="space-y-6">
              {profile.sections.map((section) => (
                <article
                  key={section.section_type}
                  className="rounded-brand-lg border border-brand-border bg-brand-card p-5"
                >
                  <h2 className="text-base font-medium">{section.title}</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-text-muted">
                    {section.content}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
