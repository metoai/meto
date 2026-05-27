"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const QUICK_PROMPTS = [
  "Started a new project",
  "Changed jobs",
  "Updated my goals",
];

function createId() {
  return crypto.randomUUID();
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M12 19V5M12 5l-5 5M12 5l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type UpdateContextCardProps = {
  embedded?: boolean;
  workspace?: boolean;
  onApplied?: () => void;
};

export function UpdateContextCard({
  embedded = false,
  workspace = false,
  onApplied,
}: UpdateContextCardProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<Record<
    string,
    string
  > | null>(null);
  const [applied, setApplied] = useState(false);

  const chatStarted = messages.length > 0;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatStarted) scrollToBottom();
  }, [messages, typing, chatStarted, scrollToBottom]);

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || typing) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);
    setError(null);
    setPendingUpdates(null);
    setApplied(false);

    try {
      const res = await fetch("/api/profile/update-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content: text }) => ({
            role,
            content: text,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Update failed.");
      }

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: data.reply,
        },
      ]);

      if (data.done && data.updates && Object.keys(data.updates).length > 0) {
        setPendingUpdates(data.updates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setTyping(false);
    }
  }

  async function handleApply() {
    if (!pendingUpdates || applying) return;
    setApplying(true);
    setError(null);

    try {
      const res = await fetch("/api/profile/update-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply: true, updates: pendingUpdates }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to apply updates.");
      }

      setApplied(true);
      setPendingUpdates(null);
      setMessages([]);
      onApplied?.();
      setTimeout(() => setApplied(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply.");
    } finally {
      setApplying(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  const isCompact = embedded && workspace;

  const content = (
    <>
      <div className={isCompact ? "mb-3" : "mb-3"}>
        {isCompact ? (
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Quick update
          </p>
        ) : embedded ? (
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            Quick update
          </h3>
        ) : (
          <>
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Quick update
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              Share what&apos;s new — Meto merges it into your profile.
            </p>
          </>
        )}
        {embedded && !isCompact ? (
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            Meto merges changes into your profile sections.
          </p>
        ) : null}
      </div>

      {applied ? (
        <p
          className="mb-4 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-3 text-sm text-[var(--color-accent)]"
          role="status"
        >
          Profile updated ✓
        </p>
      ) : null}

      {chatStarted ? (
        <div
          className={`landing-scrollbar-hidden mb-3 max-h-36 overflow-y-auto rounded-xl px-3 py-2 ${
            isCompact
              ? "bg-[var(--color-bg)]/60"
              : "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 px-4 py-3"
          }`}
        >
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "text-right" : "text-left"}
              >
                {message.role === "assistant" ? (
                  <p className="mb-0.5 text-xs font-medium text-[var(--color-accent)]">
                    Meto
                  </p>
                ) : null}
                <p
                  className={`inline-block max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-2xl rounded-br-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)]"
                      : "text-[var(--color-text)]/85"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {typing ? (
              <div className="flex gap-1 py-1">
                <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mb-3 text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      {!chatStarted ? (
        <div className={`flex flex-wrap gap-2 ${isCompact ? "mb-3" : "mb-4"}`}>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setInput(prompt)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors duration-150 ${
                isCompact
                  ? "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="What's new? A new project, role change, goal…"
          disabled={typing || applying}
          className={`w-full resize-none rounded-xl px-4 py-3 text-sm leading-relaxed outline-none transition-colors duration-150 ${
            isCompact
              ? "border border-[var(--color-border)] bg-[var(--color-bg)]/50 text-[var(--color-text)] placeholder:text-[var(--color-muted)]/80 focus:border-[var(--color-accent)]"
              : "border border-[var(--color-border)] bg-[var(--color-bg)]/50 text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
          }`}
        />
        <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
          {pendingUpdates ? (
            <button
              type="button"
              disabled={applying}
              onClick={() => void handleApply()}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent)] disabled:opacity-50"
            >
              {applying ? "Applying…" : "Apply to profile"}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={!input.trim() || typing || applying}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors duration-150 disabled:opacity-30 ${
              isCompact
                ? "bg-[var(--color-primary)] hover:bg-[var(--color-accent)]"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-accent)]"
            }`}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </>
  );

  if (embedded) {
    return <div>{content}</div>;
  }

  return (
    <section
      id="workspace"
      className="scroll-mt-16 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-5"
      style={{ boxShadow: "var(--color-card-shadow)" }}
    >
      {content}
    </section>
  );
}
