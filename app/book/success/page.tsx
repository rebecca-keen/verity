import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Booking — Verity",
  description: "Verity does not process bookings on-site. Contact providers directly from their profiles.",
  path: "/book/success",
  noIndex: true,
});

export default async function BookingSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="font-serif text-3xl text-charcoal">Contact providers directly</h1>
      <p className="mt-4 text-stone">
        Verity does not process bookings on-site. Use call, website, or Instagram links on each
        provider profile to schedule directly with the practice.
      </p>
      <Link
        href="/providers"
        className="mt-8 inline-block rounded-full bg-charcoal px-8 py-3 text-sm text-ivory"
      >
        Browse providers
      </Link>
    </div>
  );
}
