import type { Spa } from "@/lib/types";

function mapsSearchUrl(spa: Spa) {
  const query = encodeURIComponent(`${spa.name}, ${spa.neighborhood}, ${spa.city}, FL`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function DirectContactPanel({ spa }: { spa: Spa }) {
  const instagramHandle = spa.socials.instagram;
  const instagramUrl = instagramHandle
    ? `https://instagram.com/${instagramHandle}`
    : null;

  return (
    <div className="luxury-border space-y-4 rounded-2xl bg-white p-6">
      <h3 className="font-serif text-xl text-charcoal">Contact {spa.name}</h3>
      <p className="text-sm text-stone">
        Connect directly with the provider — Verity does not host messages or store your contact info.
      </p>

      <div className="space-y-3">
        <a
          href={`tel:${spa.phone.replace(/[^\d+]/g, "")}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3 text-sm font-medium tracking-wider text-ivory transition hover:bg-charcoal/90"
        >
          Call {spa.phone}
        </a>

        <a
          href={spa.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-charcoal py-3 text-sm font-medium tracking-wider text-charcoal transition hover:bg-cream"
        >
          Visit website & book
        </a>

        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 py-3 text-sm font-medium tracking-wider text-charcoal transition hover:bg-gold/20"
          >
            Message on Instagram
          </a>
        )}

        <a
          href={mapsSearchUrl(spa)}
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
