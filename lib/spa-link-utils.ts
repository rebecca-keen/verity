import type { Spa, SpaSocials } from "./types";

const PLACEHOLDER_PHONE_RE = /\b555-\d{4}\b/;
const INVALID_WEBSITE_HOSTS = new Set([
  "example.com",
  "www.example.com",
  "placeholder.com",
  "www.placeholder.com",
  "localhost",
]);

export function isPlaceholderPhone(phone: string | undefined | null): boolean {
  if (!phone?.trim()) return true;
  return PLACEHOLDER_PHONE_RE.test(phone);
}

export function isSlugGeneratedWebsite(website: string, slug: string): boolean {
  if (!website?.trim() || !slug) return false;
  try {
    const url = new URL(normalizeWebsite(website));
    const host = url.hostname.replace(/^www\./, "");
    const slugHost = `${slug}.com`.replace(/^www\./, "");
    return host === slugHost;
  } catch {
    return false;
  }
}

export function normalizeWebsite(website: string): string {
  const trimmed = website.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function isValidWebsiteUrl(website: string | undefined | null, slug?: string): boolean {
  const normalized = normalizeWebsite(website ?? "");
  if (!normalized) return false;

  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    if (INVALID_WEBSITE_HOSTS.has(url.hostname.toLowerCase())) return false;
    if (slug && isSlugGeneratedWebsite(normalized, slug)) return false;
    return true;
  } catch {
    return false;
  }
}

export function getPublicWebsite(spa: Pick<Spa, "website" | "slug">): string | null {
  if (!isValidWebsiteUrl(spa.website, spa.slug)) return null;
  return normalizeWebsite(spa.website);
}

export function getPublicPhone(spa: Pick<Spa, "phone">): string | null {
  if (isPlaceholderPhone(spa.phone)) return null;
  return spa.phone.trim();
}

export function getPhoneTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

export function getGoogleMapsSearchUrl(spa: Pick<Spa, "name" | "neighborhood" | "city" | "state">): string {
  const query = encodeURIComponent(`${spa.name}, ${spa.neighborhood}, ${spa.city}, ${spa.state}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

const SOCIAL_PREFIX: Record<keyof SpaSocials, string> = {
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
};

export type PublicSocialLink = {
  key: keyof SpaSocials;
  label: string;
  href: string;
};

const SOCIAL_LABELS: Record<keyof SpaSocials, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
};

function isLikelyGeneratedSocialHandle(handle: string, slug: string): boolean {
  const normalizedHandle = handle.replace(/^@/, "").toLowerCase();
  const slugHandle = slug.replace(/-/g, "_").slice(0, 24).toLowerCase();
  const slugCompact = slug.replace(/-/g, "").toLowerCase();
  return (
    normalizedHandle === slugHandle ||
    normalizedHandle === slugCompact ||
    normalizedHandle === slug.replace(/-/g, "_").toLowerCase()
  );
}

export function getPublicSocialLinks(spa: Pick<Spa, "socials" | "slug">): PublicSocialLink[] {
  const links: PublicSocialLink[] = [];
  for (const key of Object.keys(SOCIAL_PREFIX) as (keyof SpaSocials)[]) {
    const raw = spa.socials[key]?.trim();
    if (!raw) continue;
    if (isLikelyGeneratedSocialHandle(raw, spa.slug)) continue;
    const handle = raw.replace(/^@/, "");
    links.push({
      key,
      label: SOCIAL_LABELS[key],
      href: `${SOCIAL_PREFIX[key]}${handle}`,
    });
  }
  return links;
}

/** @deprecated use getPublicSocialLinks — kept for callers passing full Spa */
export function hasConnectOptions(spa: Spa): boolean {
  return (
    getPublicWebsite(spa) !== null ||
    getPublicPhone(spa) !== null ||
    getPublicSocialLinks(spa).length > 0
  );
}
