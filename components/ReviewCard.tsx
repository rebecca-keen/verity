import type { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="luxury-border rounded-xl bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-charcoal">{review.author}</span>
          {review.verifiedVisit && (
            <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
              Verified Visit
            </span>
          )}
        </div>
        <span className="text-gold">{"★".repeat(review.rating)}</span>
      </div>
      {review.treatment && (
        <p className="mt-1 text-xs text-stone">Treatment: {review.treatment}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-stone">{review.text}</p>
      <p className="mt-3 text-xs text-stone/70">{review.date}</p>
    </article>
  );
}
