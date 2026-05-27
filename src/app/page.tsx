import Link from "next/link";
import { MetoLogo } from "@/components/meto-logo";

const demoContext = `Here is context about the person you're talking to:

## About Me
I'm a solo founder based in Addis Ababa building Meto — a tool so you never have to re-introduce yourself to AI.

## Work
I work across Next.js, Supabase, and Gemini. I move fast and prefer direct communication.

## Goals
Ship an MVP in weeks, get 50 paying users, and build in public on X.`;

const faqs = [
  {
    q: "What is Meto?",
    a: "Meto builds your personal AI identity — a structured profile you paste into ChatGPT, Claude, Gemini, or any AI tool so it already knows who you are.",
  },
  {
    q: "Is it free?",
    a: "Yes. Sign up free, build your profile, copy it anywhere. Pro features like advanced formatting come later.",
  },
  {
    q: "How long does setup take?",
    a: "About 3 minutes. Brain dump everything at once, or chat with Meto and we'll build it for you.",
  },
  {
    q: "Can I share my profile?",
    a: "Yes. Claim a username and get a public page at /profile/yourname that anyone can visit and copy.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <MetoLogo />
        <Link
          href="/auth/login"
          className="text-sm text-brand-text-muted transition-colors hover:text-brand-primary"
        >
          Log in
        </Link>
      </header>

      <main>
        <section className="flex flex-col items-center px-6 pb-20 pt-16 text-center md:pt-24">
          <h1 className="text-balance max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
            AI finally knows you.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-text-muted">
            Build your AI identity once. Paste it everywhere.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-brand-md bg-brand-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
            >
              Get started free
            </Link>
            <a
              href="#demo"
              className="rounded-brand-md border border-brand-border px-8 py-3 text-sm font-medium text-brand-text transition-colors hover:border-brand-primary"
            >
              See how it works
            </a>
          </div>
        </section>

        <section id="demo" className="border-t border-brand-border px-6 py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-medium">
              This is what you paste into AI
            </h2>
            <p className="mt-2 text-center text-sm text-brand-text-muted">
              One block. Any tool. No more re-introducing yourself.
            </p>
            <pre className="mt-8 overflow-x-auto rounded-brand-lg border border-brand-border bg-brand-code-bg p-6 font-mono text-sm leading-relaxed text-brand-code-text">
              {demoContext}
            </pre>
          </div>
        </section>

        <section id="features" className="border-t border-brand-border px-6 py-20 md:px-10">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                title: "Two ways in",
                desc: "Brain dump everything at once, or chat with Meto for 3 minutes. Same profile either way.",
              },
              {
                title: "Copy-paste anywhere",
                desc: "One compiled context block for Claude, ChatGPT, Gemini — paste once, skip the intro.",
              },
              {
                title: "Your public page",
                desc: "Share meto.ai/yourname. Put it in your bio. Let AI know you before you even type.",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-brand-lg border border-brand-border bg-brand-card p-6 transition-colors hover:border-brand-primary/40"
              >
                <h2 className="text-base font-medium text-brand-text">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">
                  {feature.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-brand-border px-6 py-20 md:px-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-medium">FAQ</h2>
            <div className="mt-10 space-y-6">
              {faqs.map((faq) => (
                <article
                  key={faq.q}
                  className="rounded-brand-lg border border-brand-border bg-brand-card p-5"
                >
                  <h3 className="font-medium text-brand-text">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">
                    {faq.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-border px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-brand-text-muted md:flex-row">
          <p>© 2025 Meto</p>
          <div className="flex gap-6">
            <a
              href="https://twitter.com/metoai"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-primary"
            >
              Twitter/X
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-primary"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
