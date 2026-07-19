"use client";

import Image from "next/image";
import { useState } from "react";

type RemoteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** When set, failed loads call this instead of hiding the image. */
  onFailed?: () => void;
};

function ImageFallbackIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}

export function RemoteImage({
  src,
  alt,
  fill,
  className = "",
  sizes,
  priority,
  onFailed,
}: RemoteImageProps) {
  const [failed, setFailed] = useState(false);

  function handleError() {
    if (onFailed) {
      onFailed();
      return;
    }
    setFailed(true);
  }

  if (failed) {
    const fallbackClass = fill
      ? `absolute inset-0 flex items-center justify-center text-stone/40 ${className}`
      : `flex items-center justify-center text-stone/40 ${className}`;
    return (
      <div className={fallbackClass} role="img" aria-label={alt}>
        <ImageFallbackIcon className="h-1/2 w-1/2 max-h-8 max-w-8 min-h-[1.25rem] min-w-[1.25rem]" />
      </div>
    );
  }

  const isUnsplash = src.includes("images.unsplash.com");
  const isLocal = src.startsWith("/");

  if (isUnsplash || isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={handleError}
        unoptimized={isLocal && src.endsWith(".svg")}
      />
    );
  }

  const imgClass = fill
    ? `absolute inset-0 h-full w-full ${className.includes("object-") ? "" : "object-cover "}${className}`
    : className;

  return (
    // Native img bypasses next/image remotePatterns — required for 195+ provider CDNs.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={imgClass}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={handleError}
    />
  );
}
