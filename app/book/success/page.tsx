import Link from "next/link";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ spa?: string }>;
}) {
  const { spa } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <p className="text-4xl text-gold">✓</p>
      <h1 className="mt-4 font-serif text-3xl text-charcoal">Request sent</h1>
      <p className="mt-4 text-stone">
        {spa ? `${spa} will confirm your appointment within 2 hours.` : "The spa will confirm shortly."}
        You&apos;ll receive an email confirmation.
      </p>
      <Link
        href="/providers"
        className="mt-8 inline-block rounded-full bg-charcoal px-8 py-3 text-sm text-ivory"
      >
        Browse more spas
      </Link>
    </div>
  );
}
