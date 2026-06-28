import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group luxury-border block overflow-hidden rounded-2xl bg-white transition hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="p-5">
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
  );
}
