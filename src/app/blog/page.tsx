import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="border-b border-[var(--color-border)] px-6 py-5 sm:px-10">
        <Link href="/" className="text-lg font-semibold text-[var(--color-accent)]">
          ← meto
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="mt-4 text-[var(--color-muted)]">
          Stories about AI identity, product updates, and building in public.
          Coming soon.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent)]"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
