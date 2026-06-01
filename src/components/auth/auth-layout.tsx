type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[var(--text)]">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
