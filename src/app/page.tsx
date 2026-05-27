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

const THEME_STORAGE_KEY = "meto-theme";

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

const NAV_LINKS = [
  { label: "How it works", href: "/#chat" },
  { label: "Examples", href: "/profile/dibo" },
  { label: "Pricing", href: "/pricing" },
];

function createId() {
  return crypto.randomUUID();
}

type ThemePreference = "system" | "light" | "dark";

function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === "system") {
    root.removeAttribute("data-theme");
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    root.setAttribute("data-theme", preference);
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  }
}

function loadThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

function ThemeToggleIcon({ preference }: { preference: ThemePreference }) {
  if (preference === "light") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (preference === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M21 14.5A7.5 7.5 0 1111.5 5a5.5 5.5 0 008.5 9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MetoMark({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M12 19V5M12 5l-5 5M12 5l5 5"
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
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("system");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("gate");
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const resumePendingRef = useRef(false);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const chatStarted = userMessageCount > 0;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatStarted) scrollToBottom();
  }, [messages, typing, chatStarted, scrollToBottom]);

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
    setThemePreference(loadThemePreference());
  }, []);

  function cycleTheme() {
    const next: ThemePreference =
      themePreference === "system"
        ? "light"
        : themePreference === "light"
          ? "dark"
          : "system";
    setThemePreference(next);
    applyTheme(next);
  }

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    saveSession({ sessionId, messages, collected, profileReady });
  }, [hydrated, sessionId, messages, collected, profileReady]);

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

  useEffect(() => {
    async function bootstrapAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(Boolean(user));
      const pendingSave = localStorage.getItem(PENDING_SAVE_KEY) === "true";
      if (user && pendingSave && profileReady && hasCollectedContent(collected)) {
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
  }, [hydrated, collected, profileReady, persistProfile, router, supabase.auth]);

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
        setProfileReady(Boolean(data.profile_ready));
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
    if (loggedIn) await flushPendingMessage();
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
      setAuthModalMode("save");
      setAuthModalOpen(true);
    }
  }, [profileReady, isLoggedIn, typing, hydrated, saving]);

  async function handleSaveProfile() {
    if (saving) return;
    try {
      setSaving(true);
      await persistProfile();
      setAuthModalOpen(false);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated) {
    return <div className="min-h-screen bg-[var(--color-bg)]" aria-hidden />;
  }

  return (
    <div className="relative min-h-screen text-[var(--color-text)]">
      <div className="landing-mesh" aria-hidden>
        <div className="landing-mesh-blob" />
      </div>

      <header className="landing-animate-in relative z-20 px-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-5">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <MetoMark />
            <span className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
              meto
            </span>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={cycleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
              aria-label={`Theme: ${themePreference}. Click to change.`}
              title={
                themePreference === "system"
                  ? "Theme: System"
                  : themePreference === "light"
                    ? "Theme: Light"
                    : "Theme: Dark"
              }
            >
              <ThemeToggleIcon preference={themePreference} />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] lg:hidden"
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
                className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Dashboard
              </Link>
            ) : (
              <>
        <Link
          href="/auth/login"
                  className="hidden text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] sm:block"
        >
          Log in
        </Link>
            <Link
              href="/auth/signup"
                  className="rounded-full bg-[#0F6E56] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1D9E75]"
            >
                  Get started
            </Link>
              </>
            )}
          </div>
          </div>

        {mobileMenuOpen ? (
          <nav
            className="mx-auto mb-4 max-w-6xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 lg:hidden"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-4xl flex-col items-center justify-center px-4 pb-12 pt-4 sm:px-6">
        <div className="landing-animate-in w-full text-center">
          <h1 className="whitespace-nowrap text-[clamp(1.25rem,3.8vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--color-text)]">
            Stop introducing yourself to AI
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-[var(--color-muted)] sm:text-lg">
            Create your AI identity by chatting with Meto
          </p>
          </div>

        <div
          id="chat"
          className="landing-animate-in mt-10 flex w-full max-w-3xl flex-col rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] transition-colors duration-200"
          style={{
            animationDelay: "0.08s",
            boxShadow: "var(--color-card-shadow)",
          }}
        >
          {chatStarted ? (
            <div className="landing-scrollbar-hidden min-h-[100px] max-h-[min(42vh,360px)] overflow-y-auto px-5 pb-2 pt-5 sm:px-6">
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`landing-animate-message ${
                      message.role === "user" ? "flex justify-end" : "text-left"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="max-w-[92%]">
                        <p className="mb-1 text-xs font-medium text-[var(--color-accent)]">
                          Meto
                        </p>
                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--color-text)]/90">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--color-text)]">
                        {message.content}
                      </p>
                    )}
                  </div>
                ))}
                {typing ? (
                  <div className="landing-animate-message text-left">
                    <p className="mb-1 text-xs font-medium text-[var(--color-accent)]">
                      Meto
                    </p>
                    <div className="flex gap-1 py-1">
                      <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                      <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                      <span className="landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                    </div>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className={`px-5 sm:px-6 ${chatStarted ? "border-t border-[var(--color-border)] py-4" : "py-5"}`}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={chatStarted ? 1 : 2}
              placeholder={
                profileReady && isLoggedIn
                  ? "Profile ready — save to continue"
                  : "I'm a designer working on..."
              }
              disabled={typing || (profileReady && isLoggedIn)}
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
            />
            <div className="mt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={!input.trim() || typing || (profileReady && isLoggedIn)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6E56] text-white transition-colors duration-150 hover:bg-[#1D9E75] disabled:opacity-30"
                aria-label="Send"
              >
                <SendIcon />
              </button>
            </div>
          </form>
          </div>
      </main>

      <footer
        id="faq"
        className="relative z-10 border-t border-[var(--color-border)] px-4 py-8 sm:px-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--color-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} Meto</p>
          <div className="flex flex-wrap justify-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[var(--color-accent)]"
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
