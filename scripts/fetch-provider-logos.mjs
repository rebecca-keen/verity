#!/usr/bin/env node
/**
 * Fetch provider logos for listing cards and fix logo-as-hero regressions.
 *
 * Usage:
 *   node scripts/fetch-provider-logos.mjs              # audit only
 *   node scripts/fetch-provider-logos.mjs --fix        # fetch logos + fix logo-hero
 *   node scripts/fetch-provider-logos.mjs --fix --slug glow-st-pete-med-spa-st-petersburg
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FIX = process.argv.includes("--fix");
const slugIdx = process.argv.indexOf("--slug");
const slugArg = slugIdx >= 0 ? process.argv[slugIdx + 1] : null;

const args = [
  path.join(ROOT, "scripts/fix-spa-gallery-images.mjs"),
  FIX ? "--fix" : "--audit",
  "--logos",
  ...(FIX ? ["--all"] : []),
  ...(slugArg ? ["--slug", slugArg] : []),
];

const result = spawnSync(process.execPath, args, { cwd: ROOT, stdio: "inherit" });
process.exit(result.status ?? 1);
