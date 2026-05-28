type AuthPageProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthPage({ title, subtitle, children, footer }: AuthPageProps) {
  return (
    <div className="landing-animate-in w-full max-w-[360px]">
      <div className="mb-5 flex justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden>
          <rect width="24" height="24" rx="6" fill="#0F6E56" />
          <path
            d="M8 12h8M13 9l3 3-3 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mb-7 text-center">
        <h1 className="text-[22px] font-semibold text-[var(--text)]">{title}</h1>
        <p className="mt-1.5 text-[13px] text-[var(--muted)]">{subtitle}</p>
      </div>
      {children}
      <div className="mt-5 text-center text-xs text-[var(--placeholder)]">{footer}</div>
    </div>
  );
}

/** @deprecated Use AuthPage — kept for import compatibility */
export const AuthCard = AuthPage;

const inputClass =
  "w-full rounded-[10px] border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--text)] outline-none transition-[border-color] duration-150 placeholder:text-[var(--placeholder)] focus:border-[var(--border-hover)]";

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
      <label htmlFor={id} className="mb-1.5 block text-sm text-[var(--text-secondary)]">
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
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-[10px] border-none bg-[var(--primary)] px-3 py-[11px] text-sm font-medium text-white transition-[background] duration-150 ease-in-out hover:bg-[var(--primary-hover)] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
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
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] bg-white px-3 py-[11px] text-sm font-medium text-[var(--text)] transition-[border-color] duration-150 ease-in-out hover:border-[var(--border-hover)] disabled:opacity-50"
    >
      <GoogleLogo />
      Continue with Google
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--border)]" />
      <span className="text-xs text-[var(--muted)]">or</span>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}
