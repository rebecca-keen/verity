import Link from "next/link";
import type { Spa } from "@/lib/types";
import {
  resolveLicenseVerification,
  resolveMedicalDirectorInfo,
} from "@/lib/spa-trust";
import { getStateBoardName, getStateBoardUrl } from "@/lib/verification-links";

export function TrustBadge({
  listingStatus,
  premierPartner,
  featuredPremium,
}: {
  listingStatus?: Spa["listingStatus"];
  premierPartner?: boolean;
  featuredPremium?: boolean;
}) {
  const status = listingStatus ?? "listed";

  return (
    <div className="flex flex-wrap gap-2">
      {featuredPremium && (
        <span className="rounded-full bg-charcoal px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
          Featured Premium
        </span>
      )}
      {status === "verified-partner" ? (
        <span
          className="rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sage"
          title="Paid Verity partner with enhanced profile review"
        >
          Verified Partner
        </span>
      ) : (
        <span
          className="rounded-full border border-stone/25 bg-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-stone"
          title="Public directory listing — not a state license confirmation"
        >
          Listed
        </span>
      )}
      {premierPartner && status !== "verified-partner" && (
        <span className="rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sage">
          Premier Partner
        </span>
      )}
    </div>
  );
}

export function TrustPanel({ spa }: { spa: Spa }) {
  const md = resolveMedicalDirectorInfo(spa);
  const license = resolveLicenseVerification(spa);
  const boardName = getStateBoardName(spa.state);
  const boardUrl = getStateBoardUrl(spa.state);

  return (
    <div className="luxury-border rounded-2xl bg-cream p-6">
      <h3 className="font-serif text-lg text-charcoal">Trust & credentials</h3>
      <p className="mt-1 text-sm text-stone">
        Aggregated from public sources. Medical licenses and director credentials should be confirmed
        with the practice or your state board.
      </p>

      <div className="mt-5 rounded-xl bg-white p-4">
        <p className="text-xs uppercase tracking-widest text-gold">Medical director</p>
        {md.source === "practice-website" ? (
          <>
            <p className="mt-1 font-medium text-charcoal">{md.name}</p>
            {md.credentials && <p className="text-sm text-stone">{md.credentials}</p>}
            <p className="mt-2 text-xs text-stone">{md.displayNote}</p>
          </>
        ) : (
          <>
            <p className="mt-1 font-medium text-charcoal">{md.name}</p>
            <p className="text-sm text-stone">{md.credentials}</p>
            <p className="mt-2 text-xs text-stone">{md.displayNote}</p>
          </>
        )}
        <a
          href={boardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-gold hover:underline"
        >
          Look up provider on {boardName} →
        </a>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between border-b border-stone/10 pb-2">
          <dt className="text-stone">{license.label}</dt>
          <dd className="text-right font-medium text-charcoal">
            {license.showLicenseId && spa.licenseId ? (
              <span className="block">{spa.licenseId}</span>
            ) : null}
            <a
              href={license.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              {license.linkText} →
            </a>
          </dd>
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

      <Link href="/how-we-verify" className="mt-5 inline-block text-sm text-gold hover:underline">
        How we verify →
      </Link>
    </div>
  );
}
