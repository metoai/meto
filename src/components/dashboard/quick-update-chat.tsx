"use client";

import { FormEvent, KeyboardEvent } from "react";
import {
  ArrowUp,
  Briefcase,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import {
  isAssistantReplying,
  LandingTypingDots,
} from "@/components/landing/landing-chat-ui";
import { MetoChatAvatar, MetoMark } from "@/components/meto-mark";
import { MetoChatInput } from "@/components/meto-chat-input";
import { UpdateChatAttachments } from "@/components/update-chat-attachments";
import type { QuickUpdateMessage } from "@/hooks/use-quick-update-chat";
import { friendlySectionTitle } from "@/lib/section-display";
import {
  QUICK_UPDATE_COPY,
  QUICK_UPDATE_SUGGESTIONS,
} from "@/lib/quick-update-content";
import { useQuickUpdateChat } from "@/hooks/use-quick-update-chat";
import type { GapFixIntent } from "@/lib/context-score-actions";
import { formatUpdateTime } from "@/lib/update-history";

type QuickUpdateChatProps = {
  variant?: "full" | "compact" | "card";
  displayName?: string;
  onApplied?: (result: {
    mode: "single" | "all";
    finishedAll: boolean;
  }) => void;
  gapFix?: GapFixIntent | null;
};

const SUGGESTION_ICONS = [Sparkles, Briefcase, Target] as const;

const CHAT_COLUMN = "mx-auto w-full max-w-[680px]";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatAttachmentSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UserMessageContent({ message }: { message: QuickUpdateMessage }) {
  return (
    <div className="max-w-[85%] rounded-2xl bg-[var(--surface)] px-4 py-3 text-[15px] leading-[1.65] text-[var(--text)]">
      {message.attachments?.length ? (
        <ul className="mb-2 space-y-1">
          {message.attachments.map((file) => (
            <li
              key={file.name}
              className="text-xs text-[var(--text-secondary)]"
            >
              📎 {file.name} · {formatAttachmentSize(file.size)}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  );
}

export function QuickUpdateChat({
  variant = "card",
  displayName,
  onApplied,
  gapFix = null,
}: QuickUpdateChatProps) {
  const chat = useQuickUpdateChat(onApplied, gapFix);
  const isFull = variant === "full";
  const isCompact = variant === "compact";
  const firstName = displayName?.split(" ")[0] || "there";
  const copy = QUICK_UPDATE_COPY;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void chat.sendMessage(chat.input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void chat.sendMessage(chat.input);
    }
  }

  const inputPlaceholder = chat.chatStarted
    ? copy.placeholderActive
    : copy.placeholderEmpty;

  const inputBusy = chat.typing || chat.applying || chat.ingesting;
  const canSend = Boolean(chat.input.trim() || chat.attachments.length);

  const attachmentsPanel = (
    <UpdateChatAttachments
      attachments={chat.attachments}
      onAdd={chat.addAttachments}
      onRemove={chat.removeAttachment}
      importMode={chat.importMode}
      onImportModeChange={chat.setImportMode}
      disabled={inputBusy}
      compact={isCompact}
    />
  );

  if (isFull) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[var(--bg)]">
        <div className="landing-scrollbar-hidden flex min-h-0 flex-1 flex-col justify-end overflow-y-auto">
          <div className={`w-full px-4 py-6 md:px-6 ${CHAT_COLUMN}`}>
            {chat.applied ? (
              <div
                className="mb-4 rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-4 py-3 text-sm text-[var(--primary)]"
                role="status"
              >
                {copy.successMessage}
              </div>
            ) : null}

            {chat.gapFixPaused && chat.remainingGaps.length ? (
              <div className="flex flex-1 flex-col items-center justify-center py-12">
                <div className="w-full rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-5 py-5 text-center">
                  <p className="text-sm font-medium text-[var(--primary)]">
                    Saved — that gap is closed.
                  </p>
                  <p className="mt-2 text-sm text-[var(--text)]">
                    {chat.remainingGaps.length} more gap
                    {chat.remainingGaps.length === 1 ? "" : "s"} to fix. Keep
                    going?
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Next up: {chat.remainingGaps[0]?.title}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={chat.continueNextGap}
                      className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
                    >
                      Fix next gap
                    </button>
                    <button
                      type="button"
                      onClick={chat.finishGapFixFlow}
                      className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"
                    >
                      Back to workspace
                    </button>
                  </div>
                </div>
              </div>
            ) : !chat.chatStarted && !(gapFix && chat.gapFixBootstrapping) ? (
              <div className="flex flex-1 flex-col items-center justify-center py-8 md:py-16">
                <div className="mb-10 text-center">
                  <div className="mb-5 flex justify-center">
                    <MetoMark size="2xl" />
                  </div>
                  <h1 className="text-[28px] font-medium tracking-tight text-[var(--text)] md:text-[32px]">
                    {getGreeting()}, {firstName}
                  </h1>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
                    {copy.greetingSubtitle}
                  </p>
                </div>

                <div className="w-full">
                  <MetoChatInput
                    input={chat.input}
                    onChange={chat.setInput}
                    onKeyDown={handleKeyDown}
                    onSubmit={handleSubmit}
                    textareaRef={chat.textareaRef}
                    disabled={inputBusy}
                    canSend={canSend}
                    placeholder="What's changed? e.g. 'Started a new job at Stripe'"
                    large
                    attachmentsSlot={attachmentsPanel}
                    footerHint={
                      chat.ingesting
                        ? "Reading your files…"
                        : "Meto updates every section that needs it"
                    }
                  />

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {QUICK_UPDATE_SUGGESTIONS.map((suggestion, index) => {
                      const Icon = SUGGESTION_ICONS[index] ?? Sparkles;
                      return (
                        <button
                          key={suggestion.label}
                          type="button"
                          onClick={() => void chat.sendMessage(suggestion.message)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--card)] px-4 py-2 text-[13px] text-[var(--text-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 hover:border-black/[0.14] hover:text-[var(--text)]"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                          {suggestion.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {chat.updateHistory.length > 0 ? (
                  <div className="mt-14 w-full">
                    <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
                      Recent updates
                    </p>
                    <div className="space-y-2">
                      {chat.updateHistory.slice(0, 3).map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] px-4 py-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm text-[var(--text)]">{entry.message}</p>
                            <span className="shrink-0 text-xs text-[var(--muted)]">
                              {formatUpdateTime(entry.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">
                            Updated{" "}
                            {entry.sections
                              .map((s) => friendlySectionTitle(s))
                              .join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {chat.error ? (
                  <p className="mt-4 text-center text-sm text-[#F87171]" role="alert">
                    {chat.error}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-6 py-4 pb-6">
                {gapFix ? (
                  <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-4 py-3">
                    <p className="text-xs font-medium text-[var(--primary)]">
                      {gapFix.mode === "all"
                        ? `Fix all · ${gapFix.queueIndex + 1}/${gapFix.totalCount}: ${gapFix.title}`
                        : `Fixing: ${gapFix.title}`}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                      Answer below — Meto already knows what&apos;s missing.
                    </p>
                  </div>
                ) : null}
                {chat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "flex justify-end"
                        : "flex gap-3"
                    }
                  >
                    {message.role === "assistant" ? (
                      <>
                        <MetoChatAvatar compact />
                        <div className="min-w-0 flex-1">
                          {message.content ? (
                            <p className="whitespace-pre-wrap text-[15px] leading-[1.65] text-[var(--text)]">
                              {message.content}
                            </p>
                          ) : null}
                          {isAssistantReplying(
                            chat.typing || chat.gapFixBootstrapping,
                            chat.messages,
                            message
                          ) ? (
                            <LandingTypingDots />
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <UserMessageContent message={message} />
                    )}
                  </div>
                ))}
                <div ref={chat.messagesEndRef} />
              </div>
            )}

            {chat.chatStarted && chat.error ? (
              <p className="pb-4 text-sm text-[#F87171]" role="alert">
                {chat.error}
              </p>
            ) : null}
          </div>
        </div>

        {chat.chatStarted || (gapFix && chat.gapFixBootstrapping) ? (
          <div className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg)] px-4 pb-5 pt-3 md:px-6">
            <div className={CHAT_COLUMN}>
              {chat.pendingUpdates ? (
                <div className="mb-3 rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--text)]">
                        {copy.saveReadyTitle}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        {Object.keys(chat.pendingUpdates)
                          .map((key) => friendlySectionTitle(key))
                          .join(" · ")}
                      </p>
                      <div className="mt-2 space-y-2">
                        {Object.entries(chat.pendingUpdates).map(([key, value]) => (
                          <div key={key} className="rounded-lg bg-[var(--card)]/60 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--muted)]">
                              {friendlySectionTitle(key)}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[var(--text)]">
                              <span className="rounded bg-[#DCFCE7] px-1 py-0.5">
                                {value.slice(0, 200)}
                                {value.length > 200 ? "…" : ""}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-[11px] text-[var(--muted)]">
                        {copy.saveReadyHint}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={chat.applying}
                      onClick={() => void chat.handleApply()}
                      className="shrink-0 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-50"
                    >
                      {chat.applying ? copy.savingButton : copy.saveButton}
                    </button>
                  </div>
                </div>
              ) : chat.lastApplied ? (
                <div className="mb-3 rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-4 py-3" role="status">
                  <p className="text-sm text-[var(--primary)]">{copy.successMessage}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Updated{" "}
                    {chat.lastApplied.sections
                      .map((s) => friendlySectionTitle(s))
                      .join(", ")}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {Object.entries(chat.lastApplied.preview).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-[var(--muted)]">{friendlySectionTitle(key)}: </span>
                        <span className="rounded bg-[#DCFCE7] px-1 text-[var(--text)]">
                          {value.slice(0, 120)}
                          {value.length > 120 ? "…" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <MetoChatInput
                input={chat.input}
                onChange={chat.setInput}
                onKeyDown={handleKeyDown}
                onSubmit={handleSubmit}
                textareaRef={chat.textareaRef}
                disabled={inputBusy || chat.gapFixBootstrapping}
                canSend={canSend}
                placeholder={inputPlaceholder}
                attachmentsSlot={attachmentsPanel}
                footerHint={
                  chat.ingesting
                    ? "Reading your files…"
                    : "Meto updates every section that needs it"
                }
              />

              <button
                type="button"
                onClick={chat.resetChat}
                className="mx-auto mt-2 flex items-center gap-1 text-xs text-[var(--placeholder)] transition-colors duration-150 hover:text-[var(--muted)]"
              >
                <RotateCcw className="h-3 w-3" />
                {copy.newConversation}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const maxMessageHeight = isCompact ? "max-h-36" : "max-h-48";

  return (
    <div>
      {!isCompact ? (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">
            {copy.pageTitle}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {copy.greetingSubtitle}
          </p>
        </div>
      ) : (
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {copy.navLabel}
        </p>
      )}

      {chat.applied ? (
        <p
          className="mb-4 rounded-[10px] border border-[var(--accent-border)] bg-[var(--primary-light)] px-4 py-3 text-sm text-[var(--primary)]"
          role="status"
        >
          {copy.successMessage}
        </p>
      ) : null}

      {chat.chatStarted ? (
        <div
          className={`landing-scrollbar-hidden mb-3 ${maxMessageHeight} overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3`}
        >
          <div className="space-y-3">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "text-right" : "text-left"}
              >
                {message.role === "assistant" ? (
                  <p className="mb-0.5 text-xs font-medium text-[var(--primary)]">
                    Meto
                  </p>
                ) : null}
                {message.role === "user" ? (
                  <div className="inline-block max-w-[90%] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm leading-relaxed text-[var(--text)]">
                    {message.attachments?.length ? (
                      <ul className="mb-1.5 space-y-0.5">
                        {message.attachments.map((file) => (
                          <li
                            key={file.name}
                            className="text-[11px] text-[var(--text-secondary)]"
                          >
                            📎 {file.name}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ) : (
                  <>
                    {message.content ? (
                      <p className="inline-block max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">
                        {message.content}
                      </p>
                    ) : null}
                    {isAssistantReplying(chat.typing, chat.messages, message) ? (
                      <LandingTypingDots />
                    ) : null}
                  </>
                )}
              </div>
            ))}
            <div ref={chat.messagesEndRef} />
          </div>
        </div>
      ) : null}

      {chat.error ? (
        <p className="mb-3 text-sm text-[#F87171]" role="alert">
          {chat.error}
        </p>
      ) : null}

      {!chat.chatStarted ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_UPDATE_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => chat.setInput(suggestion.message)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border-hover)]"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <textarea
          ref={chat.textareaRef}
          value={chat.input}
          onChange={(e) => chat.setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder={copy.placeholderEmpty}
          disabled={inputBusy}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--placeholder)] focus:border-[var(--border-hover)]"
        />
        <div className="mt-2">{attachmentsPanel}</div>
        <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
          {chat.pendingUpdates ? (
            <button
              type="button"
              disabled={chat.applying}
              onClick={() => void chat.handleApply()}
              className="rounded-lg bg-[var(--primary)] px-4 py-1.5 text-xs font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-50"
            >
              {chat.applying ? copy.savingButton : copy.saveButton}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={!canSend || inputBusy}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
