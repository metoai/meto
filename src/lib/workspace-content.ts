export const WORKSPACE_COPY = {
  bannerTitle: "One link. Every AI.",
  bannerBody:
    "Your Meto link is you — portable context you can paste into ChatGPT, Claude, Gemini, or any AI. It reads only the sections you choose below, so every conversation starts with the real you.",
  steps: [
    { label: "Choose", detail: "Pick what to share" },
    { label: "Copy", detail: "Grab your link" },
    { label: "Paste", detail: "Drop it in any AI" },
  ],
  linkLabel: "Your Meto link",
  copyLink: "Copy link",
  copiedLink: "Copied ✓",
  copyTextInstead: "Copy as text instead",
  copiedContext: "Copied ✓",
  copyContext: "Copy context",
  previewLabel: "Preview — what AI will read",
  emptySelectionTitle: "Choose what to share",
  emptySelectionBody:
    "Pick a scenario or toggle sections on the right. Your link and preview appear here.",
  noUsername:
    "Claim a username in Settings to get your personal link.",
  noPublicInSelection:
    "Private sections won’t appear in your link. Make them public in Your profile, or pick public sections only.",
  sectionPickerLabel: "What AI should read",
} as const;
