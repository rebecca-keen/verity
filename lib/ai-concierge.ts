import { spas } from "./data";
import type { ConciergeMatch, ProviderType, Treatment } from "./types";
import { METRO_LABELS } from "./spa-utils";

const KEYWORDS: Record<string, { treatments: Treatment[]; tags: string[] }> = {
  botox: { treatments: ["botox"], tags: ["injectables", "wrinkles", "preventive"] },
  filler: { treatments: ["fillers"], tags: ["lips", "volume", "injectables"] },
  lip: { treatments: ["fillers"], tags: ["lips", "natural"] },
  laser: { treatments: ["laser"], tags: ["resurfacing", "pigmentation", "acne scars"] },
  facial: { treatments: ["facial"], tags: ["sensitive", "first time", "luxury"] },
  sensitive: { treatments: ["facial"], tags: ["fragrance-free", "gentle", "allergy"] },
  luxury: { treatments: ["laser", "fillers"], tags: ["premium", "exclusive"] },
  premium: { treatments: ["laser", "fillers"], tags: ["premium"] },
  first: { treatments: ["facial", "botox"], tags: ["first time", "consultation"] },
  microneedling: { treatments: ["microneedling"], tags: ["texture", "collagen"] },
  body: { treatments: ["body-contouring"], tags: ["sculpting", "contouring"] },
  budget: { treatments: ["facial"], tags: ["affordable"] },
  affordable: { treatments: ["botox", "facial"], tags: ["affordable"] },
  brickell: { treatments: [], tags: ["brickell"] },
  beach: { treatments: ["facial"], tags: ["miami beach", "south beach"] },
  coral: { treatments: ["botox", "fillers"], tags: ["coral gables", "coral way"] },
  wynwood: { treatments: ["fillers", "botox"], tags: ["wynwood"] },
  aventura: { treatments: [], tags: ["aventura", "sunny isles"] },
  kendall: { treatments: [], tags: ["kendall"] },
  grove: { treatments: ["facial"], tags: ["coconut grove"] },
  miami: { treatments: [], tags: ["miami", "south florida", "brickell", "coral gables"] },
  "fort lauderdale": { treatments: [], tags: ["fort lauderdale", "las olas", "broward", "hollywood"] },
  broward: { treatments: [], tags: ["fort lauderdale", "broward", "hollywood", "pompano"] },
  tampa: { treatments: [], tags: ["tampa", "hyde park", "south tampa", "westshore", "clearwater", "st. petersburg", "tampa bay"] },
  "st. petersburg": { treatments: [], tags: ["st. petersburg", "st petersburg", "tampa bay"] },
  "st petersburg": { treatments: [], tags: ["st. petersburg", "tampa bay"] },
  clearwater: { treatments: [], tags: ["clearwater", "tampa bay"] },
  sarasota: { treatments: [], tags: ["sarasota", "bradenton", "siesta key", "lakewood ranch"] },
  bradenton: { treatments: [], tags: ["bradenton", "sarasota"] },
  orlando: { treatments: [], tags: ["orlando", "winter park", "dr. phillips", "lake nona", "downtown orlando", "central florida"] },
  "winter park": { treatments: [], tags: ["winter park", "orlando"] },
  lakeland: { treatments: [], tags: ["lakeland", "central florida"] },
  daytona: { treatments: [], tags: ["daytona beach", "ormond beach", "space coast"] },
  jacksonville: { treatments: [], tags: ["jacksonville", "san marco", "riverside", "ponte vedra", "jacksonville beach", "north florida"] },
  jax: { treatments: [], tags: ["jacksonville", "jax beach"] },
  gainesville: { treatments: [], tags: ["gainesville", "haile plantation", "north florida"] },
  tallahassee: { treatments: [], tags: ["tallahassee", "college town", "north florida"] },
  pensacola: { treatments: [], tags: ["pensacola", "gulf breeze", "navarre", "north florida"] },
  naples: { treatments: [], tags: ["naples", "fifth avenue", "north naples", "bonita springs", "southwest florida"] },
  "fort myers": { treatments: [], tags: ["fort myers", "cape coral", "southwest florida"] },
  "cape coral": { treatments: [], tags: ["cape coral", "fort myers"] },
  "palm beach": { treatments: [], tags: ["palm beach", "boca", "boca raton", "west palm", "delray", "south florida"] },
  boca: { treatments: [], tags: ["boca raton", "boca"] },
  "west palm": { treatments: [], tags: ["west palm beach"] },
  delray: { treatments: [], tags: ["delray beach"] },
  "port st. lucie": { treatments: [], tags: ["port st. lucie", "stuart", "jensen beach", "treasure coast"] },
  "port st lucie": { treatments: [], tags: ["port st. lucie", "treasure coast"] },
  stuart: { treatments: [], tags: ["stuart", "treasure coast"] },
  "key west": { treatments: [], tags: ["key west", "keys", "islamorada", "key largo"] },
  keys: { treatments: [], tags: ["key west", "islamorada", "key largo"] },
  florida: { treatments: [], tags: [] },
  dermatology: { treatments: ["laser", "facial"], tags: ["dermatology"] },
  aesthetics: { treatments: ["botox", "fillers", "facial"], tags: ["aesthetics"] },
  clinic: { treatments: ["botox", "fillers"], tags: ["aesthetics"] },
};

function scoreSpa(
  spa: (typeof spas)[0],
  wantedTreatments: Set<Treatment>,
  wantedTags: Set<string>,
  wantedProviderTypes: Set<ProviderType>
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (spa.verified) {
    score += 15;
    reasons.push("Verified license & medical director on file");
  }
  for (const t of wantedTreatments) {
    if (spa.treatments.includes(t)) {
      score += 25;
      reasons.push(`Offers ${t.replace("-", " ")}`);
    }
  }

  for (const type of wantedProviderTypes) {
    if (spa.providerType === type) {
      score += 12;
      reasons.push(`Matches your ${type.replace("-", " ")} preference`);
    }
  }

  const neighborhood = spa.neighborhood.toLowerCase();
  const city = spa.city.toLowerCase();
  const metroName = spa.metro ? METRO_LABELS[spa.metro].toLowerCase() : "";
  const stateName = spa.state.toLowerCase();
  for (const tag of wantedTags) {
    const tagLower = tag.toLowerCase();
    if (
      neighborhood.includes(tagLower) ||
      city.includes(tagLower) ||
      metroName.includes(tagLower) ||
      stateName.includes(tagLower)
    ) {
      score += 15;
      reasons.push(`Located in ${spa.neighborhood}, ${spa.city}`);
    }
    if (tag === "affordable" && (spa.priceRange === "$$" || spa.priceRange === "$")) score += 10;
    if (tag === "premium" && spa.priceRange === "$$$$") score += 10;
    if (tag === "transparency" && spa.highlights.some((h) => h.toLowerCase().includes("disclosure"))) {
      score += 12;
    }
  }

  score += spa.rating * 4;
  return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

export function matchSpas(query: string): ConciergeMatch[] {
  const lower = query.toLowerCase();
  const wantedTreatments = new Set<Treatment>();
  const wantedTags = new Set<string>();
  const wantedProviderTypes = new Set<ProviderType>();

  if (lower.includes("dermatology") || lower.includes("derm ")) {
    wantedProviderTypes.add("dermatology-aesthetics");
  }
  if (lower.includes("aesthetics clinic") || lower.includes("aesthetics practice")) {
    wantedProviderTypes.add("aesthetics-clinic");
  }
  if (lower.includes("med spa") || lower.includes("medspa")) {
    wantedProviderTypes.add("med-spa");
  }
  if (lower.includes("aesthetics") && !lower.includes("dermatology")) {
    wantedProviderTypes.add("aesthetics-clinic");
  }

  for (const [key, config] of Object.entries(KEYWORDS)) {
    if (lower.includes(key)) {
      config.treatments.forEach((t) => wantedTreatments.add(t));
      config.tags.forEach((t) => wantedTags.add(t));
    }
  }

  if (wantedTreatments.size === 0 && wantedTags.size === 0) {
    wantedTags.add("luxury");
    wantedTreatments.add("facial");
  }

  return spas
    .map((spa) => {
      const { score, reasons } = scoreSpa(spa, wantedTreatments, wantedTags, wantedProviderTypes);
      return {
        spaSlug: spa.slug,
        spaName: spa.name,
        reason: reasons.join(". ") || `Highly rated verified provider in ${spa.city}`,
        matchScore: Math.min(99, score),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

export function buildConciergeReply(query: string, matches: ConciergeMatch[]): string {
  if (matches.length === 0) {
    return "I couldn't find a strong match yet. Try telling me your city or region, treatment (Botox, facial, laser), provider type (med spa, aesthetics clinic, dermatology), and budget — luxury or affordable.";
  }

  const top = matches[0];
  const lines = [
    "Based on what you shared, here are my top matches for med spas and aesthetics clinics:",
    "",
    ...matches.map(
      (m, i) =>
        `${i + 1}. **${m.spaName}** (${m.matchScore}% match)\n   ${m.reason}`
    ),
    "",
    `I'd start with **${top.spaName}** — they align best with your priorities.`,
    "",
    "Want me to narrow by budget, city, area, or a specific treatment?",
  ];

  return lines.join("\n");
}

export async function askConcierge(query: string): Promise<{ reply: string; matches: ConciergeMatch[] }> {
  const matches = matchSpas(query);

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const spaContext = spas
        .map(
          (s) =>
            `${s.name} (${s.neighborhood}, ${s.city}, ${s.state}${s.metro ? ` · ${METRO_LABELS[s.metro]}` : ""} — ${s.providerType}): ${s.tagline}. Treatments: ${s.treatments.join(", ")}. Rating: ${s.rating}`
        )
        .join("\n");

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Verity Concierge, a luxury aesthetics advisor for verified med spas, aesthetics clinics, and dermatology practices across the United States. Be warm, concise, and trust-focused. Never give medical advice. Recommend from this list only:\n${spaContext}\n\nTop algorithmic matches: ${JSON.stringify(matches)}`,
            },
            { role: "user", content: query },
          ],
          max_tokens: 400,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return { reply, matches };
      }
    } catch {
      /* fall through */
    }
  }

  return { reply: buildConciergeReply(query, matches), matches };
}
