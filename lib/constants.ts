/** Public-facing business email shown in footer and legal pages. */
export const PUBLIC_BUSINESS_EMAIL = "hello@verityaesthetics.app";

/** @deprecated Use PUBLIC_BUSINESS_EMAIL */
export const CONTACT_EMAIL = PUBLIC_BUSINESS_EMAIL;

export function contactMailtoUrl(subject?: string): string {
  const base = `mailto:${PUBLIC_BUSINESS_EMAIL}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}

export function contactFormUrl(options?: { subject?: string; topic?: string; spa?: string }): string {
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.topic) params.set("topic", options.topic);
  if (options?.spa) params.set("spa", options.spa);
  const qs = params.toString();
  return qs ? `/contact?${qs}` : "/contact";
}
