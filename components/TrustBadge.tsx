import type { Spa } from "@/lib/types";

export function TrustBadge({
  verified,
  premierPartner,
  featuredPremium,
}: {
  verified?: boolean;
  premierPartner?: boolean;
  featuredPremium?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {featuredPremium && (
        <span className="rounded-full bg-charcoal px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
          Featured Premium
        </span>
      )}
      {verified && (
        <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
          Verified
        </span>
      )}
      {premierPartner && (
        <span className="rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sage">
          Premier Partner
        </span>
      )}
    </div>
  );
}

export function TrustPanel({ spa }: { spa: Spa }) {
  return (
    <div className="luxury-border rounded-2xl bg-cream p-6">
      <h3 className="font-serif text-lg text-charcoal">Trust & credentials</h3>
      <p className="mt-1 text-sm text-stone">
        Aggregated from multiple verified sources — not self-reported alone.
      </p>

      <div className="mt-5 rounded-xl bg-white p-4">
        <p className="text-xs uppercase tracking-widest text-gold">Medical director</p>
        <p className="mt-1 font-medium text-charcoal">{spa.medicalDirectorInfo.name}</p>
        <p className="text-sm text-stone">{spa.medicalDirectorInfo.credentials}</p>
        {spa.medicalDirectorInfo.boardCertifications.length > 0 && (
          <ul className="mt-2 space-y-1">
            {spa.medicalDirectorInfo.boardCertifications.map((b) => (
              <li key={b} className="text-xs text-stone">
                ✓ {b}
              </li>
            ))}
          </ul>
        )}
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between border-b border-stone/10 pb-2">
          <dt className="text-stone">License ID</dt>
          <dd className="font-medium text-charcoal">{spa.licenseId}</dd>
        </div>
        <div className="flex justify-between border-b border-stone/10 pb-2">
          <dt className="text-stone">Years operating</dt>
          <dd className="font-medium text-charcoal">{spa.yearsOpen}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">Products disclosed</dt>
          <dd className="font-medium text-charcoal">{spa.productSlugs.length} on file</dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-widest text-stone">Certifications</p>
        <ul className="mt-2 space-y-1">
          {spa.certifications.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-stone">
              <span className="text-gold">✓</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-widest text-stone">Data sources</p>
        <ul className="mt-2 space-y-1">
          {spa.dataSources.map((s) => (
            <li key={s} className="text-xs text-stone">
              · {s}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-5 space-y-2 border-t border-stone/10 pt-4">
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
