import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, "generate-brand-icons.py");

try {
  execSync(`python3 "${scriptPath}"`, { stdio: "inherit" });
} catch (err) {
  console.error("Failed to run generate-brand-icons.py:", err);
  process.exit(1);
}
