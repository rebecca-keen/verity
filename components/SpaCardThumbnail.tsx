"use client";

import { useState } from "react";
import type { Spa } from "@/lib/types";
import { RemoteImage } from "./RemoteImage";

function isGenericStock(url: string) {
  return (
    url.includes("images.unsplash.com") ||
    /placeholder|pending spa upload|stock imagery/i.test(url)
  );
}

export function SpaCardThumbnail({ spa }: { spa: Spa }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);

  const heroCandidate = spa.image && !isGenericStock(spa.image) ? spa.image : null;

  if (spa.logo && !logoFailed) {
    return (
      <div className="flex h-full items-center justify-center bg-cream p-6">
        <RemoteImage
          src={spa.logo}
          alt={`${spa.name} logo`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 33vw"
          onFailed={() => setLogoFailed(true)}
        />
      </div>
    );
  }

  if (heroCandidate && !heroFailed) {
    return (
      <RemoteImage
        src={heroCandidate}
        alt={spa.name}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
        onFailed={() => setHeroFailed(true)}
      />
    );
  }

  const initial = spa.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-full items-center justify-center bg-cream">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-stone/10 bg-white shadow-sm">
        <span className="font-serif text-3xl text-charcoal/70">{initial}</span>
      </div>
    </div>
  );
}
