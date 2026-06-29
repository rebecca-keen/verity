import Link from "next/link";
import Image from "next/image";
import { originLabels } from "@/lib/data";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group luxury-border overflow-hidden rounded-2xl bg-white transition hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-44 overflow-hidden bg-cream">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.origin && (
              <span className="rounded-full bg-charcoal/80 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-ivory backdrop-blur-sm">
                {originLabels[product.origin]}
              </span>
            )}
            {product.premium && (
              <span className="rounded-full bg-gold/90 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-charcoal backdrop-blur-sm">
                Premium
              </span>
            )}
          </div>
        </div>
        <div className="p-5 pb-3">
          <p className="text-xs uppercase tracking-widest text-stone">{product.brand}</p>
          <h3 className="mt-1 font-serif text-lg text-charcoal">{product.name}</h3>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone">Trust Score</p>
              <p className="text-lg font-semibold text-sage">{product.trustScore}</p>
            </div>
            <div className="text-right">
              <p className="text-gold">★ {product.rating}</p>
              <p className="text-xs text-stone">{product.reviewCount} reviews</p>
            </div>
          </div>
        </div>
      </Link>
      {product.affiliateUrl && (
        <div className="px-5 pb-5">
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="block w-full rounded-full border border-gold/40 bg-cream py-2 text-center text-xs font-medium uppercase tracking-wider text-charcoal transition hover:border-gold hover:bg-gold/10"
          >
            Shop
          </a>
        </div>
      )}
    </article>
  );
}
