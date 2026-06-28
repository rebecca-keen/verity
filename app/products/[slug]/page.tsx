import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SpaCard } from "@/components/SpaCard";
import { ReviewCard } from "@/components/ReviewCard";
import { getProduct, getProductReviews, getSpasForProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const productReviews = getProductReviews(slug);
  const linkedSpas = getSpasForProduct(slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="50vw" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-stone">{product.brand}</p>
          <h1 className="mt-2 font-serif text-4xl text-charcoal">{product.name}</h1>
          <p className="mt-2 text-stone">{product.category}</p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-xs text-stone">Clean Score</p>
              <p className="text-3xl font-semibold text-sage">{product.cleanScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-stone">Rating</p>
              <p className="text-3xl text-gold">★ {product.rating}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.cleanTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sage/10 px-3 py-1 text-xs capitalize text-sage"
              >
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-stone">{product.description}</p>
          <div className="mt-6">
            <p className="text-sm font-medium text-charcoal">Key ingredients</p>
            <p className="mt-1 text-sm text-stone">{product.ingredients.join(" · ")}</p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-charcoal">Miami spas that use this</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {linkedSpas.map((spa) => (
            <SpaCard key={spa.slug} spa={spa} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-charcoal">Reviews</h2>
        <div className="mt-4 space-y-4">
          {productReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link href="/concierge" className="text-gold hover:underline">
          Ask AI which product fits your skin goals →
        </Link>
      </div>
    </div>
  );
}
