import type { ProviderType } from "@/lib/types";
import { getProviderTypeLabel } from "@/lib/spa-utils";

export function ProviderTypeBadge({ type }: { type: ProviderType }) {
  return (
    <span className="rounded-full border border-stone/20 bg-cream px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone">
      {getProviderTypeLabel(type)}
    </span>
  );
}
