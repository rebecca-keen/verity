import Image from "next/image";

export function InstagramFeed({ handle }: { handle: string }) {
  const placeholders = [
    "https://images.unsplash.com/photo-1616394584738-fc6e612e781b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1515377905703-c4788e51ad09?w=300&h=300&fit=crop",
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-charcoal">Instagram</h3>
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gold hover:underline"
        >
          @{handle}
        </a>
      </div>
      <p className="mt-1 text-xs text-stone">
        Connected profile — full auto-sync for Partner providers
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {placeholders.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
            <Image src={src} alt="" fill className="object-cover" sizes="150px" />
          </div>
        ))}
      </div>
    </div>
  );
}
