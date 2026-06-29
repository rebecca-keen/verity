import type { Spa } from "@/lib/types";

export function SpaSocialLinks({ spa }: { spa: Spa }) {
  const links = [
    { key: "instagram", label: "Instagram", href: spa.socials.instagram ? `https://instagram.com/${spa.socials.instagram}` : null },
    { key: "facebook", label: "Facebook", href: spa.socials.facebook ? `https://facebook.com/${spa.socials.facebook}` : null },
    { key: "tiktok", label: "TikTok", href: spa.socials.tiktok ? `https://tiktok.com/@${spa.socials.tiktok}` : null },
    { key: "youtube", label: "YouTube", href: spa.socials.youtube ? `https://youtube.com/@${spa.socials.youtube}` : null },
  ].filter((l) => l.href);

  if (links.length === 0) return null;

  return (
    <div>
      <h3 className="font-serif text-lg text-charcoal">Social & website</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-stone/20 px-4 py-2 text-xs text-stone transition hover:border-gold hover:text-charcoal"
          >
            {link.label}
          </a>
        ))}
        <a
          href={spa.website}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs text-charcoal transition hover:bg-gold/20"
        >
          Official website
        </a>
      </div>
      <p className="mt-2 text-xs text-stone">{spa.phone}</p>
    </div>
  );
}
