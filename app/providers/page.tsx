import type { Metadata } from "next";
import { SpaDirectory } from "@/components/SpaDirectory";
import { isTreatmentCategory, providersPageMetadata, TREATMENT_CATEGORY_SEO } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string; category?: string }>;
}): Promise<Metadata> {
  const { state, city, category } = await searchParams;
  const treatmentCategory = isTreatmentCategory(category) ? category : undefined;

  return providersPageMetadata({ category: treatmentCategory, state, city });
}

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string; category?: string }>;
}) {
  const { state, city, category } = await searchParams;
  const treatmentCategory = isTreatmentCategory(category) ? category : undefined;
  const categorySeo = treatmentCategory ? TREATMENT_CATEGORY_SEO[treatmentCategory] : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      <p className="text-xs uppercase tracking-widest text-gold">Discovery</p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">
        {categorySeo?.h1 ?? "Find med spas & medical aesthetics providers"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-stone">
        {categorySeo?.intro ??
          "Search med spas, aesthetics clinics, and dermatology practices for injectables, laser treatments, facials, and skincare. Filter by location and treatment type — sorted by public ratings where available."}
      </p>
      <SpaDirectory initialState={state} initialCity={city} initialCategory={treatmentCategory} />
    </div>
  );
}
