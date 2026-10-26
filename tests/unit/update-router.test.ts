import { describe, it, expect } from "vitest";
import { routeUpdateInput, isValidSectionTarget } from "@/lib/update-router";

describe("update-router", () => {
  it("validates preset and custom section targets", () => {
    expect(isValidSectionTarget("about")).toBe(true);
    expect(isValidSectionTarget("work")).toBe(true);
    expect(isValidSectionTarget("projects")).toBe(true);
    expect(isValidSectionTarget("skills")).toBe(true);
    expect(isValidSectionTarget("goals")).toBe(true);
    expect(isValidSectionTarget("working_style")).toBe(true);
    expect(isValidSectionTarget("context_for_ai")).toBe(true);
    expect(isValidSectionTarget("custom:Tech Stack")).toBe(true);
    expect(isValidSectionTarget("random_unknown_field")).toBe(false);
  });

  it("routes direct JSON payloads deterministically", () => {
    const json = JSON.stringify({
      work: "Staff Software Engineer at Meto.",
      skills: "TypeScript, Python, Distributed Systems",
    });

    const decision = routeUpdateInput(json);
    expect(decision.route).toBe("deterministic");
    if (decision.route === "deterministic") {
      expect(decision.updates.work).toBe("Staff Software Engineer at Meto.");
      expect(decision.updates.skills).toBe("TypeScript, Python, Distributed Systems");
    }
  });

  it("routes command patterns deterministically", () => {
    const decision = routeUpdateInput("update work: Founding Engineer at Meto AI");
    expect(decision.route).toBe("deterministic");
    if (decision.route === "deterministic") {
      expect(decision.updates.work).toBe("Founding Engineer at Meto AI");
    }
  });

  it("routes custom section commands deterministically", () => {
    const decision = routeUpdateInput("set custom:Tech Stack: Next.js, Supabase, Tailwind, Vitest");
    expect(decision.route).toBe("deterministic");
    if (decision.route === "deterministic") {
      expect(decision.updates["custom:Tech Stack"]).toBe("Next.js, Supabase, Tailwind, Vitest");
    }
  });

  it("routes single-line key-value preset edits deterministically", () => {
    const decision = routeUpdateInput("about: Based in Addis Ababa, working on AI infrastructure.");
    expect(decision.route).toBe("deterministic");
    if (decision.route === "deterministic") {
      expect(decision.updates.about).toBe("Based in Addis Ababa, working on AI infrastructure.");
    }
  });

  it("routes conversational narrative to LLM extraction", () => {
    const decision = routeUpdateInput("Hey! I just switched jobs to Google and started learning Rust.");
    expect(decision.route).toBe("llm_extraction");
  });
});
