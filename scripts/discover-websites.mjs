#!/usr/bin/env node
/** Discover med spa websites via known map + URL pattern probing */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = fs.readFileSync(path.join(__dirname, "tampa-reviews-raw.txt"), "utf8");
const known = JSON.parse(
  fs.readFileSync(path.join(__dirname, "website-map-known.json"), "utf8")
);

const re = /^### (.+)\n\n(.+?) ★ ([\d.]+) · (\d+) reviews/mg;
const names = [];
let m;
while ((m = re.exec(raw)) !== null) names.push(m[1]);

function clean(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slugVariants(name) {
  const c = clean(name);
  const words = name.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const short = words.slice(0, 3).join("");
  return [
    c,
    short,
    words.join(""),
    short + "medspa",
    short + "aesthetics",
    words[0] + "medspa",
    words[0] + "aesthetics",
  ].filter(Boolean);
}

async function probe(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "VerityBot/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok || res.status === 405) return url;
    const res2 = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "VerityBot/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res2.ok) return url;
  } catch {
    /* */
  }
  return null;
}

async function findWebsite(name) {
  if (known[name]) return known[name];
  const ck = clean(name);
  if (known[ck]) return known[ck];
  const variants = slugVariants(name);
  const domains = new Set();
  for (const v of variants) {
    domains.add(`${v}.com`);
    domains.add(`www.${v}.com`);
    if (v.length > 4) domains.add(`${v}fl.com`);
  }
  for (const d of domains) {
    const url = await probe(`https://${d.replace(/^www\./, "")}`);
    if (url) {
      const html = await fetch(url, {
        headers: { "User-Agent": "VerityBot/1.0" },
        signal: AbortSignal.timeout(10000),
      }).then((r) => (r.ok ? r.text() : ""));
      if (html && (html.toLowerCase().includes("botox") || html.toLowerCase().includes("med spa") || html.toLowerCase().includes("aesthetic"))) {
        return { website: url.endsWith("/") ? url : `${url}/`, phone: known[name]?.phone || "" };
      }
    }
  }
  return null;
}

async function main() {
  const out = { ...known };
  let found = 0;
  for (const name of names) {
    if (out[name] || out[clean(name)]) continue;
    process.stdout.write(`Probing ${name.slice(0, 45).padEnd(45)} `);
    const info = await findWebsite(name);
    if (info) {
      out[name] = info;
      found++;
      console.log(info.website);
    } else {
      console.log("—");
    }
  }
  fs.writeFileSync(path.join(__dirname, "website-map.json"), JSON.stringify(out, null, 2));
  console.log(`Added ${found} new; total ${Object.keys(out).length}`);
}

main();
