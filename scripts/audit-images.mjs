#!/usr/bin/env node
/**
 * Audit all image URLs used across Verity.
 * Usage: node scripts/audit-images.mjs [--json]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_OUT = process.argv.includes("--json");

const SCAN_DIRS = ["lib", "components", "app"];
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?|$)/i;
const URL_RE = /https?:\/\/[^\s"'`,]+/g;

function collectFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...collectFiles(p));
    else if (/\.(tsx?|jsx?|mjs)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function extractUrls(content, file) {
  const urls = [];
  for (const m of content.matchAll(URL_RE)) {
    let url = m[0].replace(/[\\]+$/, "");
    if (url.endsWith(",") || url.endsWith(";")) url = url.slice(0, -1);
    urls.push({ url, file: path.relative(ROOT, file) });
  }
  return urls;
}

async function checkUrl(url, timeout = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "VerityImageAudit/1.0" },
    });
    clearTimeout(timer);
    const ct = res.headers.get("content-type") || "";
    const isImage =
      ct.startsWith("image/") ||
      IMAGE_EXT.test(url) ||
      (ct.includes("octet-stream") && IMAGE_EXT.test(url));
    return {
      url,
      status: res.status,
      contentType: ct,
      ok: res.ok && isImage,
      issue: !res.ok
        ? `HTTP ${res.status}`
        : !isImage
          ? `wrong content-type: ${ct || "none"}`
          : null,
    };
  } catch (e) {
    clearTimeout(timer);
    // HEAD may fail; retry GET with range
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "VerityImageAudit/1.0",
          Range: "bytes=0-1024",
        },
      });
      const ct = res.headers.get("content-type") || "";
      const isImage =
        ct.startsWith("image/") ||
        IMAGE_EXT.test(url) ||
        (ct.includes("octet-stream") && IMAGE_EXT.test(url));
      return {
        url,
        status: res.status,
        contentType: ct,
        ok: res.ok && isImage,
        issue: !res.ok
          ? `HTTP ${res.status}`
          : !isImage
            ? `wrong content-type: ${ct || "none"}`
            : null,
      };
    } catch (e2) {
      return { url, status: 0, contentType: "", ok: false, issue: String(e2.message || e2) };
    }
  }
}

async function pool(items, fn, concurrency = 20) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

function extractUnsplashIds(content) {
  const ids = new Set();
  for (const m of content.matchAll(/photo-[a-zA-Z0-9_-]+/g)) ids.add(m[0]);
  return [...ids];
}

async function main() {
  const files = SCAN_DIRS.flatMap((d) => collectFiles(path.join(ROOT, d)));
  const entries = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    entries.push(...extractUrls(content, file));
  }

  const unique = new Map();
  for (const e of entries) {
    if (!unique.has(e.url)) unique.set(e.url, e.file);
  }

  const urls = [...unique.keys()].filter(
    (u) =>
      u.includes("unsplash") ||
      IMAGE_EXT.test(u) ||
      u.includes("/wp-content/") ||
      u.includes("/media/") ||
      u.includes("_astro") ||
      u.includes("cdn.") ||
      u.includes("wsimg") ||
      u.includes("s3.")
  );

  console.log(`Scanning ${urls.length} unique image URLs from ${files.length} files...\n`);

  const results = await pool(urls, checkUrl, 25);
  const broken = results.filter((r) => !r.ok && !r.url.includes("${"));
  const byStatus = {};
  for (const r of broken) {
    const key = r.issue?.startsWith("HTTP") ? r.issue : r.issue || "unknown";
    byStatus[key] = (byStatus[key] || 0) + 1;
  }

  const domains = new Set(broken.map((r) => {
    try { return new URL(r.url).hostname; } catch { return "?"; }
  }));

  const unsplashBroken = broken.filter((r) => r.url.includes("unsplash"));
  const unsplashIds = new Set();
  for (const f of files) {
    for (const id of extractUnsplashIds(fs.readFileSync(f, "utf8"))) unsplashIds.add(id);
  }

  const report = {
    total: urls.length,
    ok: results.filter((r) => r.ok).length,
    broken: broken.length,
    byStatus,
    brokenDomains: [...domains].sort(),
    brokenUrls: broken.map((r) => ({
      url: r.url,
      status: r.status,
      issue: r.issue,
      source: unique.get(r.url),
    })),
    unsplashBrokenCount: unsplashBroken.length,
    unsplashBrokenIds: [...new Set(unsplashBroken.map((r) => {
      const m = r.url.match(/photo-[a-zA-Z0-9_-]+/);
      return m?.[0];
    }).filter(Boolean))],
    totalUnsplashIdsInCode: unsplashIds.size,
  };

  if (JSON_OUT) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`TOTAL: ${report.total}  OK: ${report.ok}  BROKEN: ${report.broken}\n`);
  console.log("By issue:");
  for (const [k, v] of Object.entries(byStatus).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
  console.log(`\nBroken domains (${domains.size}): ${[...domains].sort().join(", ")}`);
  console.log(`\nBroken Unsplash IDs (${report.unsplashBrokenIds.length}):`);
  for (const id of report.unsplashBrokenIds) console.log(`  ${id}`);
  console.log("\nFirst 30 broken URLs:");
  for (const b of broken.slice(0, 30)) {
    console.log(`  [${b.issue}] ${b.url.slice(0, 100)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
