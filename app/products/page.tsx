import { permanentRedirect } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string }>;
}) {
  const { origin } = await searchParams;
  permanentRedirect(origin ? `/shop?origin=${origin}` : "/shop");
}
