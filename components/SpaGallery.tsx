"use client";

import { useMemo, useState } from "react";
import type { Spa } from "@/lib/types";
import { RemoteImage } from "./RemoteImage";

export function SpaGallery({ spa }: { spa: Spa }) {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());

  const gridImages = useMemo(
    () => spa.gallery.filter((src) => !failed.has(src)).slice(0, 3),
    [spa.gallery, failed]
  );

  function markFailed(src: string) {
    setFailed((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }

  if (gridImages.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-charcoal">Gallery</h3>
        {spa.socials.instagram && (
          <a
            href={`https://instagram.com/${spa.socials.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold hover:underline"
          >
            @{spa.socials.instagram}
          </a>
        )}
      </div>
      <p className="mt-1 text-xs text-stone">Photo source: {spa.imageSource}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {gridImages.map((src, i) => (
          <div key={`${src}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <RemoteImage
              src={src}
              alt={`${spa.name} photo ${i + 1}`}
              fill
              className="object-cover"
              sizes="200px"
              onFailed={() => markFailed(src)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
