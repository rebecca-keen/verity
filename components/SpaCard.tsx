import Link from "next/link";
import Image from "next/image";
import type { Spa } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";

export function SpaCard({ spa }: { spa: Spa }) {
  return (
    <Link
      href={`/spas/${spa.slug}`}
      className="group luxury-border block overflow-hidden rounded-2xl bg-white transition hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={spa.image}
          alt={spa.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <TrustBadge verified={spa.verified} premierPartner={spa.premierPartner} />
        <h3 className="mt-3 font-serif text-xl text-charcoal">{spa.name}</h3>
        <p className="text-sm text-stone">
          {spa.neighborhood}, {spa.city}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-stone">{spa.tagline}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gold">★ {spa.rating}</span>
          <span className="text-stone">{spa.reviewCount} reviews</span>
          <span className="text-stone">{spa.priceRange}</span>
        </div>
      </div>
    </Link>
  );
}
