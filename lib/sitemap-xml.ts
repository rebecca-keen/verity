import type { MetadataRoute } from "next";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemapXml(entries: MetadataRoute.Sitemap): string {
  const body = entries
    .map((entry) => {
      const tags = [`<loc>${escapeXml(entry.url)}</loc>`];

      if (entry.lastModified) {
        tags.push(`<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`);
      }
      if (entry.changeFrequency) {
        tags.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
      }
      if (entry.priority !== undefined) {
        tags.push(`<priority>${entry.priority}</priority>`);
      }

      return `<url>${tags.join("")}</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}
