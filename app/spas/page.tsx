import { permanentRedirect } from "next/navigation";
import { localRedirectTarget } from "@/lib/geo-routes";

export default async function SpasPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string }>;
}) {
  const { state, city } = await searchParams;
  // Send straight to the canonical local landing page when we can, to avoid a
  // redirect chain (legacy /spas → /providers → /med-spas).
  const localTarget = localRedirectTarget({ state, city });
  if (localTarget) permanentRedirect(localTarget);

  const params = new URLSearchParams();
  if (state) params.set("state", state);
  if (city) params.set("city", city);
  const qs = params.toString();
  permanentRedirect(qs ? `/providers?${qs}` : "/providers");
}
