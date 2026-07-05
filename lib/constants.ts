export function contactFormUrl(options?: { subject?: string; topic?: string; spa?: string }): string {
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.topic) params.set("topic", options.topic);
  if (options?.spa) params.set("spa", options.spa);
  const qs = params.toString();
  return qs ? `/contact?${qs}` : "/contact";
}
