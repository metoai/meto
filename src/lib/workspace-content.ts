export const WORKSPACE_COPY = {
  bannerTitle: "One link. Every AI.",
  bannerBody:
    "Public sections become a link any AI can read. Private sections stay yours — paste them as text when you need to.",
  steps: [
    { label: "Choose", detail: "Pick sections & scenario" },
    { label: "Copy", detail: "Link or formatted text" },
    { label: "Paste", detail: "Drop into any AI chat" },
  ],
  linkLabel: "Public link",
  linkSublabel: "Only public sections — same as your metoai.site profile",
  copyLink: "Copy link",
  copiedLink: "Copied ✓",
  linkHint:
    "Paste your Meto link into ChatGPT, Gemini, Claude, DeepSeek, Grok, Kimi, Qwen, or any AI.",
  copyTextInstead: "Copy full text instead",
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
