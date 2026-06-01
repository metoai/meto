import type { ContextSection } from "@/lib/types";

function sectionContent(sections: ContextSection[], type: string) {
  return sections.find((s) => s.section_type === type)?.content?.trim() ?? "";
}

function capitalize(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clean(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

/** Rewrite first-person profile copy into direct second person. */
function toSecondPerson(text: string) {
  let s = clean(text);
  if (!s) return "";

  s = s.replace(/^my name is [^.!?\n]+[.!?]?\s*/i, "");
  s = s.replace(/\bi am currently\b/gi, "you're currently");
  s = s.replace(/\bi'm currently\b/gi, "you're currently");
  s = s.replace(/\bi am\b/gi, "you're");
  s = s.replace(/\bi'm\b/gi, "you're");
  s = s.replace(/\bi've\b/gi, "you've");
  s = s.replace(/\bi want to\b/gi, "you want to");
  s = s.replace(/\bi work\b/gi, "you work");
  s = s.replace(/\bmy\b/gi, "your");
  s = s.replace(/\bme\b/gi, "you");
  s = s.replace(/\bi\b/g, "you");

  s = s.replace(/\s+([,.])/g, "$1");
  if (s && !/[.!?]$/.test(s)) s += ".";

  return capitalize(s);
}

function firstClause(text: string, maxWords = 22) {
  const sentence = text.split(/(?<=[.!?])\s+/)[0] ?? text;
  const words = sentence.replace(/[.!?]+$/, "").split(/\s+/);
  if (words.length <= maxWords) return sentence.replace(/[.!?]+$/, "");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function formatGoalPhrase(goal: string) {
  const g = clean(goal);
  if (/^learn /i.test(g)) return `learning ${g.slice(6)}`;
  if (/^build /i.test(g)) return `building ${g.slice(6)}`;
  if (/^grow /i.test(g)) return `growing ${g.slice(5)}`;
  if (/^get /i.test(g)) return `getting ${g.slice(4)}`;
  return g;
}

function identityPhrase(about: string, work: string) {
  const aboutBody = about.replace(/^my name is [^.!?\n]+[.!?]?\s*/i, "").trim();
  const source = aboutBody || work;
  if (!source) return "";

  const rewritten = toSecondPerson(source).replace(/[.!?]+$/, "");
  const clause = firstClause(rewritten, 18);
  if (!clause) return "";

  return `${clause}.`;
}

function projectPhrase(projects: string, work: string) {
  const source = projects || work;
  if (!source) return "";

  const working = source.match(/\b(?:i am|i'm) (?:currently )?working on ([^.]+)/i);
  if (working?.[1]) {
    return `Currently working on ${clean(working[1])}.`;
  }

  const building = source.match(/\b(?:i am|i'm) (?:currently )?building ([^.]+)/i);
  if (building?.[1]) {
    return `Currently building ${clean(building[1])}.`;
  }

  const rewritten = toSecondPerson(source).replace(/[.!?]+$/, "");
  const stripped = rewritten
    .replace(/^you're (?:currently )?/i, "")
    .replace(/^you /i, "");
  if (!stripped) return "";

  return `${capitalize(stripped)}.`;
}

function goalPhrase(goals: string) {
  if (!goals) return "";

  const wantMatch = goals.match(/\bi want to (.+?)[.!?]?\s*$/i);
  if (wantMatch?.[1]) {
    return `Next up: ${formatGoalPhrase(wantMatch[1])}.`;
  }

  const rewritten = toSecondPerson(goals).replace(/[.!?]+$/, "");
  const stripped = rewritten.replace(/^you want to /i, "");
  if (stripped && stripped !== rewritten) {
    return `Next up: ${formatGoalPhrase(stripped)}.`;
  }

  return `${capitalize(rewritten.replace(/^you /i, ""))}.`;
}

export function buildProfileSummary(sections: ContextSection[]): string {
  const about = sectionContent(sections, "about");
  const work = sectionContent(sections, "work");
  const projects = sectionContent(sections, "projects");
  const goals = sectionContent(sections, "goals");

  if (!about && !work && !projects && !goals) {
    return "Add a little more to your profile and Meto will describe you back to you in clear, natural language.";
  }

  const parts: string[] = [];

  const identity = identityPhrase(about, work);
  if (identity) parts.push(identity);

  const project = projectPhrase(projects, work);
  if (project && project !== identity) parts.push(project);

  const goal = goalPhrase(goals);
  if (goal) parts.push(goal);

  if (parts.length === 0) {
    return "Add a little more to your profile and Meto will describe you back to you in clear, natural language.";
  }

  return parts.join(" ");
}
