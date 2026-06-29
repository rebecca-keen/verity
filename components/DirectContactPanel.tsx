import type { Spa } from "@/lib/types";
import {
  getGoogleMapsSearchUrl,
  getPublicPhone,
  getPublicSocialLinks,
  getPublicWebsite,
  getPhoneTelHref,
} from "@/lib/spa-link-utils";

export function DirectContactPanel({ spa }: { spa: Spa }) {
  const phone = getPublicPhone(spa);
  const website = getPublicWebsite(spa);
  const instagram = getPublicSocialLinks(spa).find((link) => link.key === "instagram");
  const mapsUrl = getGoogleMapsSearchUrl(spa);

  return (
    <div className="luxury-border space-y-4 rounded-2xl bg-white p-6">
      <h3 className="font-serif text-xl text-charcoal">Contact {spa.name}</h3>
      <p className="text-sm text-stone">
        Connect directly with the provider — Verity does not host messages or store your contact info.
      </p>

      <div className="space-y-3">
        {phone && (
          <a
            href={getPhoneTelHref(phone)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3 text-sm font-medium tracking-wider text-ivory transition hover:bg-charcoal/90"
          >
            Call {phone}
          </a>
        )}

        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-charcoal py-3 text-sm font-medium tracking-wider text-charcoal transition hover:bg-cream"
          >
            Visit website & book
          </a>
        ) : (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-charcoal py-3 text-sm font-medium tracking-wider text-charcoal transition hover:bg-cream"
          >
            Find on Google Maps
          </a>
        )}

        {instagram && (
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 py-3 text-sm font-medium tracking-wider text-charcoal transition hover:bg-gold/20"
          >
            Message on Instagram
          </a>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-stone/20 py-3 text-sm text-stone transition hover:border-gold hover:text-charcoal"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
