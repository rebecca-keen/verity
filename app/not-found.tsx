import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">404</p>
      <h1 className="mt-4 font-serif text-4xl text-charcoal">Page not found</h1>
      <p className="mt-4 text-stone">
        This page doesn&apos;t exist or may have moved. Try browsing providers or ask our AI Concierge
        for a match.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/providers"
          className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory"
        >
          Browse providers
        </Link>
        <Link
          href="/concierge"
          className="rounded-full border border-charcoal px-8 py-3 text-sm font-medium tracking-wider text-charcoal"
        >
          AI Concierge
        </Link>
      </div>
      <Link href="/" className="mt-8 inline-block text-sm text-gold hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
