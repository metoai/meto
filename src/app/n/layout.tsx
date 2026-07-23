import type { Metadata } from "next";
import { NNav } from "@/components/n/n-nav";
import { NFooter } from "@/components/n/n-footer";

export const metadata: Metadata = {
  title: "Meto — Persistent AI Memory",
  description:
    "Stop starting from zero. Create one AI profile that gives ChatGPT, Claude, Cursor, and every future AI persistent context about your work, preferences, and workflow.",
};

export default function NLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
      <NNav />
      <main>{children}</main>
      <NFooter />
    </div>
  );
}
