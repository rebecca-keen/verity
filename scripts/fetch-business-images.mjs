#!/usr/bin/env node
/**
 * Fetch hero + gallery images from each provider's official website.
 * Rate-limited batch wrapper around fix-spa-gallery-images logic.
 *
 * Usage:
 *   node scripts/fetch-business-images.mjs [--slug name] [--limit N] [--dry-run]
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const args = process.argv.slice(2);
const fixArgs = ["scripts/fix-spa-gallery-images.mjs", "--fix"];

if (args.includes("--slug")) {
  const i = args.indexOf("--slug");
  fixArgs.push("--slug", args[i + 1]);
}

if (args.includes("--dry-run")) {
  fixArgs[1] = "--audit";
  console.log("Dry run — audit only, no file writes.");
}

console.log("Fetching business website images (rate-limited, ~6 concurrent)...");
console.log(`Running: node ${fixArgs.join(" ")}`);

const child = spawn("node", fixArgs, { cwd: ROOT, stdio: "inherit" });
child.on("close", (code) => process.exit(code ?? 1));
