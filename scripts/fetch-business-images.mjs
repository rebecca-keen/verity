#!/usr/bin/env node
/**
 * Fetch hero + gallery images from each provider's official website.
 * Rate-limited batch wrapper around fix-spa-gallery-images logic.
 *
 * Usage:
 *   node scripts/fetch-business-images.mjs [--slug name] [--limit N] [--dry-run]
 *   node scripts/fetch-business-images.mjs --headshots [--phoenix-az] [--sample 20]
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const args = process.argv.slice(2);
const fixArgs = ["scripts/fix-spa-gallery-images.mjs", "--fix", "--all"];

for (const flag of ["--slug", "--headshots", "--phoenix-az", "--sample", "--nationwide"]) {
  if (args.includes(flag)) {
    fixArgs.push(flag);
    if (flag === "--slug" || flag === "--sample") {
      const i = args.indexOf(flag);
      if (args[i + 1]) fixArgs.push(args[i + 1]);
    }
  }
}

if (args.includes("--dry-run")) {
  fixArgs[1] = "--audit";
  console.log("Dry run — audit only, no file writes.");
}

console.log("Fetching business website images (treatment/service pages, no headshots)...");
console.log(`Running: node ${fixArgs.join(" ")}`);

const child = spawn("node", fixArgs, { cwd: ROOT, stdio: "inherit" });
child.on("close", (code) => process.exit(code ?? 1));
