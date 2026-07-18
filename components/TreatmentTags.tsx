import type { Treatment } from "@/lib/types";
import { getTreatmentLabel } from "@/lib/spa-utils";

const TAG_COLORS: Record<Treatment, string> = {
  botox: "bg-charcoal text-ivory",
  fillers: "bg-charcoal/90 text-ivory",
  laser: "bg-gold/20 text-charcoal border border-gold/30",
  facial: "bg-sage/15 text-sage border border-sage/30",
  microneedling: "bg-sage/10 text-charcoal border border-sage/20",
  "body-contouring": "bg-stone/10 text-stone border border-stone/20",
};

type TreatmentTagsProps = {
  treatments: Treatment[];
  max?: number;
};

export function TreatmentTags({ treatments, max = 4 }: TreatmentTagsProps) {
  const visible = treatments.slice(0, max);
  if (visible.length === 0) return null;

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
