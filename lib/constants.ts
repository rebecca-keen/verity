export const CONTACT_EMAIL = "hello@verityaesthetics.app";

export function contactMailtoUrl(subject?: string): string {
  const base = `mailto:${CONTACT_EMAIL}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}
