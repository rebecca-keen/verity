"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK =
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop";

type RemoteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** When set, failed loads call this instead of swapping to the global fallback. */
  onFailed?: () => void;
};

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

  const resolved = failed ? FALLBACK : src;
  const isUnsplash = resolved.includes("images.unsplash.com");

  if (isUnsplash) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={handleError}
      />
    );
  }

  const imgClass = fill ? `absolute inset-0 h-full w-full object-cover ${className}` : className;

  return (
    // Native img bypasses next/image remotePatterns — required for 195+ provider CDNs.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={imgClass}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={handleError}
    />
  );
}
