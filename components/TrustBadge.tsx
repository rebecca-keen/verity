import type { Spa } from "@/lib/types";

export function TrustBadge({
  verified,
  cleanPartner,
}: {
  verified?: boolean;
  cleanPartner?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {verified && (
        <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
          Verified
        </span>
      )}
      {cleanPartner && (
        <span className="rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sage">
          Clean Partner
        </span>
      )}
    </div>
  );
}

export function TrustPanel({ spa }: { spa: Spa }) {
  return (
    <div className="luxury-border rounded-2xl bg-cream p-6">
      <h3 className="font-serif text-lg text-charcoal">Trust & Transparency</h3>
      <p className="mt-1 text-sm text-stone">
        What Yelp and RealSelf don&apos;t show — verified in one place.
      </p>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between border-b border-stone/10 pb-2">
          <dt className="text-stone">Medical Director</dt>
          <dd className="font-medium text-charcoal">{spa.medicalDirector}</dd>
        </div>
        <div className="flex justify-between border-b border-stone/10 pb-2">
          <dt className="text-stone">License ID</dt>
          <dd className="font-medium text-charcoal">{spa.licenseId}</dd>
        </div>
        <div className="flex justify-between border-b border-stone/10 pb-2">
          <dt className="text-stone">Years Operating</dt>
          <dd className="font-medium text-charcoal">{spa.yearsOpen}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">Products Disclosed</dt>
          <dd className="font-medium text-charcoal">{spa.productSlugs.length} on file</dd>
        </div>
      </dl>
      <ul className="mt-5 space-y-2">
        {spa.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-stone">
            <span className="mt-1 text-gold">✓</span>
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}
