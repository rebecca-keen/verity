import Link from "next/link";
import Image from "next/image";
import type { Spa } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";
import { TreatmentCategories } from "./TreatmentCategories";
import { ProviderTypeBadge } from "./ProviderTypeBadge";

export function SpaCard({ spa }: { spa: Spa }) {
  return (
    <Link
      href={`/spas/${spa.slug}`}
      className="group luxury-border relative block overflow-hidden rounded-2xl bg-white transition hover:shadow-lg"
    >
      {spa.featuredPremium && (
        <div className="absolute left-0 right-0 top-0 z-10 bg-charcoal py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-gold">
          Featured Premium
        </div>
      )}
      <div className={`relative h-48 overflow-hidden ${spa.featuredPremium ? "mt-6" : ""}`}>
        <Image
          src={spa.image}
          alt={spa.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <TrustBadge
          verified={spa.verified}
          premierPartner={spa.premierPartner}
          featuredPremium={false}
        />
        <div className="mt-3">
          <ProviderTypeBadge type={spa.providerType} />
        </div>
        <h3 className="mt-2 font-serif text-xl text-charcoal">{spa.name}</h3>
        <p className="text-sm text-stone">
          {spa.neighborhood}, {spa.city}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-stone">{spa.tagline}</p>
        <div className="mt-3">
          <TreatmentCategories categories={spa.treatmentCategories} />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gold">★ {spa.rating}</span>
          <span className="text-stone">{spa.reviewCount} reviews</span>
          <span className="text-stone">{spa.priceRange}</span>
        </div>
      </div>
    </Link>
  );
}
