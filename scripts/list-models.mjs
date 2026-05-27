import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const key = env.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!key) {
  console.error("No API key");
  process.exit(1);
}

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
);
const d = await res.json();
(d.models || [])
  .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
  .forEach((m) => console.log(m.name.replace("models/", "")));
