"use client";

import { FormEvent, KeyboardEvent } from "react";
import {
  ArrowUp,
  Briefcase,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { MetoMark } from "@/components/meto-mark";
import { friendlySectionTitle } from "@/lib/section-display";
import {
  QUICK_UPDATE_COPY,
  QUICK_UPDATE_SUGGESTIONS,
} from "@/lib/quick-update-content";
import { useQuickUpdateChat } from "@/hooks/use-quick-update-chat";

type QuickUpdateChatProps = {
  variant?: "full" | "compact" | "card";
  displayName?: string;
  onApplied?: () => void;
};

const SUGGESTION_ICONS = [Sparkles, Briefcase, Target] as const;

function MetoAvatar({ className = "h-7 w-7" }: { className?: string }) {
  return <MetoMark className={className} />;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function ChatInputBox({
  input,
  onChange,
  onKeyDown,
  onSubmit,
  textareaRef,
  disabled,
  placeholder,
  large = false,
}: {
  input: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
  placeholder: string;
  large?: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-[border-color] duration-150 focus-within:border-[var(--border-hover)]"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={large ? 2 : 1}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full resize-none bg-transparent px-4 text-sm leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--placeholder)] ${
          large ? "min-h-[72px] pt-4" : "max-h-40 py-3.5"
        }`}
      />
      <div className="flex items-center justify-end px-3 pb-3">
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-40"
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

export function QuickUpdateChat({
  variant = "card",
  displayName,
  onApplied,
}: QuickUpdateChatProps) {
  const chat = useQuickUpdateChat(onApplied);
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

  if (isFull) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[var(--bg)]">
        <div className="landing-scrollbar-hidden min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-4 md:px-6">
            {chat.applied ? (
              <div
                className="mb-4 mt-4 rounded-[10px] border border-[#C0E0D8] bg-[#F0FAF7] px-4 py-3 text-sm text-[var(--primary)]"
                role="status"
              >
                {copy.successMessage}
              </div>
            ) : null}

            {!chat.chatStarted ? (
              <div className="flex flex-1 flex-col items-center justify-center py-10">
                <div className="mb-3 flex items-center gap-2.5">
                  <MetoMark className="h-6 w-6" />
                  <h1 className="text-[26px] font-medium tracking-tight text-[var(--text)]">
                    {getGreeting()}, {firstName}
                  </h1>
                </div>
                <p className="mb-8 text-center text-sm text-[var(--text-secondary)]">
                  {copy.greetingSubtitle}
                </p>

                <div className="w-full">
                  <ChatInputBox
                    input={chat.input}
                    onChange={chat.setInput}
                    onKeyDown={handleKeyDown}
                    onSubmit={handleSubmit}
                    textareaRef={chat.textareaRef}
                    disabled={chat.typing || chat.applying}
                    placeholder={inputPlaceholder}
                    large
                  />

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {QUICK_UPDATE_SUGGESTIONS.map((suggestion, index) => {
                      const Icon = SUGGESTION_ICONS[index] ?? Sparkles;
                      return (
                        <button
                          key={suggestion.label}
                          type="button"
                          onClick={() => void chat.sendMessage(suggestion.message)}
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[13px] text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {suggestion.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {chat.error ? (
                  <p className="mt-4 text-sm text-[#F87171]" role="alert">
                    {chat.error}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-6 py-6 pb-4">
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
                        <MetoAvatar />
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="whitespace-pre-wrap text-[15px] leading-[1.65] text-[var(--text)]">
                            {message.content}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-[var(--surface)] px-4 py-3 text-[15px] leading-[1.65] text-[var(--text)]">
                        {message.content}
                      </div>
                    )}
                  </div>
                ))}
                {chat.typing ? (
                  <div className="flex gap-3">
                    <MetoAvatar />
                    <div className="flex items-center gap-1 py-2">
                      <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                      <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                      <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                    </div>
                  </div>
                ) : null}
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

        {chat.chatStarted ? (
          <div className="shrink-0 bg-[var(--bg)] px-4 pb-4 pt-2 md:px-6">
            <div className="mx-auto w-full max-w-2xl">
              {chat.pendingUpdates ? (
                <div className="mb-3 rounded-[10px] border border-[#C0E0D8] bg-[#F0FAF7] px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">
                        {copy.saveReadyTitle}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        {Object.keys(chat.pendingUpdates)
                          .map((key) => friendlySectionTitle(key))
                          .join(" · ")}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--muted)]">
                        {copy.saveReadyHint}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={chat.applying}
                      onClick={() => void chat.handleApply()}
                      className="shrink-0 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-50"
                    >
                      {chat.applying ? copy.savingButton : copy.saveButton}
                    </button>
                  </div>
                </div>
              ) : null}

              <ChatInputBox
                input={chat.input}
                onChange={chat.setInput}
                onKeyDown={handleKeyDown}
                onSubmit={handleSubmit}
                textareaRef={chat.textareaRef}
                disabled={chat.typing || chat.applying}
                placeholder={inputPlaceholder}
              />

              <button
                type="button"
                onClick={chat.resetChat}
                className="mt-2 flex items-center gap-1 text-xs text-[var(--placeholder)] transition-colors duration-150 hover:text-[var(--muted)]"
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
          className="mb-4 rounded-[10px] border border-[#C0E0D8] bg-[#F0FAF7] px-4 py-3 text-sm text-[var(--primary)]"
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
                <p
                  className={`inline-block max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--text)]"
                      : "text-[var(--text)]"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {chat.typing ? (
              <div className="flex gap-1 py-1">
                <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
              </div>
            ) : null}
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
          disabled={chat.typing || chat.applying}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--placeholder)] focus:border-[var(--border-hover)]"
        />
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
            disabled={!chat.input.trim() || chat.typing || chat.applying}
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
