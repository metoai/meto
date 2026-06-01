import Link from "next/link";
import { MetoLogo } from "@/components/meto-logo";
import type { PublicProfile } from "@/lib/public-profile";

type PublicProfileViewProps = {
  profile: PublicProfile;
};

export function PublicProfileView({ profile }: PublicProfileViewProps) {
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
          </div>
        )}
      </main>
    </div>
  );
}
