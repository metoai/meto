import type { ReactNode } from "react";

type PortalPageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PortalPageShell({
  children,
  className = "",
}: PortalPageShellProps) {
  return (
    <div className={`min-h-0 w-full flex-1 overflow-y-auto ${className}`}>
      <div className="w-full px-5 py-6 md:px-8 md:py-7 lg:px-10">
        {children}
      </div>
    </div>
  );
}
