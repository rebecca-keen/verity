import { getStateBoardName, getStateBoardUrl } from "./verification-links";
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
  const hasWebsite = Boolean(spa.website?.trim());
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

export function getHonestCertifications(spa: Pick<Spa, "website" | "premierPartner" | "featuredPremium">): string[] {
  const certs = ["Listing sourced from public records"];
  if (spa.website?.trim()) {
    certs.push("Practice website on file");
  }
  certs.push("Medical director — confirm with practice");
  return certs;
}

export function getHonestDataSources(
  spa: Pick<Spa, "website" | "reviewSources">,
  reviewSource?: string,
): string[] {
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
  if (spa.website?.trim()) {
    sources.push("Provider official website");
  }
  sources.push("User submissions via hello@verityaesthetics.app");
  sources.push("State licensing board — verification recommended");

  return [...new Set(sources)];
}

/** Apply honest trust metadata when building spa records from seeds. */
export function normalizeSpaTrust<T extends Spa>(spa: T): T {
  const medicalDirectorInfo = resolveMedicalDirectorInfo(spa);
  const certifications = getHonestCertifications(spa);
  const dataSources = getHonestDataSources(spa);
  const highlights = spa.highlights.map((h) =>
    h
      .replace(/Verified Florida med spa/gi, "Public listing")
      .replace(/★ verified\b/gi, "★ public rating")
      .replace(/Medical director on file/gi, "Medical director — confirm with practice"),
  );

  return {
    ...spa,
    medicalDirector: medicalDirectorInfo.source === "practice-website" ? spa.medicalDirector : "",
    medicalDirectorInfo,
    licenseId: isPlaceholderLicenseId(spa.licenseId) ? "" : spa.licenseId,
    certifications,
    dataSources,
    highlights,
  };
}
