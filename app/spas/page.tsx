import { SpaDirectory } from "@/components/SpaDirectory";
import { spas } from "@/lib/data";

export const metadata = {
  title: "Miami Aesthetics Clinics & Med Spas — Verity",
  description: `Browse ${spas.length} verified aesthetics clinics, med spas, and dermatology practices across Greater Miami.`,
};

export default function SpasPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Discovery</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Miami aesthetics clinics & med spas</h1>
      <p className="mt-3 max-w-2xl text-stone">
        {spas.length} verified aesthetics clinics, med spas, and dermatology practices across Greater
        Miami and South Florida. Filter by provider type and neighborhood. Premier Partners disclose
        every product used in treatment.
      </p>
      <SpaDirectory />
    </div>
  );
}
