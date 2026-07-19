import type { Treatment } from "@/lib/types";
import { getTreatmentLabel } from "@/lib/spa-utils";

const TAG_COLORS: Record<Treatment, string> = {
  botox: "bg-charcoal text-ivory",
  fillers: "bg-charcoal/90 text-ivory",
  laser: "bg-gold/20 text-charcoal border border-gold/30",
  facial: "bg-sage/15 text-sage border border-sage/30",
  microneedling: "bg-sage/10 text-charcoal border border-sage/20",
  "body-contouring": "bg-stone/10 text-stone border border-stone/20",
  "weight-loss": "bg-amber-50 text-amber-900 border border-amber-200/60",
  "hormone-therapy": "bg-violet-50 text-violet-800 border border-violet-200/60",
  "hair-restoration": "bg-sky-50 text-sky-800 border border-sky-200/60",
  wellness: "bg-emerald-50 text-emerald-800 border border-emerald-200/60",
};

type TreatmentTagsProps = {
  treatments: Treatment[];
};

export function TreatmentTags({ treatments }: TreatmentTagsProps) {
  if (treatments.length === 0) return null;
  const visible = treatments;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((treatment) => (
        <span
          key={treatment}
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TAG_COLORS[treatment]}`}
        >
          {getTreatmentLabel(treatment)}
        </span>
      ))}
    </div>
  );
}
