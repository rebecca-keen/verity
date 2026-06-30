"use client";

import { useMemo, useState } from "react";
import type { Spa } from "@/lib/types";
import { RemoteImage } from "./RemoteImage";

function isGenericStock(url: string) {
  return (
    url.includes("images.unsplash.com") ||
    /placeholder\.png/i.test(url) ||
    /placeholder|pending spa upload|stock imagery/i.test(url)
  );
}

/** Logo → hero → gallery; skip stock/unsplash/placeholder. */
function cardImageUrls(spa: Spa): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  const push = (url?: string) => {
    if (!url || seen.has(url) || isGenericStock(url)) return;
    seen.add(url);
    urls.push(url);
  };
  push(spa.logo);
  push(spa.image);
  for (const url of spa.gallery ?? []) push(url);
  return urls;
}

function SpaPlaceholderIcon() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-stone/10 bg-white/80 shadow-sm">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-stone/50"
        aria-hidden
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 9h.01" />
        <path d="M15 9h.01" />
      </svg>
    </div>
  );
}

export function SpaCardThumbnail({ spa }: { spa: Spa }) {
  const urls = useMemo(() => cardImageUrls(spa), [spa]);
  const [idx, setIdx] = useState(0);
  const src = idx < urls.length ? urls[idx] : undefined;
  const isLogo = src === spa.logo;

  if (src) {
    if (isLogo) {
      return (
        <div className="flex h-full items-center justify-center bg-gradient-to-b from-cream to-white p-6">
          <div className="relative h-[70%] w-[85%] max-w-[280px]">
            <RemoteImage
              src={src}
              alt={`${spa.name} logo`}
              fill
              className="object-contain drop-shadow-sm"
              sizes="(max-width: 768px) 100vw, 33vw"
              onFailed={() => setIdx((i) => i + 1)}
            />
          </div>
        </div>
      );
    }

    return (
      <RemoteImage
        src={src}
        alt={spa.name}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
        onFailed={() => setIdx((i) => i + 1)}
      />
    );
  }

  if (!spa.website) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-b from-cream to-stone/5">
        <SpaPlaceholderIcon />
      </div>
    );
  }

  return <div className="h-full bg-gradient-to-b from-cream to-stone/5" aria-hidden />;
}
