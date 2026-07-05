import { getStateBoardName, getStateBoardUrl } from "./verification-links";
import { isPlaceholderPhone, isValidWebsiteUrl } from "./spa-link-utils";
import type { MedicalDirectorInfo, Spa } from "./types";

/** Internal / placeholder license IDs — not confirmed from a state board. */
export function isPlaceholderLicenseId(licenseId: string): boolean {
  const id = licenseId.trim();
  if (!id) return true;
  return (
    /^ME-\d+$/i.test(id) ||
    /^FL-(REAL|MIA)-\d+$/i.test(id) ||
    /^[A-Z]{2}-REAL-/i.test(id)
  );
}

const GENERIC_MD_PATTERNS = [
  /^licensed medical director/i,
  /^physician-directed team$/i,
  /^medical director on file$/i,
  /^physician-led clinical team$/i,
];

export function isGenericMedicalDirector(medicalDirector: string): boolean {
  const md = medicalDirector.trim();
  if (!md) return true;
  return GENERIC_MD_PATTERNS.some((pattern) => pattern.test(md));
}

/** Named provider on a practice site (not a generic placeholder). */
export function hasNamedMedicalDirector(medicalDirector: string): boolean {
  const md = medicalDirector.trim();
  return Boolean(md) && !isGenericMedicalDirector(md);
}

export function parseMedicalDirector(medicalDirector: string): MedicalDirectorInfo {
  const [name, ...rest] = medicalDirector.split(",").map((s) => s.trim());
  const credentials = rest.join(", ") || "";
  return {
    name: name || medicalDirector.trim(),
    credentials,
    boardCertifications: [],
  };
}

export function resolveMedicalDirectorInfo(spa: Spa): MedicalDirectorInfo & {
  displayNote: string;
} {
  const hasWebsite = Boolean(getPublicWebsite(spa));
  const named = hasNamedMedicalDirector(spa.medicalDirector);

  if (hasWebsite && named) {
    const parsed = parseMedicalDirector(spa.medicalDirector);
    return {
      ...parsed,
      source: "practice-website",
      displayNote:
        "Listed on the practice website — confirm credentials with the practice or your state medical board.",
    };
  }

  return {
    name: "Medical director on file",
    credentials: "Verify with practice",
    boardCertifications: [],
    source: "unknown",
    displayNote:
      "Med spas typically operate under physician oversight. Confirm the supervising provider directly with the practice.",
  };
}

function getPublicWebsite(spa: Pick<Spa, "website" | "slug">): string {
  if (!isValidWebsiteUrl(spa.website, spa.slug)) return "";
  return spa.website.trim();
}

export function resolveLicenseVerification(spa: Spa): {
  label: string;
  linkText: string;
  linkUrl: string;
  showLicenseId: boolean;
} {
  const boardName = getStateBoardName(spa.state);
  const boardUrl = getStateBoardUrl(spa.state);
  const showLicenseId = Boolean(spa.licenseId?.trim()) && !isPlaceholderLicenseId(spa.licenseId);

  return {
    label: "License verification",
    linkText: `Verify with ${boardName}`,
    linkUrl: boardUrl,
    showLicenseId,
  };
}

export function getHonestCertifications(
  spa: Pick<Spa, "website" | "state" | "premierPartner" | "featuredPremium">,
): string[] {
  const boardName = getStateBoardName(spa.state);
  const certs = ["Listing sourced from public records"];
  if (spa.website?.trim() && isValidWebsiteUrl(spa.website)) {
    certs.push("Practice website on file");
  }
  certs.push(`${boardName} — user verification recommended`);
  certs.push("Medical director — confirm with practice");
  return certs;
}

export function getHonestDataSources(
  spa: Pick<Spa, "website" | "reviewSources" | "state">,
  reviewSource?: string,
): string[] {
  const boardName = getStateBoardName(spa.state);
  const sources: string[] = [];

  if (spa.reviewSources?.google) {
    sources.push("Google Business Profile");
  }
  if (spa.reviewSources?.yelp) {
    sources.push("Yelp");
  }
  if (reviewSource?.trim()) {
    sources.push(reviewSource.trim());
  }
  if (spa.website?.trim() && isValidWebsiteUrl(spa.website)) {
    sources.push("Provider official website");
  }
  sources.push("User submissions via Verity contact form");
  sources.push(`${boardName} — verification recommended`);

  return [...new Set(sources)];
}

const MARKETING_CLAIMS = [
  /celebrity clientele/i,
  /members only/i,
  /vip scheduling/i,
  /verified visit reviews/i,
  /verified florida med spa/i,
];

function sanitizeHighlights(highlights: string[]): string[] {
  return highlights
    .filter((h) => !MARKETING_CLAIMS.some((pattern) => pattern.test(h)))
    .map((h) =>
      h
        .replace(/Verified Florida med spa/gi, "Public listing")
        .replace(/★ verified\b/gi, "★ public rating")
        .replace(/Google & Yelp verified/gi, "Google & Yelp ratings")
        .replace(/Medical director on file/gi, "Medical director — confirm with practice"),
    );
}

function resolveListingStatus(
  spa: Pick<Spa, "listingStatus" | "premierPartner">,
): Spa["listingStatus"] {
  if (spa.listingStatus === "verified-partner" || spa.premierPartner) {
    return "verified-partner";
  }
  return "listed";
}

/** Apply honest trust metadata when building spa records from seeds. */
export function normalizeSpaTrust<T extends Spa>(spa: T): T {
  const listingStatus = resolveListingStatus(spa);
  const medicalDirectorInfo = resolveMedicalDirectorInfo(spa);
  const certifications = getHonestCertifications(spa);
  const dataSources = getHonestDataSources(spa);
  const highlights = sanitizeHighlights(spa.highlights);
  const phone = isPlaceholderPhone(spa.phone) ? "" : spa.phone.trim();

  return {
    ...spa,
    listingStatus,
    verified: false,
    medicalDirector: medicalDirectorInfo.source === "practice-website" ? spa.medicalDirector : "",
    medicalDirectorInfo,
    licenseId: isPlaceholderLicenseId(spa.licenseId) ? "" : spa.licenseId,
    phone,
    certifications,
    dataSources,
    highlights,
  };
}
