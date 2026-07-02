export const WORKSPACE_COPY = {
  bannerTitle: "Connect once. Sync everywhere.",
  bannerBody:
    "Use MCP for live context handoffs to Claude and Cursor. Keep copy-paste as a fallback for tools without direct integration.",
  steps: [
    { label: "Choose", detail: "Pick sections & scenario" },
    { label: "Connect", detail: "MCP endpoint + token" },
    { label: "Fallback", detail: "Copy link or formatted text" },
  ],
  linkLabel: "Public link",
  linkSublabel: "Only public sections — same as your metoai.site profile",
  copyLink: "Copy link",
  copiedLink: "Copied ✓",
  linkHint:
    "Use MCP when available. For non-integrated tools, paste your Meto link or text context.",
  copyTextInstead: "Copy full text (fallback)",
  copiedContext: "Copied ✓",
  copyContext: "Copy context",
  previewLabel: "Text preview",
  previewSublabel: "All selected sections — includes private if you picked them",
  emptySelectionTitle: "Choose what to share",
  emptySelectionBody:
    "Pick a scenario, then toggle sections. Public ones go in your link; everything selected goes in text copy.",
  noUsername: "Claim a username in Settings to get your personal link.",
  noPublicInSelection:
    "No public sections selected. Toggle sections public in Profile, or copy as text below.",
  sectionPickerLabel: "Sections",
  sectionPickerHint:
    "Tap a section to include it · toggle public/private here or in Profile",
} as const;
