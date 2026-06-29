/**
 * Appends affiliate tags from env when configured.
 * Base URLs in data.ts use neutral paths; tags are applied at runtime.
 * amzn.to short links are returned as-is (tracking embedded in redirect).
 */

export function getProductAffiliateUrl(
  affiliateUrl: string | undefined,
  affiliatePartner?: string
): string | undefined {
  if (!affiliateUrl) return undefined;

  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG;
  const sephoraAffId = process.env.NEXT_PUBLIC_SEPHORA_AFF_ID;

  if (affiliatePartner === "Amazon Associates") {
    if (affiliateUrl.includes("amzn.to/")) {
      return affiliateUrl;
    }
    if (amazonTag && affiliateUrl.includes("amazon.com")) {
      const url = new URL(affiliateUrl.split("?")[0]!);
      url.searchParams.set("tag", amazonTag);
      return url.toString();
    }
    return affiliateUrl;
  }

  if (affiliatePartner === "Sephora Affiliate") {
    const base = affiliateUrl.split("?")[0];
    if (sephoraAffId) {
      return `${base}?aff_id=${encodeURIComponent(sephoraAffId)}`;
    }
    return base;
  }

  return affiliateUrl.replace(/\?ref=verity$/, "").replace(/[?&]ref=verity/, "");
}

export function getAmazonShopLabel(affiliatePartner?: string): string {
  return affiliatePartner === "Amazon Associates" ? "Shop on Amazon" : "Shop";
}
