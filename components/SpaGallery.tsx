import Image from "next/image";
import type { Spa } from "@/lib/types";

export function SpaGallery({ spa }: { spa: Spa }) {
  const gridImages = spa.gallery.slice(0, 3);

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
            <Image src={src} alt={`${spa.name} photo ${i + 1}`} fill className="object-cover" sizes="200px" />
          </div>
        ))}
      </div>
    </div>
  );
}
