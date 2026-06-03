"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GapFixIntent, GapFixQueueItem } from "@/lib/context-score-actions";
import {
  advanceGapFixSession,
  clearGapFixSession,
  CONTEXT_SCORE_GAPS_KEY,
  markCelebratePending,
  markGapSectionApplied,
  readAllGapFixItems,
  readAppliedGapSections,
  readGapFixSession,
} from "@/lib/context-score-actions";
import {
  billingErrorMessage,
  isAiLimitResponse,
  isUpgradeRequiredResponse,
} from "@/lib/billing-errors";
import { postChatStream } from "@/lib/chat-stream-client";
import { streamPlainTextForDisplay } from "@/lib/stream-prompt";
import {
  readUpdateHistory,
  recordUpdate,
  type UpdateHistoryEntry,
} from "@/lib/update-history";

export type QuickUpdateMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export { QUICK_UPDATE_SUGGESTIONS } from "@/lib/quick-update-content";

function createId() {
  return crypto.randomUUID();
}

function gapFixPayload(gapFix: GapFixIntent) {
  const allGaps = readAllGapFixItems();
  return {
    sectionType: gapFix.sectionType,
    insight: gapFix.insight,
    mode: gapFix.mode,
    allGaps: (allGaps.length ? allGaps : gapFix.queue).map((item) => ({
      sectionType: item.sectionType,
      insight: item.insight,
      title: item.title,
    })),
    focusIndex: gapFix.queueIndex,
  };
}

export function useQuickUpdateChat(
  onApplied?: (result: {
    mode: GapFixIntent["mode"];
    finishedAll: boolean;
  }) => void,
  initialGapFix?: GapFixIntent | null
) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gapFixInitStarted = useRef(false);

  const [gapFix, setGapFix] = useState<GapFixIntent | null>(
    initialGapFix ?? null
  );
  const [messages, setMessages] = useState<QuickUpdateMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<Record<
    string,
    string
  > | null>(null);
  const [applied, setApplied] = useState(false);
  const [gapFixInitDone, setGapFixInitDone] = useState(false);
  const [gapFixPaused, setGapFixPaused] = useState(false);
  const [remainingGaps, setRemainingGaps] = useState<GapFixQueueItem[]>([]);
  const [lastApplied, setLastApplied] = useState<{
    sections: string[];
    preview: Record<string, string>;
  } | null>(null);
  const [updateHistory, setUpdateHistory] = useState<UpdateHistoryEntry[]>([]);
  const lastUserMessageRef = useRef("");

  useEffect(() => {
    setUpdateHistory(readUpdateHistory());
  }, []);

  const chatStarted = messages.length > 0;
  const gapFixBootstrapping =
    Boolean(gapFix) && !gapFixInitDone && !chatStarted && !gapFixPaused;

  useEffect(() => {
    setGapFix(initialGapFix ?? null);
    gapFixInitStarted.current = false;
    setGapFixInitDone(false);
    setGapFixPaused(false);
    setRemainingGaps([]);
    setMessages([]);
  }, [initialGapFix]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatStarted) scrollToBottom();
  }, [messages, typing, chatStarted, scrollToBottom]);

  function resizeTextarea(maxHeight = 120) {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const applyStreamResult = useCallback((data: Record<string, unknown>) => {
    const reply = typeof data.reply === "string" ? data.reply : null;
    const done = Boolean(data.done);
    const updates =
      data.updates && typeof data.updates === "object"
        ? (data.updates as Record<string, string>)
        : {};

    if (done && Object.keys(updates).length > 0) {
      setPendingUpdates(updates);
    }

    return reply;
  }, []);

  const handleStreamError = useCallback((err: unknown, fallback: string) => {
    const data =
      err instanceof Error && "data" in err
        ? (err as Error & { data?: Record<string, unknown> }).data
        : undefined;
    if (data && (isAiLimitResponse(data) || isUpgradeRequiredResponse(data))) {
      return billingErrorMessage(data, "Upgrade required.");
    }
    return err instanceof Error ? err.message : fallback;
  }, []);

  const initGapFixChat = useCallback(
    async (target: GapFixIntent) => {
      setTyping(true);
      setError(null);
      setPendingUpdates(null);
      setApplied(false);
      setGapFixPaused(false);

      const assistantId = createId();

      try {
        setMessages([{ id: assistantId, role: "assistant", content: "" }]);

        const { data } = await postChatStream(
          "/api/profile/update-chat",
          {
            gapFixInit: true,
            gapFix: gapFixPayload(target),
          },
          {
            onToken: (_, full) => {
              setMessages([
                {
                  id: assistantId,
                  role: "assistant",
                  content: streamPlainTextForDisplay(full),
                },
              ]);
            },
            onEvent: (event) => {
              if (typeof event.reply === "string") {
                setMessages([
                  {
                    id: assistantId,
                    role: "assistant",
                    content: event.reply,
                  },
                ]);
              }
            },
          }
        );

        applyStreamResult(data ?? {});
        const reply = typeof data?.reply === "string" ? data.reply : null;
        if (reply) {
          setMessages([
            { id: assistantId, role: "assistant", content: reply },
          ]);
        }
        setGapFixInitDone(true);
      } catch (err) {
        setMessages([]);
        setError(handleStreamError(err, "Failed to start gap fix."));
        setGapFixInitDone(true);
      } finally {
        setTyping(false);
      }
    },
    [applyStreamResult, handleStreamError]
  );

  useEffect(() => {
    if (!gapFix || gapFixInitStarted.current || gapFixPaused) return;
    gapFixInitStarted.current = true;
    void initGapFixChat(gapFix);
  }, [gapFix, gapFixPaused, initGapFixChat]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || typing) return;

    const userMessage: QuickUpdateMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    const assistantId = createId();
    setMessages([
      ...nextMessages,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setTyping(true);
    setError(null);
    setPendingUpdates(null);
    setApplied(false);
    lastUserMessageRef.current = trimmed;

    try {
      const { data } = await postChatStream(
        "/api/profile/update-chat",
        {
          messages: nextMessages.map(({ role, content: text }) => ({
            role,
            content: text,
          })),
          ...(gapFix ? { gapFix: gapFixPayload(gapFix) } : {}),
        },
        {
          onToken: (_, full) => {
            setMessages((current) =>
              current.map((m) =>
                m.id === assistantId
                  ? { ...m, content: streamPlainTextForDisplay(full) }
                  : m
              )
            );
          },
          onEvent: (event) => {
            if (typeof event.reply === "string") {
              setMessages((current) =>
                current.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: event.reply as string }
                    : m
                )
              );
            }
          },
        }
      );

      applyStreamResult(data ?? {});
      if (typeof data?.reply === "string") {
        setMessages((current) =>
          current.map((m) =>
            m.id === assistantId ? { ...m, content: data.reply as string } : m
          )
        );
      }
    } catch (err) {
      setMessages(nextMessages);
      setError(handleStreamError(err, "Something went wrong."));
    } finally {
      setTyping(false);
    }
  }

  async function handleApply() {
    if (!pendingUpdates || applying) return;
    setApplying(true);
    setError(null);

    const appliedSections = Object.keys(pendingUpdates);
    const appliedPreview = { ...pendingUpdates };

    try {
      const res = await fetch("/api/profile/update-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apply: true,
          updates: pendingUpdates,
          messages: messages.map(({ role, content }) => ({ role, content })),
          ...(gapFix ? { gapFix: gapFixPayload(gapFix) } : {}),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (isAiLimitResponse(data) || isUpgradeRequiredResponse(data)) {
          throw new Error(billingErrorMessage(data, "Upgrade required."));
        }
        throw new Error(billingErrorMessage(data, "Failed to apply updates."));
      }

      setApplied(true);
      setPendingUpdates(null);
      setMessages([]);
      setLastApplied({
        sections: appliedSections,
        preview: appliedPreview,
      });
      recordUpdate({
        message: lastUserMessageRef.current || "Profile update",
        sections: appliedSections,
        preview: appliedPreview,
      });
      setUpdateHistory(readUpdateHistory());
      setGapFixInitDone(false);
      gapFixInitStarted.current = false;

      if (gapFix) {
        markGapSectionApplied(gapFix.sectionType);
      }

      if (gapFix?.mode === "all") {
        const fixedSections = readAppliedGapSections();
        const next = advanceGapFixSession();
        if (next) {
          const session = readGapFixSession();
          const totalCount = gapFix.totalCount;
          const nextIntent: GapFixIntent = {
            mode: "all",
            sectionType: next.sectionType,
            insight: next.insight,
            title: next.title,
            queue: session?.queue ?? [next],
            queueIndex: totalCount - (session?.queue.length ?? 1),
            totalCount,
          };
          setGapFix(nextIntent);
          setGapFixPaused(false);
          onApplied?.({ mode: "all", finishedAll: false });
        } else {
          clearGapFixSession();
          markCelebratePending(fixedSections);
          onApplied?.({ mode: "all", finishedAll: true });
        }
      } else if (gapFix) {
        const session = readGapFixSession();
        const rest =
          session?.queue.filter(
            (item) => item.sectionType !== gapFix.sectionType
          ) ?? [];
        if (rest.length) {
          writeRemaining(rest);
          setRemainingGaps(rest);
          setGapFixPaused(true);
          onApplied?.({ mode: "single", finishedAll: false });
        } else {
          const fixedSections = readAppliedGapSections();
          clearGapFixSession();
          markCelebratePending(fixedSections);
          onApplied?.({ mode: "single", finishedAll: true });
        }
      } else {
        onApplied?.({ mode: "single", finishedAll: true });
      }

      setTimeout(() => setApplied(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply.");
    } finally {
      setApplying(false);
    }
  }

  function writeRemaining(rest: GapFixQueueItem[]) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(CONTEXT_SCORE_GAPS_KEY, JSON.stringify(rest));
  }

  function continueNextGap() {
    if (!remainingGaps.length) return;
    const [next, ...rest] = remainingGaps;
    writeRemaining(rest);
    const session = readGapFixSession();
    const nextIntent: GapFixIntent = {
      mode: session?.mode ?? "single",
      sectionType: next.sectionType,
      insight: next.insight,
      title: next.title,
      queue: [next, ...rest],
      queueIndex: 0,
      totalCount: [next, ...rest].length,
    };
    setRemainingGaps(rest);
    setGapFix(nextIntent);
    setGapFixPaused(false);
    setGapFixInitDone(false);
    gapFixInitStarted.current = false;
  }

  function finishGapFixFlow() {
    const fixedSections = readAppliedGapSections();
    clearGapFixSession();
    markCelebratePending(fixedSections.length ? fixedSections : undefined);
    onApplied?.({
      mode: gapFix?.mode ?? "single",
      finishedAll: true,
    });
  }

  function resetChat() {
    setMessages([]);
    setInput("");
    setError(null);
    setPendingUpdates(null);
    setApplied(false);
    setGapFixPaused(false);
    setRemainingGaps([]);
    setGapFixInitDone(false);
    gapFixInitStarted.current = false;
    if (gapFix && !gapFixPaused) {
      gapFixInitStarted.current = true;
      void initGapFixChat(gapFix);
    }
  }

  return {
    messages,
    input,
    setInput,
    typing,
    applying,
    error,
    pendingUpdates,
    applied,
    chatStarted,
    gapFixBootstrapping,
    gapFixPaused,
    remainingGaps,
    gapFix,
    lastApplied,
    updateHistory,
    messagesEndRef,
    textareaRef,
    sendMessage,
    handleApply,
    resetChat,
    continueNextGap,
    finishGapFixFlow,
    resizeTextarea,
  };
}
