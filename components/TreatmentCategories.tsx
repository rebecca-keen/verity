import type { Spa, TreatmentCategory } from "@/lib/types";
import { getCategoryLabel } from "@/lib/spa-utils";

const CATEGORY_COLORS: Record<TreatmentCategory, string> = {
  injectables: "bg-charcoal text-ivory",
  lasers: "bg-gold/20 text-charcoal border border-gold/30",
  beauty: "bg-sage/15 text-sage border border-sage/30",
  body: "bg-stone/10 text-stone border border-stone/20",
  wellness: "bg-emerald-50 text-emerald-800 border border-emerald-200/60",
  "weight-loss": "bg-amber-50 text-amber-900 border border-amber-200/60",
  "hormone-therapy": "bg-violet-50 text-violet-800 border border-violet-200/60",
  "hair-restoration": "bg-sky-50 text-sky-800 border border-sky-200/60",
  "iv-therapy": "bg-teal-50 text-teal-800 border border-teal-200/60",
  "mens-health": "bg-slate-100 text-slate-800 border border-slate-200/60",
  "womens-health": "bg-rose-50 text-rose-800 border border-rose-200/60",
};

export function TreatmentCategories({ categories }: { categories: TreatmentCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <span
          key={cat}
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[cat]}`}
        >
          {getCategoryLabel(cat)}
        </span>
      ))}
    </div>
  );
}
