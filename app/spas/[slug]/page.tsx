import { permanentRedirect } from "next/navigation";

export default async function SpaDetailRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/providers/${slug}`);
}
