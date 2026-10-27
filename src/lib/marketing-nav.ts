/** In-page anchors for the landing page hero nav. */
export const LANDING_PAGE_NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Context Score", href: "#context-score" },
  { label: "Share", href: "#share" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const SOLUTIONS_NAV_LINKS = [
  {
    label: "Share Context",
    href: "/solutions/share-context",
    description: "One AI context for Cursor, Claude & Windsurf",
  },
  {
    label: "Sync Rules",
    href: "/solutions/sync-rules",
    description: "Continuous sync for .cursorrules and CLAUDE.md",
  },
  {
    label: "Developer Memory",
    href: "/solutions/ai-developer-memory",
    description: "Persistent ADRs & anti-amnesia context engine",
  },
  {
    label: "Cursor & Claude",
    href: "/for/cursor-and-claude",
    description: "Terminal CLI and visual IDE hybrid workflow",
  },
] as const;

export const MARKETING_NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
] as const;
