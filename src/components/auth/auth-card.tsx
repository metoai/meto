type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div
      className="landing-animate-in w-full max-w-md rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8"
      style={{ boxShadow: "var(--color-card-shadow)" }}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{subtitle}</p>
      </div>
      {children}
      <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
        {footer}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]";

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
      <label htmlFor={id} className="mb-1.5 block text-sm text-[var(--color-muted)]">
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
      className="w-full rounded-full bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)] disabled:opacity-50"
    >
      {children}
    </button>
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
      className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] disabled:opacity-50"
    >
      Continue with Google
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="text-xs text-[var(--color-muted)]">or</span>
      <div className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}
