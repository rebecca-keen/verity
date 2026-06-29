#!/usr/bin/env node
import fs from "fs";

const websites = JSON.parse(
  fs.readFileSync("/Users/rkeen/Projects/verity/scripts/spa-websites.json", "utf8")
);

let data = fs.readFileSync("/Users/rkeen/Projects/verity/lib/data.ts", "utf8");

for (const [slug, url] of Object.entries(websites)) {
  const needle = `slug: "${slug}",\n    name:`;
  const insert = `slug: "${slug}",\n    website: "${url}",\n    name:`;
  if (data.includes(`slug: "${slug}",\n    website:`)) continue;
  if (!data.includes(needle)) {
    console.error("Missing seed:", slug);
    process.exit(1);
  }
  data = data.replace(needle, insert);
}

fs.writeFileSync("/Users/rkeen/Projects/verity/lib/data.ts", data);
console.log("Inserted website fields for", Object.keys(websites).length, "providers");
