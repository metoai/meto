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
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "meto_landing_session";
const PENDING_SAVE_KEY = "meto_landing_pending_save";
const PENDING_MESSAGE_KEY = "meto_landing_pending_message";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type CollectedProfile = {
  about: string | null;
  work: string | null;
  projects: string | null;
  goals: string | null;
};

type LandingSession = {
  sessionId: string;
  messages: ChatMessage[];
  collected: CollectedProfile;
  profileReady: boolean;
};

const EMPTY_COLLECTED: CollectedProfile = {
  about: null,
  work: null,
  projects: null,
  goals: null,
};

const LANDING_SAVE_PROMPT_AFTER = 3;

const NAV_LINKS = [
  { label: "How it works", href: "/#chat" },
  { label: "Examples", href: "/profile/dibo" },
  { label: "Pricing", href: "/pricing" },
];

function createId() {
  return crypto.randomUUID();
}

function MetoAvatar({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#0F6E56" />
      <path
        d="M8 12h8M13 9l3 3-3 3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function OpeningMessage() {
  return (
    <div className="flex gap-3 text-left">
      <MetoAvatar />
      <div>
        <p className="mb-1 text-[11px] font-medium text-[var(--primary)]">Meto</p>
        <p className="text-sm leading-normal text-[var(--text)]">
          Hey — what do you do and what are you working on right now?
        </p>
      </div>
    </div>
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

function hasCollectedContent(collected: CollectedProfile) {
  return Object.values(collected).some((value) => value?.trim());
}

function mergeCollected(
  current: CollectedProfile,
  incoming: CollectedProfile
): CollectedProfile {
  return {
    about: incoming.about ?? current.about,
    work: incoming.work ?? current.work,
    projects: incoming.projects ?? current.projects,
    goals: incoming.goals ?? current.goals,
  };
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
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [savePromptDismissed, setSavePromptDismissed] = useState(false);
  const resumePendingRef = useRef(false);

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
    localStorage.removeItem(PENDING_MESSAGE_KEY);
    return true;
  }, [collected]);

  const handleSaveProfile = useCallback(async () => {
    if (saving) return;
    try {
      setSaving(true);
      await persistProfile();
      setAuthModalOpen(false);
      router.push("/dashboard/workspace");
      router.refresh();
    } catch (error) {
      console.error(error);
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
          router.push("/dashboard/workspace");
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
    async (content: string, skipAuthCheck = false) => {
      const trimmed = content.trim();
      if (!trimmed || typing) return;

      if (!skipAuthCheck && !isLoggedIn) {
        setPendingMessage(trimmed);
        localStorage.setItem(PENDING_MESSAGE_KEY, trimmed);
        setAuthModalMode("gate");
        setAuthModalOpen(true);
        return;
      }

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: trimmed,
      };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput("");
      setPendingMessage(null);
      localStorage.removeItem(PENDING_MESSAGE_KEY);
      setTyping(true);

      try {
        const res = await fetch("/api/landing-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: nextMessages.map(({ role, content: text }) => ({
              role,
              content: text,
            })),
          }),
        });
        const data = await res.json();
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
    [isLoggedIn, messages, sessionId, typing]
  );

  const flushPendingMessage = useCallback(async () => {
    const msg = (
      pendingMessage ?? localStorage.getItem(PENDING_MESSAGE_KEY)
    )?.trim();
    if (!msg || resumePendingRef.current) return;
    resumePendingRef.current = true;
    localStorage.removeItem(PENDING_MESSAGE_KEY);
    setPendingMessage(null);
    setAuthModalOpen(false);
    try {
      await sendMessage(msg, true);
    } finally {
      resumePendingRef.current = false;
    }
  }, [pendingMessage, sendMessage]);

  useEffect(() => {
    if (!hydrated || !isLoggedIn) return;
    const pendingMsg = localStorage.getItem(PENDING_MESSAGE_KEY)?.trim();
    if (!pendingMsg) return;
    void flushPendingMessage();
  }, [hydrated, isLoggedIn, flushPendingMessage]);

  async function handleAuthSuccess() {
    const loggedIn = await refreshAuthState();
    if (!loggedIn) return;
    await flushPendingMessage();
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
            <MetoAvatar className="h-5 w-5" />
            <span className="text-base font-medium text-[var(--text)]">meto</span>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {NAV_LINKS.map((link) => (
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
            {NAV_LINKS.map((link) => (
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
            Your AI identity
          </p>
          <h1 className="mb-3.5 text-[34px] font-semibold leading-[1.1] tracking-[-0.5px] text-[var(--text)] sm:text-[52px]">
            Stop introducing yourself to AI.
          </h1>
          <p className="mx-auto mb-10 max-w-[420px] text-base leading-normal text-[var(--text-secondary)]">
            Tell Meto about yourself once.
            <br />
            Every AI already knows you.
          </p>
        </div>

        <div
          id="chat"
          className="landing-animate-in w-full max-w-[600px] overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
          style={{ animationDelay: "0.08s" }}
        >
          <div className="landing-scrollbar-hidden max-h-[min(42vh,360px)] overflow-y-auto p-4">
            {!chatStarted ? (
              <OpeningMessage />
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`landing-animate-message ${
                      message.role === "user" ? "flex justify-end" : "text-left"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="flex max-w-[92%] gap-3">
                        <MetoAvatar />
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
                    <MetoAvatar />
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
              placeholder="I'm a designer working on..."
              disabled={typing}
              className="min-h-[24px] flex-1 resize-none bg-transparent text-sm leading-normal text-[var(--text)] outline-none placeholder:text-[var(--placeholder)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white transition-[background] duration-150 ease-in-out hover:bg-[var(--primary-hover)] disabled:pointer-events-none"
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--placeholder)]">
          Works with Claude · ChatGPT · Gemini · Perplexity
        </p>
      </main>

      <footer
        id="faq"
        className="border-t border-[var(--border)] bg-white px-4 py-8 sm:px-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--text-secondary)] sm:flex-row">
          <p>© {new Date().getFullYear()} Meto</p>
          <div className="flex flex-wrap justify-center gap-5">
            {NAV_LINKS.map((link) => (
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
