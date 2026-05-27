import Link from "next/link";
import { MetoLogo } from "@/components/meto-logo";

export default function ProfileNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-background px-6 text-center">
      <MetoLogo />
      <h1 className="text-2xl font-medium text-brand-text">Profile not found</h1>
      <p className="text-sm text-brand-text-muted">
        This username doesn&apos;t exist or hasn&apos;t been claimed yet.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm text-brand-primary hover:text-brand-primary-hover"
      >
        Go home
      </Link>
    </div>
  );
}
