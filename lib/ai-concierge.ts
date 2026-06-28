import { spas } from "./data";
import type { ConciergeMatch, Treatment } from "./types";

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
};

function scoreSpa(
  spa: (typeof spas)[0],
  wantedTreatments: Set<Treatment>,
  wantedTags: Set<string>
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (spa.verified) {
    score += 15;
    reasons.push("Verified license & medical director on file");
  }
  if (spa.premierPartner) {
    score += 20;
    reasons.push("Premier Partner — full product disclosure & priority listing");
  }

  for (const t of wantedTreatments) {
    if (spa.treatments.includes(t)) {
      score += 25;
      reasons.push(`Offers ${t.replace("-", " ")}`);
    }
  }

  const neighborhood = spa.neighborhood.toLowerCase();
  for (const tag of wantedTags) {
    if (neighborhood.includes(tag.toLowerCase())) {
      score += 15;
      reasons.push(`Located in ${spa.neighborhood}`);
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
      const { score, reasons } = scoreSpa(spa, wantedTreatments, wantedTags);
      return {
        spaSlug: spa.slug,
        spaName: spa.name,
        reason: reasons.join(". ") || "Highly rated verified med spa in Miami",
        matchScore: Math.min(99, score),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

export function buildConciergeReply(query: string, matches: ConciergeMatch[]): string {
  if (matches.length === 0) {
    return "I couldn't find a strong match yet. Try telling me your neighborhood, treatment (Botox, facial, laser), and budget — luxury or affordable.";
  }

  const top = matches[0];
  const lines = [
    "Based on what you shared, here are my top Miami matches:",
    "",
    ...matches.map(
      (m, i) =>
        `${i + 1}. **${m.spaName}** (${m.matchScore}% match)\n   ${m.reason}`
    ),
    "",
    `I'd start with **${top.spaName}** — they align best with your priorities.`,
    "",
    "Want me to narrow by budget, neighborhood, or a specific treatment?",
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
            `${s.name} (${s.neighborhood}): ${s.tagline}. Treatments: ${s.treatments.join(", ")}. Premier: ${s.premierPartner}. Rating: ${s.rating}`
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
              content: `You are Verity Concierge, a luxury med spa advisor for Miami. You help users find reputable, verified med spas. Be warm, concise, and trust-focused. Never give medical advice. Recommend from this list only:\n${spaContext}\n\nTop algorithmic matches: ${JSON.stringify(matches)}`,
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
