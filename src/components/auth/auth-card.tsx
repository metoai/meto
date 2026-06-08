import Link from "next/link";
import type { ReactNode } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";

type AuthPageProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthPage({ title, subtitle, children, footer }: AuthPageProps) {
  return (
    <div className="landing-animate-in mx-auto w-full max-w-[420px]">
      <div className="mb-8">
        <MetoMarkBadge size="sm" className="mb-5" />
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-[2rem]">
          {title}
        </h1>
        <p className="mt-2 max-w-[360px] text-[14px] leading-[1.6] text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </div>

      <div>{children}</div>

      <p className="mt-8 text-center text-[13px] text-[var(--text-secondary)]">{footer}</p>
    </div>
  );
}

/** @deprecated Use AuthPage */
export const AuthCard = AuthPage;

export function AuthBrandMark() {
  return (
    <Link href="/" className="inline-flex transition-opacity hover:opacity-80" aria-label="Back to home">
      <MetoMarkBadge size="auth" />
    </Link>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] text-[var(--text)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--placeholder)] focus:border-[var(--accent-border)] focus:shadow-[0_0_0_3px_rgba(255,77,0,0.08)]";

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[var(--text)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function AuthPrimaryButton({
  children,
  disabled,
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center justify-center rounded-xl border-none bg-[var(--text)] px-4 py-3 text-[14px] font-medium text-[var(--bg)] shadow-[var(--shadow-sm)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthGoogleButton({
  onClick,
  disabled,
  compact = false,
}: {
  onClick: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Continue with Google"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-[border-color,background-color] duration-150 hover:border-[var(--border-hover)] disabled:opacity-50"
      >
        <GoogleLogo />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[14px] font-medium text-[var(--text)] transition-[border-color,background-color] duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface)] disabled:opacity-50"
    >
      <GoogleLogo />
      Continue with Google
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 py-6">
      <div className="h-px flex-1 bg-[var(--border)]" />
      <span className="text-[12px] text-[var(--muted)]">or continue with</span>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}

export function AuthSocialRow({
  onGoogle,
  disabled,
}: {
  onGoogle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-center gap-3">
      <AuthGoogleButton onClick={onGoogle} disabled={disabled} compact />
    </div>
  );
}
