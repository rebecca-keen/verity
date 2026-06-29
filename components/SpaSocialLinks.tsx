import type { Spa } from "@/lib/types";

const SOCIAL_CONFIG = [
  { key: "instagram" as const, label: "Instagram", prefix: "https://instagram.com/" },
  { key: "facebook" as const, label: "Facebook", prefix: "https://facebook.com/" },
  { key: "tiktok" as const, label: "TikTok", prefix: "https://tiktok.com/@" },
  { key: "youtube" as const, label: "YouTube", prefix: "https://youtube.com/@" },
];

export function SpaSocialLinks({ spa, prominent = false }: { spa: Spa; prominent?: boolean }) {
  const links = SOCIAL_CONFIG.map(({ key, label, prefix }) => ({
    key,
    label,
    href: spa.socials[key] ? `${prefix}${spa.socials[key]}` : null,
  })).filter((l) => l.href);

  if (links.length === 0 && !spa.website) return null;

  return (
    <section className={prominent ? "luxury-border rounded-2xl bg-cream p-6" : ""}>
      <p className="text-xs uppercase tracking-widest text-gold">Connect</p>
      <h3 className="mt-1 font-serif text-lg text-charcoal">Follow & visit</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${spa.name} on ${link.label}`}
            className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-white px-4 py-2 text-xs font-medium text-charcoal transition hover:border-gold hover:shadow-sm"
          >
            <SocialIcon name={link.key} />
            {link.label}
          </a>
        ))}
        <a
          href={spa.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-charcoal transition hover:bg-gold/20"
        >
          <GlobeIcon />
          Website
        </a>
      </div>
      {!prominent && (
        <p className="mt-3 text-xs text-stone">
          {spa.phone} · {spa.neighborhood}, {spa.city}
        </p>
      )}
    </section>
  );
}

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    instagram:
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    facebook:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    tiktok:
      "M12.525.02c1.31-.02 2.61-.01 3.919-.02.08 1.13.63 2.08 1.445 2.704.807.627 1.865 1.004 2.977 1.004v3.015c-1.253-.027-2.453-.388-3.504-1.004-.525-.316-1.002-.704-1.416-1.152v7.824c0 3.328-2.697 6.025-6.025 6.025S.975 16.644.975 13.316c0-3.328 2.697-6.025 6.025-6.025.627 0 1.23.096 1.797.273v3.15a3.015 3.015 0 0 0-1.797-.585c-1.664 0-3.015 1.351-3.015 3.015s1.351 3.015 3.015 3.015 3.015-1.351 3.015-3.015V.02h3.495z",
    youtube:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  };

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d={paths[name] ?? paths.instagram} />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
