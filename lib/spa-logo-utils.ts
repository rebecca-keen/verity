/** Partner badges and non-brand marks that should not represent a provider on list cards. */
const PARTNER_BADGE_LOGO_RE =
  /alle[-+]|allergan|galderma|cobrand|proud[-_]?member|member[-_]?logo|fb-icon|cropped-diamond|diamond\d|care[-_]?credit|synchrony|spacc_|tec-logo/i;

export function isPartnerBadgeLogo(url?: string): boolean {
  if (!url) return false;
  return PARTNER_BADGE_LOGO_RE.test(url);
}
