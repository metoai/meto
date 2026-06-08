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
import type { DocumentImportMode } from "@/lib/document-import";
import {
  DOCUMENT_IMPORT,
  isAllowedDocumentFilename,
  type IngestedDocument,
} from "@/lib/document-import";
import type { PendingAttachment } from "@/components/update-chat-attachments";
import {
  labelsForStatusPhase,
  quickUpdateStatusPhase,
  type MetoStatusPhase,
} from "@/lib/meto-status-labels";

export type QuickUpdateMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: { name: string; size: number }[];
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
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [importMode, setImportMode] = useState<DocumentImportMode>("supplement");
  const [ingesting, setIngesting] = useState(false);
  const [attachmentReadState, setAttachmentReadState] = useState<
    Record<string, "reading" | "ready" | "error">
  >({});
  const lastUserMessageRef = useRef("");
  const lastDocumentsRef = useRef<IngestedDocument[] | null>(null);
  const ingestCacheRef = useRef<Map<string, IngestedDocument>>(new Map());
  const ingestInflightIdsRef = useRef<Set<string>>(new Set());
  const ingestFlightRef = useRef<Promise<void> | null>(null);
  const ingestFileCountRef = useRef(0);

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

  function addAttachments(files: FileList | File[]) {
    const incoming = Array.from(files);
    setError(null);

    const valid = incoming.filter((file) => {
      if (!isAllowedDocumentFilename(file.name)) {
        setError(
          `${file.name}: unsupported type. Use PDF, DOCX, TXT, MD, CSV, or RTF.`
        );
        return false;
      }
      if (file.size > DOCUMENT_IMPORT.MAX_FILE_BYTES) {
        setError(
          `${file.name} is too large (max ${DOCUMENT_IMPORT.MAX_FILE_BYTES / (1024 * 1024)} MB).`
        );
        return false;
      }
      return true;
    });

    if (!valid.length) return;

    setAttachments((prev) => {
      const remaining = DOCUMENT_IMPORT.MAX_FILES - prev.length;
      if (remaining <= 0) {
        setError(`You can attach up to ${DOCUMENT_IMPORT.MAX_FILES} files.`);
        return prev;
      }
      const next = valid.slice(0, remaining).map((file) => ({
        id: createId(),
        file,
      }));
      if (valid.length > remaining) {
        setError(`Only ${DOCUMENT_IMPORT.MAX_FILES} files can be attached at once.`);
      }
      return [...prev, ...next];
    });
  }

  function removeAttachment(id: string) {
    ingestCacheRef.current.delete(id);
    ingestInflightIdsRef.current.delete(id);
    setAttachmentReadState((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  }

  async function ingestAttachments(
    pending: PendingAttachment[]
  ): Promise<IngestedDocument[]> {
    const formData = new FormData();
    for (const item of pending) {
      formData.append("files", item.file);
    }

    const res = await fetch("/api/profile/update-chat/ingest", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as {
      error?: string;
      documents?: IngestedDocument[];
    };

    if (!res.ok) {
      throw new Error(data.error ?? "Failed to read attached files.");
    }

    return data.documents ?? [];
  }

  const prefetchAttachments = useCallback(async (pending: PendingAttachment[]) => {
    if (!pending.length) return;
    ingestFileCountRef.current = Math.max(
      ingestFileCountRef.current,
      pending.length
    );

    setAttachmentReadState((prev) => {
      const next = { ...prev };
      for (const item of pending) {
        next[item.id] = "reading";
      }
      return next;
    });

    try {
      const documents = await ingestAttachments(pending);
      pending.forEach((item, index) => {
        const doc = documents[index];
        if (doc) {
          ingestCacheRef.current.set(item.id, doc);
          setAttachmentReadState((prev) => ({
            ...prev,
            [item.id]: "ready",
          }));
        } else {
          setAttachmentReadState((prev) => ({
            ...prev,
            [item.id]: "error",
          }));
        }
      });
    } catch {
      for (const item of pending) {
        setAttachmentReadState((prev) => ({
          ...prev,
          [item.id]: "error",
        }));
      }
    }
  }, []);

  useEffect(() => {
    const pending = attachments.filter(
      (item) =>
        !ingestCacheRef.current.has(item.id) &&
        !ingestInflightIdsRef.current.has(item.id)
    );
    if (!pending.length) return;

    for (const item of pending) {
      ingestInflightIdsRef.current.add(item.id);
    }

    const flight = prefetchAttachments(pending).finally(() => {
      for (const item of pending) {
        ingestInflightIdsRef.current.delete(item.id);
      }
      if (ingestFlightRef.current === flight) {
        ingestFlightRef.current = null;
      }
    });
    ingestFlightRef.current = flight;
  }, [attachments, prefetchAttachments]);

  async function resolveIngestedDocuments(
    pending: PendingAttachment[]
  ): Promise<IngestedDocument[]> {
    ingestFileCountRef.current = pending.length;

    if (ingestFlightRef.current) {
      setIngesting(true);
      try {
        await ingestFlightRef.current;
      } finally {
        setIngesting(false);
      }
    }

    const cached = pending
      .map((item) => ingestCacheRef.current.get(item.id))
      .filter((doc): doc is IngestedDocument => Boolean(doc));

    if (cached.length === pending.length) {
      return cached;
    }

    setIngesting(true);
    try {
      const documents = await ingestAttachments(pending);
      pending.forEach((item, index) => {
        const doc = documents[index];
        if (doc) ingestCacheRef.current.set(item.id, doc);
      });
      return documents;
    } finally {
      setIngesting(false);
    }
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    const hasAttachments = attachments.length > 0;
    if ((!trimmed && !hasAttachments) || typing || ingesting) return;

    const pendingFiles = [...attachments];
    const displayContent =
      trimmed ||
      `Review my attached file${pendingFiles.length === 1 ? "" : "s"} and update my profile.`;

    const userMessage: QuickUpdateMessage = {
      id: createId(),
      role: "user",
      content: displayContent,
      attachments: pendingFiles.map((item) => ({
        name: item.file.name,
        size: item.file.size,
      })),
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
    lastUserMessageRef.current = displayContent;
    setAttachments([]);

    try {
      let documents: IngestedDocument[] | undefined;
      if (pendingFiles.length) {
        documents = await resolveIngestedDocuments(pendingFiles);
        lastDocumentsRef.current = documents;
      } else {
        lastDocumentsRef.current = null;
      }

      const { data } = await postChatStream(
        "/api/profile/update-chat",
        {
          messages: nextMessages.map(({ role, content: text }) => ({
            role,
            content: text,
          })),
          ...(documents?.length
            ? {
                documents: documents.map((doc) => ({
                  filename: doc.filename,
                  facts: doc.facts,
                  truncated: doc.truncated,
                })),
                importMode,
              }
            : {}),
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
      setAttachments(pendingFiles);
      setError(handleStreamError(err, "Something went wrong."));
    } finally {
      setIngesting(false);
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
    setAttachments([]);
    setImportMode("supplement");
    ingestCacheRef.current.clear();
    ingestInflightIdsRef.current.clear();
    setAttachmentReadState({});
    lastDocumentsRef.current = null;
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

  const prefetchingAttachments = Object.values(attachmentReadState).some(
    (state) => state === "reading"
  );
  const statusPhase: MetoStatusPhase = quickUpdateStatusPhase({
    applying,
    ingesting: ingesting || prefetchingAttachments,
    typing,
    gapFixBootstrapping,
  });
  const statusLabels = labelsForStatusPhase(
    statusPhase,
    ingestFileCountRef.current > 1 || attachments.length > 1
  );

  return {
    messages,
    input,
    setInput,
    typing,
    ingesting,
    applying,
    statusPhase,
    statusLabels,
    attachments,
    attachmentReadState,
    importMode,
    setImportMode,
    addAttachments,
    removeAttachment,
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
