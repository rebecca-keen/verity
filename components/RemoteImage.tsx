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

  if (failed) return null;

  const isUnsplash = src.includes("images.unsplash.com");

  if (isUnsplash) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={handleError}
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
