"use client";

import Link from "next/link";
import { Copy } from "lucide-react";
import { useState } from "react";
import { MetoLogo } from "@/components/meto-logo";

type PublicProfileViewProps = {
  displayName: string;
  username: string;
  sections: { title: string; content: string }[];
  compiled: string;
};

export function PublicProfileView({
  displayName,
  username,
  sections,
  compiled,
}: PublicProfileViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!compiled) return;
    await navigator.clipboard.writeText(compiled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        <p className="text-sm text-brand-text-muted">@{username}</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">
          {displayName}
        </h1>

        {sections.length === 0 ? (
          <p className="mt-10 rounded-brand-lg border border-dashed border-brand-border p-10 text-center text-brand-text-muted">
            This profile is private.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-8 inline-flex items-center gap-2 rounded-brand-md bg-brand-primary px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-brand-primary-hover"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy context"}
            </button>

            <div className="mt-6 space-y-6">
              {sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-brand-lg border border-brand-border bg-brand-card p-5"
                >
                  <h2 className="text-base font-medium">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">
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
