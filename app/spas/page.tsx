import { SpaDirectory } from "@/components/SpaDirectory";

export const metadata = {
  title: "Aesthetics Clinics & Med Spas — Verity",
  description:
    "Browse verified aesthetics clinics, med spas, and dermatology practices across the United States. Filter by state, city, and neighborhood.",
};

export default function SpasPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Discovery</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Aesthetics clinics &amp; med spas</h1>
      <p className="mt-3 max-w-2xl text-stone">
        Verified aesthetics clinics, med spas, and dermatology practices across the United States.
        Start with state, then city — optionally narrow by neighborhood or search by name.
        Listings are sorted by rating and review count.
      </p>
      <SpaDirectory />
    </div>
  );
}
