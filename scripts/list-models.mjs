import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const key = env.match(/DEEPSEEK_API_KEY=(.+)/)?.[1]?.trim();
if (!key) {
  console.error("No DEEPSEEK_API_KEY in .env.local");
  process.exit(1);
}

const base =
  env.match(/DEEPSEEK_API_BASE=(.+)/)?.[1]?.trim() ||
  "https://api.deepseek.com";

const res = await fetch(`${base}/models`, {
  headers: { Authorization: `Bearer ${key}` },
});
const data = await res.json();

if (!res.ok) {
  console.error(data.error?.message ?? `Request failed (${res.status})`);
  process.exit(1);
}

(data.data || []).forEach((model) => console.log(model.id));
