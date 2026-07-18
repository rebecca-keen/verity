import Link from "next/link";
import type { Spa } from "@/lib/types";
import { formatGoogleRating } from "@/lib/spa-display";
import { TrustBadge } from "./TrustBadge";
import { TreatmentTags } from "./TreatmentTags";
import { ProviderTypeBadge } from "./ProviderTypeBadge";
import { SpaCardThumbnail } from "./SpaCardThumbnail";

export function SpaCard({ spa }: { spa: Spa }) {
  const googleRating = formatGoogleRating(spa);

  return (
    <Link
      href={`/providers/${spa.slug}`}
      className="group luxury-border relative block overflow-hidden rounded-2xl bg-white transition hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden">
        <SpaCardThumbnail spa={spa} />
      </div>
      <div className="p-5">
        <TrustBadge listingStatus={spa.listingStatus} premierPartner={spa.premierPartner} />
        <div className="mt-3">
          <ProviderTypeBadge type={spa.providerType} />
        </div>
        <h3 className="mt-2 font-serif text-xl text-charcoal">{spa.name}</h3>
        <p className="text-sm text-stone">
          {spa.neighborhood}, {spa.city}
          {spa.state ? `, ${spa.state}` : ""}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-stone">{spa.tagline}</p>
        <div className="mt-3">
          <TreatmentTags treatments={spa.treatments} />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          {googleRating ? (
            <span className="text-gold">{googleRating}</span>
          ) : (
            <span className="text-gold">★ {spa.rating}</span>
          )}
          {googleRating && spa.reviewCount > 0 && (
            <span className="text-stone">{spa.reviewCount} Google reviews</span>
          )}
          <span className="text-stone">{spa.priceRange}</span>
        </div>
      </div>
    </Link>
  );
}
