export type QuickUpdateSuggestion = {
  label: string;
  message: string;
};

export const QUICK_UPDATE_SUGGESTIONS: QuickUpdateSuggestion[] = [
  {
    label: "New project",
    message:
      "I'm working on something new and want my profile to reflect it.",
  },
  {
    label: "New role",
    message: "I changed jobs — here's what's different about what I do now.",
  },
  {
    label: "New priorities",
    message:
      "My goals and focus have shifted. I want my profile to match that.",
  },
];

export const QUICK_UPDATE_COPY = {
  navLabel: "Update",
  pageTitle: "Update profile",
  greetingSubtitle: "Tell Meto what changed — it updates your whole profile.",
  placeholderEmpty: "What's new with you? Or attach a resume, CV, or notes.",
  placeholderActive: "Add a detail, clarify, or attach another file…",
  saveReadyTitle: "Ready to save?",
  saveReadyHint:
    "Meto reviewed all your sections — including goals and what you're building.",
  saveButton: "Save changes",
  savingButton: "Saving…",
  successMessage: "Saved. Every AI now has the latest you.",
  newConversation: "Start over",
} as const;
