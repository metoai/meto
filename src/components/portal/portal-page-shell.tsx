import type { ReactNode } from "react";

type PortalPageShellProps = {
  children: ReactNode;
  className?: string;
  /** Edge-to-edge layout with minimal padding — for workspace-style pages. */
  flush?: boolean;
};

export function PortalPageShell({
  children,
  className = "",
  flush = false,
}: PortalPageShellProps) {
  return (
    <div
      className={`min-h-0 w-full flex-1 ${
        flush
          ? "flex flex-col overflow-y-auto"
          : "overflow-y-auto"
      } ${className}`}
    >
      <div
        className={
          flush
            ? "flex w-full flex-col px-4 py-4 md:min-h-0 md:flex-1 md:px-5 md:py-5"
            : "w-full px-5 py-6 md:px-8 md:py-7 lg:px-10"
        }
      >
        {children}
      </div>
    </div>
  );
}
