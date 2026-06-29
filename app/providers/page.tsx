import { SpaDirectory } from "@/components/SpaDirectory";

export const metadata = {
  title: "Find verified providers — Verity",
  description:
    "Browse verified aesthetics clinics, med spas, and dermatology practices across the United States. Filter by state, city, and neighborhood.",
};

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string }>;
}) {
  const { state, city } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      <p className="text-xs uppercase tracking-widest text-gold">Discovery</p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">Find verified providers</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone">
        Search by city or name, filter by location and treatment. Sorted by rating and review count.
      </p>
      <SpaDirectory initialState={state} initialCity={city} />
    </div>
  );
}
