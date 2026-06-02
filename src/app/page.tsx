"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProfileAuthModal, type AuthModalMode } from "@/components/auth/profile-auth-modal";
import { LandingAiPartners } from "@/components/landing/landing-ai-partners";
import {
  LandingOpeningMessage,
  LandingProfileProgress,
} from "@/components/landing/landing-chat-ui";
import { MetoMarkBadge } from "@/components/meto-mark";
import {
  EMPTY_COLLECTED,
  hasCollectedContent,
  LANDING_SAVE_PROMPT_AFTER,
  mergeCollected,
  type CollectedProfile,
} from "@/lib/landing-chat";
import { LANDING_HERO } from "@/lib/landing-copy";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "meto_landing_session";
const PENDING_SAVE_KEY = "meto_landing_pending_save";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type LandingSession = {
  sessionId: string;
  messages: ChatMessage[];
  collected: CollectedProfile;
  profileReady: boolean;
};

function createId() {
  return crypto.randomUUID();
}

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

function loadSession(): LandingSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LandingSession;
  } catch {
    return null;
  }
}

function saveSession(session: LandingSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [collected, setCollected] = useState<CollectedProfile>(EMPTY_COLLECTED);
  const [profileReady, setProfileReady] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("gate");
  const [savePromptDismissed, setSavePromptDismissed] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const chatStarted = userMessageCount > 0;
  const shouldOfferSave =
    profileReady ||
    (userMessageCount >= LANDING_SAVE_PROMPT_AFTER &&
      hasCollectedContent(collected));
  const showSavePrompt =
    chatStarted && shouldOfferSave && !savePromptDismissed && !typing;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatStarted) scrollToBottom();
  }, [messages, typing, chatStarted, showSavePrompt, scrollToBottom]);

  useEffect(() => {
    const existing = loadSession();
    if (existing?.sessionId) {
      setSessionId(existing.sessionId);
      setMessages(existing.messages ?? []);
      setCollected(existing.collected ?? EMPTY_COLLECTED);
      setProfileReady(existing.profileReady ?? false);
    } else {
      setSessionId(createId());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    saveSession({ sessionId, messages, collected, profileReady });
  }, [hydrated, sessionId, messages, collected, profileReady]);

  async function handleApplyToProfile() {
    if (saving) return;

    if (!isLoggedIn) {
      localStorage.setItem(PENDING_SAVE_KEY, "true");
      setAuthModalMode("gate");
      setAuthModalOpen(true);
      return;
    }

    await handleSaveProfile();
  }

  function handleKeepChatting() {
    setSavePromptDismissed(true);
  }

  const persistProfile = useCallback(async () => {
    if (!hasCollectedContent(collected)) return false;
    const res = await fetch("/api/onboarding/save-from-landing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collected }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to save profile.");
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PENDING_SAVE_KEY);
    return true;
  }, [collected]);

  const handleSaveProfile = useCallback(async () => {
    if (saving) return;
    try {
      setSaving(true);
      setSaveError(null);
      await persistProfile();
      setAuthModalOpen(false);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  }, [persistProfile, router, saving]);

  useEffect(() => {
    async function bootstrapAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(Boolean(user));
      const pendingSave = localStorage.getItem(PENDING_SAVE_KEY) === "true";
      if (
        user &&
        pendingSave &&
        hasCollectedContent(collected) &&
        (profileReady || userMessageCount >= LANDING_SAVE_PROMPT_AFTER)
      ) {
        try {
          setSaving(true);
          await persistProfile();
          router.push("/dashboard");
          router.refresh();
        } catch (error) {
          console.error(error);
        } finally {
          setSaving(false);
        }
      }
    }
    if (hydrated) bootstrapAuth();
  }, [
    hydrated,
    collected,
    profileReady,
    userMessageCount,
    persistProfile,
    router,
    supabase.auth,
  ]);

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  async function refreshAuthState() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setIsLoggedIn(Boolean(user));
    return Boolean(user);
  }

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const sendMessage = useCallback(
    async (content: string) => {
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
      setSaveError(null);

      try {
        const res = await fetch("/api/landing-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            collected,
            messages: nextMessages.map(({ role, content: text }) => ({
              role,
              content: text,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Chat request failed.");
        }
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            role: "assistant",
            content:
              data.message ??
              "Tell me more — what are you currently working on?",
          },
        ]);
        setCollected((current) =>
          mergeCollected(current, data.collected ?? EMPTY_COLLECTED)
        );
        const ready = Boolean(data.profile_ready);
        setProfileReady(ready);
        if (ready) setSavePromptDismissed(false);
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            role: "assistant",
            content: "Tell me more — what are you currently working on?",
          },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [collected, messages, sessionId, typing]
  );

  async function handleAuthSuccess() {
    const loggedIn = await refreshAuthState();
    if (!loggedIn) return;
    const pendingSave = localStorage.getItem(PENDING_SAVE_KEY) === "true";
    if (
      pendingSave &&
      hasCollectedContent(collected) &&
      (profileReady || userMessageCount >= LANDING_SAVE_PROMPT_AFTER)
    ) {
      await handleSaveProfile();
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

  useEffect(() => {
    if (profileReady && isLoggedIn && !typing && hydrated && !saving) {
      const pendingSave = localStorage.getItem(PENDING_SAVE_KEY) === "true";
      if (pendingSave) {
        void handleSaveProfile();
      }
    }
  }, [profileReady, isLoggedIn, typing, hydrated, saving, handleSaveProfile]);

  if (!hydrated) {
    return <div className="min-h-screen bg-white" aria-hidden />;
  }

  return (
    <div className="relative min-h-screen bg-white text-[var(--text)]">
      <header className="landing-animate-in border-b border-[var(--border)] bg-white px-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <MetoMarkBadge size="sm" />
            <span className="text-base font-medium text-[var(--text)]">meto</span>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                {mobileMenuOpen ? (
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>

            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)] sm:block"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            className="mx-auto mb-4 max-w-6xl rounded-xl border border-[var(--border)] bg-white p-3 lg:hidden"
            aria-label="Mobile"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-[680px] flex-col items-center justify-center px-4 pb-12 pt-8 sm:px-6">
        <div className="landing-animate-in w-full text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            {LANDING_HERO.eyebrow}
          </p>
          <h1 className="mb-3.5 text-balance text-[34px] font-semibold leading-[1.1] tracking-[-0.5px] text-[var(--text)] sm:text-[52px]">
            {LANDING_HERO.headline}
          </h1>
          <p
            className={`mx-auto max-w-[520px] text-balance text-base leading-relaxed text-[var(--text-secondary)] ${
              chatStarted ? "mb-10" : "mb-8"
            }`}
          >
            {LANDING_HERO.subhead}
          </p>
          {!chatStarted ? (
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("chat")
                  ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                textareaRef.current?.focus();
              }}
              className="group mx-auto mb-10 flex w-fit flex-col items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
              aria-label={`${LANDING_HERO.cta} — scroll to chat`}
            >
              <span>{LANDING_HERO.cta}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 transition-transform duration-150 group-hover:translate-y-0.5"
                aria-hidden
              >
                <path
                  d="M12 5v14M6 13l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}
        </div>

        <div
          id="chat"
          className="landing-animate-in w-full max-w-[600px] overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
          style={{ animationDelay: "0.08s" }}
        >
          <div className="landing-scrollbar-hidden max-h-[min(42vh,360px)] overflow-y-auto p-4">
            {!chatStarted ? (
              <LandingOpeningMessage />
            ) : (
              <div className="space-y-5">
                <LandingOpeningMessage />
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`landing-animate-message ${
                      message.role === "user" ? "flex justify-end" : "text-left"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="flex max-w-[92%] gap-3">
                        <MetoMarkBadge />
                        <div>
                          <p className="mb-1 text-[11px] font-medium text-[var(--primary)]">
                            Meto
                          </p>
                          <p className="whitespace-pre-wrap text-sm leading-normal text-[var(--text)]">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="max-w-[85%] whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm leading-normal text-[var(--text)]">
                        {message.content}
                      </p>
                    )}
                  </div>
                ))}
                {typing ? (
                  <div className="landing-animate-message flex gap-3 text-left">
                    <MetoMarkBadge />
                    <div>
                      <p className="mb-1 text-[11px] font-medium text-[var(--primary)]">
                        Meto
                      </p>
                      <div className="flex gap-1 py-1">
                        <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                        <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                        <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                      </div>
                    </div>
                  </div>
                ) : null}
                {showSavePrompt ? (
                  <div className="landing-animate-message pt-1">
                    <div className="rounded-xl border border-[#E8E8E4] bg-[#F7F7F5]/80 px-4 py-3">
                      <p className="text-sm font-medium text-[var(--text)]">
                        Apply this to your profile?
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                        I&apos;ve got a good picture of you. Save it to your
                        dashboard, or keep chatting if you want to add more.
                      </p>
                      {saveError ? (
                        <p className="mt-2 text-xs text-red-600" role="alert">
                          {saveError}
                        </p>
                      ) : null}
                      {!isLoggedIn ? (
                        <p className="mt-2 text-xs text-[var(--text-secondary)]">
                          Sign in to save — your chat stays on this device until
                          then.
                        </p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void handleApplyToProfile()}
                          className="rounded-[7px] bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
                        >
                          {saving ? "Saving…" : "Save to my profile"}
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={handleKeepChatting}
                          className="rounded-[7px] px-2 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
                        >
                          Keep chatting
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border)]" />

          <form onSubmit={handleSubmit} className="flex items-end gap-3 px-4 py-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                chatStarted
                  ? "Answer in your own words…"
                  : LANDING_HERO.inputPlaceholder
              }
              disabled={typing}
              className="min-h-[24px] flex-1 resize-none bg-transparent text-sm leading-normal text-[var(--text)] outline-none placeholder:text-[var(--placeholder)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white transition-[background] duration-150 ease-in-out hover:bg-[var(--primary-hover)] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </form>
          {chatStarted ? (
            <LandingProfileProgress collected={collected} />
          ) : (
            <p className="border-t border-[var(--border)] px-4 py-2.5 text-center text-[11px] text-[var(--placeholder)]">
              One question at a time — no account needed to try
            </p>
          )}
        </div>

        <LandingAiPartners className="mt-6" />
      </main>

      <footer
        id="faq"
        className="border-t border-[var(--border)] bg-white px-4 py-8 sm:px-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--text-secondary)] sm:flex-row">
          <p>© {new Date().getFullYear()} Meto</p>
          <div className="flex flex-wrap justify-center gap-5">
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors duration-150 hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <ProfileAuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authModalMode}
        saving={saving}
        onAuthSuccess={() => void handleAuthSuccess()}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
