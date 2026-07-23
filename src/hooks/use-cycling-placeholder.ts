"use client";

import { useEffect, useState } from "react";

const PLACEHOLDERS = [
  "I'm a designer working on a new product…",
  "I'm a software engineer building a SaaS startup…",
  "I'm a product manager leading a team of 8…",
  "I'm a founder raising my seed round…",
  "I'm a data scientist working on ML pipelines…",
  "I'm a freelancer specializing in brand identity…",
  "I'm a researcher publishing in computational biology…",
  "I'm a devrel engineer creating developer content…",
  "I'm a marketing lead at an early-stage startup…",
  "I'm a UX writer shaping product voice and tone…",
];

const TYPE_SPEED = 40;   // ms per character
const DELETE_SPEED = 20; // ms per character
const PAUSE_AFTER = 2200; // ms to hold full string
const PAUSE_BEFORE = 400; // ms before typing next

export function useCyclingPlaceholder(active: boolean) {
  const [displayed, setDisplayed] = useState(PLACEHOLDERS[0]);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting" | "waiting">("pausing");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(PLACEHOLDERS[0].length);

  useEffect(() => {
    if (!active) return;

    const target = PLACEHOLDERS[phraseIndex];

    if (phase === "typing") {
      if (charIndex < target.length) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, TYPE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), PAUSE_AFTER);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), PAUSE_AFTER);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (charIndex > 0) {
        const t = setTimeout(() => {
          setCharIndex((c) => c - 1);
          setDisplayed(target.slice(0, charIndex - 1));
        }, DELETE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % PLACEHOLDERS.length);
          setPhase("waiting");
        }, PAUSE_BEFORE);
        return () => clearTimeout(t);
      }
    }

    if (phase === "waiting") {
      setPhase("typing");
    }
  }, [active, phase, charIndex, phraseIndex]);

  return displayed;
}
