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
  isAssistantReplying,
  LandingOpeningMessage,
  LandingTypingDots,
} from "@/components/landing/landing-chat-ui";
import {
  MARKETING_NAV_OFFSET_PX,
  MarketingNavBar,
} from "@/components/marketing/marketing-nav-bar";
import { MetoMarkBadge } from "@/components/meto-mark";
import { brandAssets } from "@/lib/brand";
import { postChatStream } from "@/lib/chat-stream-client";
import {
  EMPTY_COLLECTED,
  hasCollectedContent,
  LANDING_SAVE_PROMPT_AFTER,
  mergeCollected,
  type CollectedProfile,
} from "@/lib/landing-chat";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";
import { streamPlainTextForDisplay } from "@/lib/stream-prompt";
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

const LANDING_OPENING_DISPLAY =
  "Tell me about yourself — what do you do and what are you working on?";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[13px] w-[13px]" aria-hidden>
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

function LandingMetoAvatar() {
  return (
    <span
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brandAssets.logoIcon}
        alt=""
        className="h-2.5 w-2.5 object-contain brightness-0 invert"
      />
    </span>
  );
}

function LandingHeroOpening() {
  return (
    <div className="border-b border-[var(--border)] px-5 pb-3.5 pt-4">
      <div className="mb-2 flex items-center gap-2">
        <LandingMetoAvatar />
        <span className="text-xs font-semibold text-[var(--text)]">Meto</span>
      </div>
      <p className="text-sm leading-[1.6] text-[var(--text-secondary)]">{LANDING_OPENING_DISPLAY}</p>
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

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatStartedOnceRef = useRef(false);
  const landingChatEpochRef = useRef(0);

  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [collected, setCollected] = useState<CollectedProfile>(EMPTY_COLLECTED);
  const [profileReady, setProfileReady] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("gate");
  const [savePromptDismissed, setSavePromptDismissed] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [chatEnterActive, setChatEnterActive] = useState(false);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const chatStarted = userMessageCount > 0;
  const showChatOverlay = chatStarted;
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

  const resetLandingChat = useCallback(() => {
    landingChatEpochRef.current += 1;
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    setCollected(EMPTY_COLLECTED);
    setProfileReady(false);
    setInput("");
    setTyping(false);
    setSavePromptDismissed(false);
    setSaveError(null);
    setSessionId(createId());
    setChatEnterActive(false);
    chatStartedOnceRef.current = false;
  }, []);

  function handleCloseChat() {
    resetLandingChat();
  }

  useEffect(() => {
    if (!showChatOverlay) {
      if (!chatStarted) {
        chatStartedOnceRef.current = false;
        setChatEnterActive(false);
      }
      return;
    }
    if (chatStartedOnceRef.current) return;
    chatStartedOnceRef.current = true;
    setChatEnterActive(true);

    const scrollTimer = window.setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);

    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus({ preventScroll: true });
    }, 420);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(focusTimer);
    };
  }, [chatStarted, showChatOverlay]);

  useEffect(() => {
    if (!hydrated || typing || authModalOpen || showChatOverlay) return;
    const id = requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [hydrated, typing, authModalOpen, showChatOverlay]);

  useEffect(() => {
    const existing = loadSession();
    if (existing?.sessionId) {
      setSessionId(existing.sessionId);
      setMessages(existing.messages ?? []);
      setCollected(existing.collected ?? EMPTY_COLLECTED);
      setProfileReady(existing.profileReady ?? false);
      if ((existing.messages ?? []).some((m) => m.role === "user")) {
        chatStartedOnceRef.current = true;
      }
    } else {
      setSessionId(createId());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    if (messages.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
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
      const assistantId = createId();
      setMessages([
        ...nextMessages,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ]);
      setInput("");
      setTyping(true);
      setSaveError(null);
      const epoch = landingChatEpochRef.current;

      try {
        const { data } = await postChatStream(
          "/api/landing-chat",
          {
            sessionId,
            collected,
            messages: nextMessages.map(({ role, content: text }) => ({
              role,
              content: text,
            })),
          },
          {
            onToken: (_, full) => {
              if (epoch !== landingChatEpochRef.current) return;
              setMessages((current) =>
                current.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: streamPlainTextForDisplay(full) }
                    : m
                )
              );
            },
            onEvent: (event) => {
              if (epoch !== landingChatEpochRef.current) return;
              if (typeof event.message === "string") {
                setMessages((current) =>
                  current.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: event.message as string }
                      : m
                  )
                );
              }
            },
          }
        );

        if (epoch !== landingChatEpochRef.current) return;

        if (typeof data?.message === "string" && data.message.trim()) {
          setMessages((current) =>
            current.map((m) =>
              m.id === assistantId ? { ...m, content: data.message as string } : m
            )
          );
        }

        if (data?.collected && typeof data.collected === "object") {
          setCollected((current) =>
            mergeCollected(
              current,
              data.collected as CollectedProfile
            )
          );
        }

        const ready = Boolean(data?.profile_ready);
        setProfileReady(ready);
        if (ready) setSavePromptDismissed(false);
      } catch {
        if (epoch !== landingChatEpochRef.current) return;
        setMessages((current) =>
          current.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Tell me more — what are you currently working on?",
                }
              : m
          )
        );
      } finally {
        if (epoch === landingChatEpochRef.current) {
          setTyping(false);
        }
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
    return <div className="min-h-screen" aria-hidden />;
  }

  const landingHero = (
    <div className="landing-animate-in w-full text-center">
      <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--placeholder)]">
        Meto
      </p>
      <h1 className="mb-4 text-balance text-[36px] font-extrabold leading-[1.06] tracking-[-2px] text-[var(--text)] sm:text-[58px]">
        Stop repeating yourself to every AI.
      </h1>
      <p
        className={`mx-auto max-w-[400px] text-center text-[17px] leading-[1.5] text-[var(--muted)] ${
          chatStarted ? "mb-0" : "mb-9"
        }`}
      >
        One profile. Every AI instantly knows who you are.
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen text-[var(--text)]">
      <MarketingNavBar isLoggedIn={isLoggedIn} />

      <main className="relative z-10 mx-auto w-full px-5">
        <div className="relative mx-auto w-full max-w-[580px]">
          {showChatOverlay ? (
            <div
              className="pointer-events-none fixed inset-x-0 z-[12] bg-[var(--bg)]/92 transition-opacity duration-500"
              style={{
                top: MARKETING_NAV_OFFSET_PX,
                height: `calc(100vh - ${MARKETING_NAV_OFFSET_PX}px)`,
              }}
              aria-hidden
            />
          ) : null}

          <div
            className={
              showChatOverlay
                ? "pointer-events-none fixed inset-x-0 z-20 flex items-center justify-center px-5"
                : "flex flex-col items-center justify-center"
            }
            style={
              showChatOverlay
                ? {
                    top: MARKETING_NAV_OFFSET_PX,
                    height: `calc(100vh - ${MARKETING_NAV_OFFSET_PX}px)`,
                  }
                : { minHeight: `calc(100vh - ${MARKETING_NAV_OFFSET_PX}px)` }
            }
          >
            <div
              className={`flex w-full flex-col items-center text-center transition-[filter,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                showChatOverlay
                  ? "pointer-events-none fixed inset-x-0 z-[8] justify-center px-5 blur-[14px] opacity-[0.28] saturate-50"
                  : "shrink-0"
              }`}
              style={
                showChatOverlay
                  ? {
                      top: MARKETING_NAV_OFFSET_PX,
                      height: `calc(100vh - ${MARKETING_NAV_OFFSET_PX}px)`,
                    }
                  : undefined
              }
              aria-hidden={showChatOverlay}
            >
              {landingHero}
              {showChatOverlay ? <LandingAiPartners className="mt-10" /> : null}
            </div>
            <div
              className={
                showChatOverlay
                  ? "pointer-events-auto relative z-30 w-full max-w-[580px] isolate"
                  : "mb-5 w-full"
              }
            >
              <div
                id="chat"
                ref={chatContainerRef}
                className={`brand-spot brand-surface landing-chat-shell w-full overflow-hidden rounded-2xl border border-[var(--border)] ${
                  chatStarted
                    ? `is-active relative ${showChatOverlay && chatEnterActive ? "landing-chat-focus" : ""}`
                    : "landing-animate-in"
                }`}
                style={chatStarted ? undefined : { animationDelay: "0.08s" }}
              >
            {chatStarted ? (
              <button
                type="button"
                onClick={handleCloseChat}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--surface)] hover:text-[var(--text)]"
                aria-label="End chat"
              >
                <CloseIcon />
              </button>
            ) : null}

            {!chatStarted ? <LandingHeroOpening /> : null}

            {chatStarted ? (
              <div
                className={`landing-scrollbar-hidden overflow-y-auto border-b border-[var(--border)] bg-[var(--card)] px-5 pb-4 pt-10 transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  showChatOverlay
                    ? "max-h-[min(58vh,440px)]"
                    : "max-h-[min(42vh,320px)]"
                }`}
              >
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
                          <MetoMarkBadge size="sm" />
                          <div>
                            <p className="mb-1 text-xs font-semibold text-[var(--text)]">
                              Meto
                            </p>
                            {message.content ? (
                              <p className="whitespace-pre-wrap text-sm leading-[1.6] text-[var(--text)]">
                                {message.content}
                              </p>
                            ) : null}
                            {isAssistantReplying(typing, messages, message) ? (
                              <LandingTypingDots />
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <p className="max-w-[85%] whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm leading-[1.6] text-[var(--text)]">
                          {message.content}
                        </p>
                      )}
                    </div>
                  ))}
                  {showSavePrompt ? (
                    <div className="landing-animate-message pt-1">
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3">
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
                            className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-50"
                          >
                            {saving ? "Saving…" : "Save to my profile"}
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={handleKeepChatting}
                            className="rounded-lg px-2 py-1.5 text-xs text-[var(--muted)] transition-colors duration-150 hover:text-[var(--text)]"
                          >
                            Keep chatting
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className={chatStarted ? "bg-[var(--card)]" : undefined}>
              <div className="bg-[var(--card)] px-4 pb-3 pt-3.5">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  autoFocus
                  placeholder={
                    chatStarted
                      ? "Answer in your own words…"
                      : "I'm a designer working on..."
                  }
                  disabled={typing}
                  className="min-h-12 w-full resize-none border-none bg-transparent font-[inherit] text-[15px] leading-[1.6] text-[var(--text)] outline-none placeholder:text-[var(--placeholder)]"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--card)] px-4 py-2.5">
                {!chatStarted ? (
                  <span className="text-xs text-[var(--placeholder)]">No signup to try</span>
                ) : (
                  <span className="text-xs text-transparent" aria-hidden>
                    ·
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="ml-auto flex items-center gap-1.5 rounded-lg border-none bg-[var(--primary)] px-3.5 py-[7px] text-[13px] font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)] disabled:pointer-events-none disabled:opacity-40"
                >
                  Send
                  <SendArrowIcon />
                </button>
              </div>
            </form>
              </div>
            </div>
            {!showChatOverlay ? (
              <LandingAiPartners className="landing-animate-in shrink-0" />
            ) : null}
          </div>
        </div>
      </main>

      <footer
        id="faq"
        className="relative z-10 border-t border-[var(--border)] bg-[var(--card)] px-4 py-8 sm:px-8"
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
