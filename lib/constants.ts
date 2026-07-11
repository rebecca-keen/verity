export const DEFAULT_CONTACT_EMAIL = "hello@verityaesthetics.app";

/** Public inbox for mailto links — uses NEXT_PUBLIC_CONTACT_EMAIL when set. Server-side delivery uses CONTACT_EMAIL separately. */
export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
}

export function contactMailtoUrl(options?: {
  subject?: string;
  topic?: string;
  spa?: string;
}): string {
  const email = getContactEmail();
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);

  const bodyLines: string[] = [];
  if (options?.topic) bodyLines.push(`Topic: ${options.topic}`);
  if (options?.spa) bodyLines.push(`Practice / listing: ${options.spa}`);
  if (bodyLines.length > 0) {
    bodyLines.push("", "Your message:");
    params.set("body", bodyLines.join("\n"));
  }

  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}

export function contactFormUrl(options?: { subject?: string; topic?: string; spa?: string }): string {
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.topic) params.set("topic", options.topic);
  if (options?.spa) params.set("spa", options.spa);
  const qs = params.toString();
  return qs ? `/contact?${qs}` : "/contact";
}
