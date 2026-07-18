/** Partner badges and non-brand marks that should not represent a provider on list cards. */
const PARTNER_BADGE_LOGO_RE =
  /alle[-+]|allergan|galderma|cobrand|proud[-_]?member|member[-_]?logo|fb-icon|cropped-diamond|diamond\d|care[-_]?credit|synchrony|spacc_|tec-logo/i;

/** Tiny favicons / app icons — not usable wordmarks on listing cards. */
const FAVICON_ONLY_RE =
  /favicon|site-icon|siteicon|webclip|apple-touch-icon|android-chrome|cropped-\d/i;

/** Open-graph / social preview images mis-tagged as logos. */
const OG_AS_LOGO_RE = /og[-_](?:feat|image|default)|social\/og|open[-_]?graph/i;

const LOGO_URL_RE =
  /(?:^|[/_-])logo(?:[._-]|$)|[-_]logo[-_.]|logo[-_]?(?:white|dark|mark|icon|full|primary|secondary)|(?:^|[/_-])brand(?:[._-]|$)/i;

export function isPartnerBadgeLogo(url?: string): boolean {
  if (!url) return false;
  return PARTNER_BADGE_LOGO_RE.test(url);
}

export function isFaviconOnlyLogo(url?: string): boolean {
  if (!url) return false;
  return FAVICON_ONLY_RE.test(url) && !LOGO_URL_RE.test(url);
}

export function isOgImageLogo(url?: string): boolean {
  if (!url) return false;
  return OG_AS_LOGO_RE.test(url) && !LOGO_URL_RE.test(url);
}

/** Prefer brand wordmarks over favicons, OG images, and partner badges. */
export function resolveProviderLogo(
  entryLogo?: string,
  brandLogo?: string,
): string | undefined {
  const entryOk =
    entryLogo && !isPartnerBadgeLogo(entryLogo) && !isFaviconOnlyLogo(entryLogo) && !isOgImageLogo(entryLogo);
  const brandOk =
    brandLogo && !isPartnerBadgeLogo(brandLogo) && !isFaviconOnlyLogo(brandLogo) && !isOgImageLogo(brandLogo);

  if (entryOk) return entryLogo;
  if (brandOk) return brandLogo;
  if (entryLogo && !isPartnerBadgeLogo(entryLogo)) return entryLogo;
  if (brandLogo && !isPartnerBadgeLogo(brandLogo)) return brandLogo;
  return undefined;
}
