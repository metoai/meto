"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  isAssistantReplying,
  LandingTypingDots,
} from "@/components/landing/landing-chat-ui";
import { MetoChatAvatar, MetoMarkBadge } from "@/components/meto-mark";
import { parseUpgradeError } from "@/lib/billing-client";
import { postChatStream } from "@/lib/chat-stream-client";
import { streamPlainTextForDisplay } from "@/lib/stream-prompt";
import { CHAT_OPENING_MESSAGE } from "@/lib/meto-prompts";
import { WorkspaceModePicker } from "@/components/onboarding/workspace-mode-picker";
import type { WorkspaceMode } from "@/lib/workspace-mode";

type Mode = "workspace" | "choice" | "brain-dump" | "chat";
type ChatMessage = { role: "user" | "assistant"; content: string };

const FIRST_MESSAGE: ChatMessage = {
  role: "assistant",
  content: CHAT_OPENING_MESSAGE,
};

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OnboardingHeader({
  onBack,
  showBack,
}: {
  onBack?: () => void;
  showBack?: boolean;
}) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)] px-4 sm:px-8">
      <div className="mx-auto flex max-w-2xl items-center gap-3 py-4">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--surface)] hover:text-[var(--text)]"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
        ) : null}
        <div className="flex items-center gap-2">
          <MetoMarkBadge size="sm" />
          <span className="text-base font-medium text-[var(--text)]">meto</span>
        </div>
      </div>
    </header>
  );
}

function UpgradeNotice({ manualHint }: { manualHint?: string }) {
  return (
    <p className="text-sm text-red-600" role="alert">
      AI onboarding requires Pro.{" "}
      <Link href="/pricing" className="underline underline-offset-2">
        View plans
      </Link>
      {manualHint ? ` — ${manualHint}` : null}
    </p>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("workspace");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode | null>(null);
  const [savingWorkspaceMode, setSavingWorkspaceMode] = useState(false);
  const [rawText, setRawText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([FIRST_MESSAGE]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (mode !== "brain-dump") return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [rawText, mode]);

  async function finishOnboarding() {
    const destination =
      workspaceMode === "developer" ? "/dashboard/projects?ready=1" : "/dashboard?ready=1";
    router.push(destination);
    router.refresh();
  }

  async function handleWorkspaceModeSelect(selected: WorkspaceMode) {
    setSavingWorkspaceMode(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_mode: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save workspace mode.");
      }
      setWorkspaceMode(selected);
      setMode("choice");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSavingWorkspaceMode(false);
    }
  }

  async function handleBrainDump(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/brain-dump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402 || parseUpgradeError(data)) {
          throw new Error("UPGRADE_REQUIRED");
        }
        throw new Error(data.error ?? "Something went wrong.");
      }

      await finishOnboarding();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const upgradeRequired = error === "UPGRADE_REQUIRED";

  async function finishFromChat(nextMessages: ChatMessage[], reply: string) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: reply || "I think I have enough! Let me build your profile.",
      },
    ]);

    const finishRes = await fetch("/api/onboarding/finish-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: nextMessages }),
    });
    const finishData = await finishRes.json();

    if (!finishRes.ok) {
      if (finishRes.status === 402 || parseUpgradeError(finishData)) {
        throw new Error("UPGRADE_REQUIRED");
      }
      throw new Error(finishData.error ?? "Failed to build profile.");
    }

    await finishOnboarding();
  }

  async function sendChatMessage(content: string) {
    const userMessage: ChatMessage = { role: "user", content };
    const priorMessages = messages;
    const nextMessages = [...messages, userMessage];
    const assistantIndex = nextMessages.length;
    setMessages([
      ...nextMessages,
      { role: "assistant", content: "" },
    ]);
    setChatInput("");
    setLoading(true);
    setError(null);

    try {
      let fullReply = "";

      const { stream, data, res } = await postChatStream(
        "/api/onboarding/chat",
        { messages: nextMessages },
        {
          onToken: (_, full) => {
            const visible = streamPlainTextForDisplay(full);
            fullReply = visible;
            setMessages((prev) => {
              const copy = [...prev];
              copy[assistantIndex] = {
                role: "assistant",
                content: visible,
              };
              return copy;
            });
          },
          onEvent: (event) => {
            if (typeof event.reply === "string") {
              fullReply = event.reply;
              setMessages((prev) => {
                const copy = [...prev];
                copy[assistantIndex] = {
                  role: "assistant",
                  content: event.reply as string,
                };
                return copy;
              });
            }
          },
        }
      );

      if (stream) {
        if (typeof data?.reply === "string") fullReply = data.reply;
        const done = Boolean(data?.done || data?.profile_ready);

        if (done) {
          await finishFromChat(nextMessages, fullReply);
          return;
        }

        if (!fullReply.trim()) {
          setMessages((prev) => {
            const copy = [...prev];
            copy[assistantIndex] = {
              role: "assistant",
              content: "Tell me more — what are you working on right now?",
            };
            return copy;
          });
        }
        return;
      }

      if (!res.ok) {
        if (res.status === 402 || parseUpgradeError(data)) {
          throw new Error("UPGRADE_REQUIRED");
        }
        throw new Error(
          typeof data?.error === "string" ? data.error : "Chat failed."
        );
      }

      const json = data as { reply?: string; done?: boolean };

      if (json.done) {
        await finishFromChat(nextMessages, json.reply ?? "");
        return;
      }

      setMessages((prev) => {
        const copy = [...prev];
        copy[assistantIndex] = {
          role: "assistant",
          content: json.reply ?? "",
        };
        return copy;
      });
    } catch (err) {
      setMessages(priorMessages);
      setChatInput(content);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;
    void sendChatMessage(chatInput.trim());
  }

  function handleChatKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!chatInput.trim() || loading) return;
      void sendChatMessage(chatInput.trim());
    }
  }

  if (mode === "workspace") {
    return (
      <div className="min-h-screen text-[var(--text)]">
        <OnboardingHeader />
        <WorkspaceModePicker
          onSelect={handleWorkspaceModeSelect}
          saving={savingWorkspaceMode}
        />
        {error ? (
          <p className="pb-8 text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (mode === "choice") {
    return (
      <div className="min-h-screen text-[var(--text)]">
        <OnboardingHeader />

        <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
          <div className="landing-animate-in text-center">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              Get started
            </p>
            <h1 className="text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.5px] sm:text-[34px]">
              How do you want to build your profile?
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              Both paths get you the same result. Pick what feels natural.
            </p>
          </div>

          <div className="landing-animate-in mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("brain-dump")}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-left transition-[border-color,background] duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface)]"
              style={{ animationDelay: "0.06s" }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[var(--muted)]">
                Fast
              </p>
              <h2 className="mt-2 text-base font-medium text-[var(--text)]">
                Brain dump
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                Paste or type everything at once. Meto organizes it for you.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode("chat")}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-left transition-[border-color,background] duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface)]"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[var(--muted)]">
                Guided
              </p>
              <h2 className="mt-2 text-base font-medium text-[var(--text)]">
                Let&apos;s chat
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                Answer a few questions and build your profile as you go.
              </p>
            </button>
          </div>

          <p className="landing-animate-in mt-8 text-center">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await fetch("/api/onboarding/skip", { method: "POST" });
                router.push("/dashboard");
                router.refresh();
              }}
              className="text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)] disabled:opacity-50"
            >
              I&apos;ll fill this in manually
            </button>
          </p>
        </main>
      </div>
    );
  }

  if (mode === "brain-dump") {
    return (
      <div className="min-h-screen text-[var(--text)]">
        <OnboardingHeader showBack onBack={() => setMode("choice")} />

        <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
          <div className="landing-animate-in mb-6">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              Brain dump
            </p>
            <h1 className="text-[24px] font-semibold tracking-[-0.3px] sm:text-[28px]">
              Tell me about yourself
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Who you are, what you do, your projects, skills, goals — anything
              goes.
            </p>
          </div>

          <form
            onSubmit={handleBrainDump}
            className="brand-surface landing-animate-in overflow-hidden rounded-2xl border"
            style={{ animationDelay: "0.06s" }}
          >
            <textarea
              ref={textareaRef}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={10}
              required
              disabled={loading}
              placeholder="I'm a software engineer based in Addis Ababa. I'm building a SaaS called Meto..."
              className="block w-full resize-none bg-transparent px-4 py-4 text-sm leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--placeholder)] disabled:opacity-50"
            />

            <div className="border-t border-[var(--border)] px-4 py-3">
              {error ? (
                <div className="mb-3">
                  {upgradeRequired ? (
                    <UpgradeNotice manualHint="or fill your profile manually from the dashboard" />
                  ) : (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || !rawText.trim()}
                className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-50"
              >
                {loading ? "Building your profile…" : "Build my profile"}
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--card)] text-[var(--text)]">
      <OnboardingHeader showBack onBack={() => setMode("choice")} />

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:px-6">
        <div className="landing-animate-in mb-6 text-center sm:text-left">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            Guided chat
          </p>
          <h1 className="text-[24px] font-semibold tracking-[-0.3px] sm:text-[28px]">
            Let&apos;s build your profile
          </h1>
        </div>

        <div
          className="brand-surface landing-animate-in flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border"
          style={{ animationDelay: "0.06s" }}
        >
          <div className="landing-scrollbar-hidden min-h-[280px] flex-1 overflow-y-auto p-4 sm:min-h-[360px]">
            <div className="space-y-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`landing-animate-message ${
                    message.role === "user" ? "flex justify-end" : "text-left"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="flex max-w-[92%] gap-3">
                      <MetoChatAvatar />
                      <div>
                        <p className="mb-1 text-[11px] font-medium text-[var(--primary)]">
                          Meto
                        </p>
                        {message.content ? (
                          <p className="whitespace-pre-wrap text-sm leading-normal text-[var(--text)]">
                            {message.content}
                          </p>
                        ) : null}
                        {isAssistantReplying(loading, messages, message) ? (
                          <LandingTypingDots />
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <p className="max-w-[85%] whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm leading-normal text-[var(--text)]">
                      {message.content}
                    </p>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-[var(--border)]" />

          {error ? (
            <div className="border-b border-[var(--border)] px-4 py-3">
              {upgradeRequired ? (
                <UpgradeNotice manualHint="or skip to manual fill" />
              ) : (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
          ) : null}

          <form
            onSubmit={handleChatSubmit}
            className="flex items-end gap-3 px-4 py-3"
          >
            <textarea
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleChatKeyDown}
              rows={1}
              disabled={loading}
              placeholder="Answer in your own words…"
              className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent text-sm leading-normal text-[var(--text)] outline-none placeholder:text-[var(--placeholder)] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !chatInput.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white transition-[background] duration-150 ease-in-out hover:bg-[var(--primary-hover)] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
