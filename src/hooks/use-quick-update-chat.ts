"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type QuickUpdateMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export { QUICK_UPDATE_SUGGESTIONS } from "@/lib/quick-update-content";

function createId() {
  return crypto.randomUUID();
}

export function useQuickUpdateChat(onApplied?: () => void) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const chatStarted = messages.length > 0;

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

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || typing) return;

    const userMessage: QuickUpdateMessage = {
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
        body: JSON.stringify({
          apply: true,
          updates: pendingUpdates,
          messages: messages.map(({ role, content }) => ({ role, content })),
        }),
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

  function resetChat() {
    setMessages([]);
    setInput("");
    setError(null);
    setPendingUpdates(null);
    setApplied(false);
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
    messagesEndRef,
    textareaRef,
    sendMessage,
    handleApply,
    resetChat,
    resizeTextarea,
  };
}
