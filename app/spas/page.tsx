import { redirect } from "next/navigation";

export default async function SpasPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string }>;
}) {
  const { state, city } = await searchParams;
  const params = new URLSearchParams();
  if (state) params.set("state", state);
  if (city) params.set("city", city);
  const qs = params.toString();
  redirect(qs ? `/providers?${qs}` : "/providers");
}
