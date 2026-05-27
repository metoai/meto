"use client";

import { ArrowLeft, Loader2, MessageCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MetoLogo } from "@/components/meto-logo";
import { CHAT_OPENING_MESSAGE } from "@/lib/meto-prompts";

type Mode = "choice" | "brain-dump" | "chat";
type ChatMessage = { role: "user" | "assistant"; content: string };

const FIRST_MESSAGE: ChatMessage = {
  role: "assistant",
  content: CHAT_OPENING_MESSAGE,
};

export function OnboardingFlow() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choice");
  const [rawText, setRawText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([FIRST_MESSAGE]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function finishOnboarding() {
    router.push("/dashboard?ready=1");
    router.refresh();
  }

  async function handleBrainDump(e: React.FormEvent) {
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
        throw new Error(data.error ?? "Something went wrong.");
      }

      await finishOnboarding();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function sendChatMessage(content: string) {
    const userMessage: ChatMessage = { role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setChatInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Chat failed.");
      }

      if (data.done) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.reply ||
              "I think I have enough! Let me build your profile.",
          },
        ]);

        const finishRes = await fetch("/api/onboarding/finish-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });
        const finishData = await finishRes.json();

        if (!finishRes.ok) {
          throw new Error(finishData.error ?? "Failed to build profile.");
        }

        await finishOnboarding();
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;
    sendChatMessage(chatInput.trim());
  }

  if (mode === "choice") {
    return (
      <div className="flex min-h-screen flex-col bg-brand-background">
        <header className="px-6 py-5">
          <MetoLogo />
        </header>

        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-16">
          <h1 className="text-balance text-center text-3xl font-medium tracking-tight text-brand-text md:text-4xl">
            How do you want to build your profile?
          </h1>
          <p className="mt-3 text-center text-sm text-brand-text-muted">
            Both paths get you the same result. Pick what feels natural.
          </p>

          <p className="mt-4 text-center">
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                await fetch("/api/onboarding/skip", { method: "POST" });
                router.push("/dashboard");
                router.refresh();
              }}
              className="text-sm text-brand-text-subtle transition-colors hover:text-brand-primary"
            >
              I&apos;ll fill this in manually →
            </button>
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("brain-dump")}
              className="group rounded-brand-lg border border-brand-border bg-brand-card p-6 text-left transition-colors hover:border-brand-primary"
            >
              <Zap className="mb-4 h-8 w-8 text-brand-primary" />
              <h2 className="text-lg font-medium text-brand-text">Brain dump</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">
                Tell me everything at once. Paste, type, go. I&apos;ll organize
                it.
              </p>
              <span className="mt-5 inline-block text-sm font-medium text-brand-primary group-hover:text-brand-primary-hover">
                Start brain dump →
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("chat")}
              className="group rounded-brand-lg border border-brand-border bg-brand-card p-6 text-left transition-colors hover:border-brand-primary"
            >
              <MessageCircle className="mb-4 h-8 w-8 text-brand-primary" />
              <h2 className="text-lg font-medium text-brand-text">
                Let&apos;s chat
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">
                I&apos;ll ask you questions and build your profile as we talk.
              </p>
              <span className="mt-5 inline-block text-sm font-medium text-brand-primary group-hover:text-brand-primary-hover">
                Start chatting →
              </span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (mode === "brain-dump") {
    return (
      <div className="flex min-h-screen flex-col bg-brand-background">
        <header className="flex items-center gap-4 px-6 py-5">
          <button
            type="button"
            onClick={() => setMode("choice")}
            className="text-brand-text-muted transition-colors hover:text-brand-text"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <MetoLogo href="" />
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16">
          <h1 className="text-2xl font-medium text-brand-text">
            Tell me about yourself
          </h1>
          <p className="mt-2 text-sm text-brand-text-muted">
            Who you are, what you do, your projects, skills, goals — anything
            goes.
          </p>

          <form onSubmit={handleBrainDump} className="mt-8 space-y-4">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={12}
              required
              disabled={loading}
              placeholder="I'm a software engineer based in Addis Ababa. I'm building a SaaS called Meto..."
              className="w-full resize-none rounded-brand-lg border border-brand-border bg-brand-card px-4 py-3 text-sm leading-relaxed text-brand-text outline-none transition-colors focus:border-brand-primary disabled:opacity-50"
            />

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !rawText.trim()}
              className="inline-flex items-center gap-2 rounded-brand-md bg-brand-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Building your profile…" : "Build my profile →"}
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      <header className="flex items-center gap-4 border-b border-brand-border px-6 py-4">
        <button
          type="button"
          onClick={() => setMode("choice")}
          className="text-brand-text-muted transition-colors hover:text-brand-text"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <MetoLogo href="" />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-6">
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-brand-lg px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-brand-primary text-white"
                    : "border border-brand-border bg-brand-card text-brand-text"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-brand-lg border border-brand-border bg-brand-card px-4 py-3 text-sm text-brand-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Meto is thinking…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <p className="mb-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <form
          onSubmit={handleChatSubmit}
          className="flex gap-2 border-t border-brand-border pt-4"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={loading}
            placeholder="Type your answer…"
            className="flex-1 rounded-brand-md border border-brand-border bg-brand-card px-4 py-3 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !chatInput.trim()}
            className="rounded-brand-md bg-brand-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
