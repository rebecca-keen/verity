import { spas } from "./data";
import type {
  ConciergeFilters,
  ConciergeMatch,
  ProviderType,
  Treatment,
  TreatmentCategory,
} from "./types";
import { METRO_LABELS } from "./spa-utils";

const RESULT_LIMIT = 10;
const MIN_SCORE = 15;

const KEYWORDS: Record<string, { treatments: Treatment[]; tags: string[] }> = {
  botox: { treatments: ["botox"], tags: ["injectables", "wrinkles", "preventive"] },
  filler: { treatments: ["fillers"], tags: ["lips", "volume", "injectables"] },
  injectable: { treatments: ["botox", "fillers"], tags: ["injectables"] },
  injectables: { treatments: ["botox", "fillers"], tags: ["injectables"] },
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
  california: { treatments: [], tags: ["california", "los angeles", "san diego"] },
  "los angeles": { treatments: [], tags: ["los angeles", "beverly hills", "santa monica", "west hollywood", "california"] },
  "san diego": { treatments: [], tags: ["san diego", "california", "la jolla"] },
  "new york": { treatments: [], tags: ["new york", "nyc", "manhattan", "brooklyn", "long island"] },
  nyc: { treatments: [], tags: ["new york", "manhattan", "brooklyn"] },
  manhattan: { treatments: [], tags: ["new york", "manhattan"] },
  brooklyn: { treatments: [], tags: ["new york", "brooklyn"] },
  chicago: { treatments: [], tags: ["chicago", "illinois", "lincoln park", "river north"] },
  atlanta: { treatments: [], tags: ["atlanta", "georgia", "buckhead", "midtown atlanta"] },
  houston: { treatments: [], tags: ["houston", "texas", "river oaks", "memorial"] },
  dallas: { treatments: [], tags: ["dallas", "texas", "uptown dallas", "highland park"] },
  austin: { treatments: [], tags: ["austin", "texas", "south congress", "downtown austin"] },
  texas: { treatments: [], tags: ["houston", "dallas", "austin", "texas"] },
  phoenix: { treatments: [], tags: ["phoenix", "arizona", "scottsdale", "paradise valley"] },
  scottsdale: { treatments: [], tags: ["scottsdale", "phoenix", "arizona"] },
  arizona: { treatments: [], tags: ["phoenix", "scottsdale", "arizona"] },
  denver: { treatments: [], tags: ["denver", "colorado", "cherry creek", "lodo"] },
  colorado: { treatments: [], tags: ["denver", "colorado"] },
  "las vegas": { treatments: [], tags: ["las vegas", "nevada", "summerlin", "henderson"] },
  vegas: { treatments: [], tags: ["las vegas", "nevada"] },
  nevada: { treatments: [], tags: ["las vegas", "nevada"] },
  nashville: { treatments: [], tags: ["nashville", "tennessee", "the gulch", "green hills"] },
  tennessee: { treatments: [], tags: ["nashville", "tennessee"] },
  charlotte: { treatments: [], tags: ["charlotte", "north carolina", "south end", "ballantyne"] },
  raleigh: { treatments: [], tags: ["raleigh", "north carolina", "durham", "triangle"] },
  "north carolina": { treatments: [], tags: ["charlotte", "raleigh", "north carolina"] },
  illinois: { treatments: [], tags: ["chicago", "illinois"] },
  georgia: { treatments: [], tags: ["atlanta", "georgia"] },
  dermatology: { treatments: ["laser", "facial"], tags: ["dermatology"] },
  aesthetics: { treatments: ["botox", "fillers", "facial"], tags: ["aesthetics"] },
  clinic: { treatments: ["botox", "fillers"], tags: ["aesthetics"] },
};

const CATEGORY_TREATMENTS: Record<TreatmentCategory, Treatment[]> = {
  injectables: ["botox", "fillers"],
  lasers: ["laser"],
  beauty: ["facial", "microneedling"],
  body: ["body-contouring"],
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function extractNameSearchTerms(query: string, filters: ConciergeFilters): string[] {
  const terms = new Set<string>();
  if (filters.providerName?.trim()) {
    terms.add(filters.providerName.trim());
  }

  const lower = query.toLowerCase();
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "in",
    "at",
    "for",
    "and",
    "or",
    "my",
    "me",
    "i",
    "want",
    "need",
    "looking",
    "find",
    "near",
    "around",
    "best",
    "good",
    "spa",
    "med",
    "medspa",
  ]);

  for (const spa of spas) {
    const nameNorm = normalizeText(spa.name);
    if (nameNorm.length >= 3 && lower.includes(nameNorm)) {
      terms.add(spa.name);
    }
  }

  const quoted = query.match(/"([^"]+)"/g);
  if (quoted) {
    for (const segment of quoted) {
      terms.add(segment.replace(/"/g, "").trim());
    }
  }

  const words = query.split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    for (let len = Math.min(4, words.length - i); len >= 2; len--) {
      const phrase = words.slice(i, i + len).join(" ");
      const phraseNorm = normalizeText(phrase);
      if (stopWords.has(phraseNorm) || phraseNorm.length < 3) continue;
      if (Object.keys(KEYWORDS).some((key) => phraseNorm.includes(key))) continue;
      terms.add(phrase);
    }
  }

  return [...terms];
}

function nameMatchBoost(
  spa: (typeof spas)[0],
  searchTerms: string[]
): { boost: number; reason?: string } {
  const nameNorm = normalizeText(spa.name);
  const slugNorm = spa.slug.replace(/-/g, " ");

  for (const term of searchTerms) {
    const termNorm = normalizeText(term);
    if (termNorm.length < 2) continue;

    if (nameNorm === termNorm || nameNorm.includes(termNorm) || termNorm.includes(nameNorm)) {
      return { boost: 100, reason: `Matches "${spa.name}" by name` };
    }
    if (slugNorm.includes(termNorm.replace(/\s+/g, "-")) || slugNorm.includes(termNorm)) {
      return { boost: 95, reason: `Matches "${spa.name}" by name` };
    }

    const words = termNorm.split(/\s+/).filter((word) => word.length >= 2);
    if (words.length > 0 && words.every((word) => nameNorm.includes(word) || slugNorm.includes(word))) {
      return { boost: 90, reason: `Matches "${spa.name}" by name` };
    }
  }

  return { boost: 0 };
}

function cityMatches(spa: (typeof spas)[0], cityFilter: string): boolean {
  const cityNorm = normalizeText(cityFilter);
  const spaCity = normalizeText(spa.city);
  const neighborhood = normalizeText(spa.neighborhood);
  const metroName = spa.metro ? normalizeText(METRO_LABELS[spa.metro]) : "";

  if (spaCity.includes(cityNorm) || cityNorm.includes(spaCity)) return true;
  if (neighborhood.includes(cityNorm)) return true;
  if (metroName.includes(cityNorm) || cityNorm.includes(metroName.replace(/\s+/g, " "))) return true;
  if (cityNorm === "tampa" && spa.metro === "tampa-bay" && spaCity.includes("tampa")) return true;
  return false;
}

function passesHardFilters(spa: (typeof spas)[0], filters: ConciergeFilters): boolean {
  if (filters.state && filters.state !== "All" && spa.state !== filters.state) {
    return false;
  }

  if (filters.city?.trim() && !cityMatches(spa, filters.city)) {
    return false;
  }

  if (filters.providerType && filters.providerType !== "All" && spa.providerType !== filters.providerType) {
    return false;
  }

  if (
    filters.treatmentCategory &&
    filters.treatmentCategory !== "All" &&
    !spa.treatmentCategories.includes(filters.treatmentCategory)
  ) {
    return false;
  }

  return true;
}

function scoreSpa(
  spa: (typeof spas)[0],
  wantedTreatments: Set<Treatment>,
  wantedTags: Set<string>,
  wantedProviderTypes: Set<ProviderType>,
  filters: ConciergeFilters
): { score: number; reasons: string[]; nameMatched: boolean } {
  let score = 0;
  const reasons: string[] = [];

  if (spa.listingStatus === "verified-partner") {
    score += 10;
    reasons.push("Verified Verity partner");
  } else if (spa.listingStatus === "listed") {
    score += 5;
    reasons.push("Listed in Verity directory");
  }

  for (const treatment of wantedTreatments) {
    if (spa.treatments.includes(treatment)) {
      score += 25;
      reasons.push(`Offers ${treatment.replace("-", " ")}`);
    }
  }

  if (filters.treatmentCategory && filters.treatmentCategory !== "All") {
    if (spa.treatmentCategories.includes(filters.treatmentCategory)) {
      score += 30;
      reasons.push(`Specializes in ${filters.treatmentCategory.replace("-", " ")}`);
    }
  }

  for (const type of wantedProviderTypes) {
    if (spa.providerType === type) {
      score += 12;
      reasons.push(`Matches your ${type.replace("-", " ")} preference`);
    }
  }

  if (filters.providerType && filters.providerType !== "All" && spa.providerType === filters.providerType) {
    score += 20;
    reasons.push(`Your selected provider type: ${filters.providerType.replace("-", " ")}`);
  }

  if (filters.state && filters.state !== "All" && spa.state === filters.state) {
    score += 18;
    reasons.push(`Located in ${filters.state}`);
  }

  if (filters.city?.trim() && cityMatches(spa, filters.city)) {
    score += 22;
    reasons.push(`Located in ${spa.city}`);
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
  return { score, reasons: [...new Set(reasons)].slice(0, 3), nameMatched: false };
}

function buildCombinedQuery(query: string, filters: ConciergeFilters): string {
  const parts = [query.trim()];
  if (filters.city?.trim()) parts.push(`in ${filters.city.trim()}`);
  if (filters.state && filters.state !== "All") parts.push(`in ${filters.state}`);
  if (filters.providerName?.trim()) parts.push(filters.providerName.trim());
  if (filters.treatmentCategory && filters.treatmentCategory !== "All") {
    parts.push(filters.treatmentCategory);
  }
  if (filters.providerType && filters.providerType !== "All") {
    parts.push(filters.providerType.replace("-", " "));
  }
  return parts.filter(Boolean).join(" ");
}

export function matchSpas(query: string, filters: ConciergeFilters = {}): ConciergeMatch[] {
  const combined = buildCombinedQuery(query, filters);
  const lower = combined.toLowerCase();
  const wantedTreatments = new Set<Treatment>();
  const wantedTags = new Set<string>();
  const wantedProviderTypes = new Set<ProviderType>();

  if (filters.providerType && filters.providerType !== "All") {
    wantedProviderTypes.add(filters.providerType);
  }
  if (filters.treatmentCategory && filters.treatmentCategory !== "All") {
    for (const treatment of CATEGORY_TREATMENTS[filters.treatmentCategory]) {
      wantedTreatments.add(treatment);
    }
  }

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

  const hasExplicitFilters =
    Boolean(filters.state && filters.state !== "All") ||
    Boolean(filters.city?.trim()) ||
    Boolean(filters.providerType && filters.providerType !== "All") ||
    Boolean(filters.treatmentCategory && filters.treatmentCategory !== "All") ||
    Boolean(filters.providerName?.trim());

  if (!hasExplicitFilters && wantedTreatments.size === 0 && wantedTags.size === 0) {
    wantedTags.add("luxury");
    wantedTreatments.add("facial");
  }

  const nameSearchTerms = extractNameSearchTerms(combined, filters);
  const candidateSpas = spas.filter((spa) => passesHardFilters(spa, filters));

  const matches = candidateSpas
    .map((spa) => {
      const { score, reasons } = scoreSpa(
        spa,
        wantedTreatments,
        wantedTags,
        wantedProviderTypes,
        filters
      );
      const nameMatch = nameMatchBoost(spa, nameSearchTerms);
      const totalScore = score + nameMatch.boost;
      const finalReasons = nameMatch.reason ? [nameMatch.reason, ...reasons] : reasons;

      return {
        spaSlug: spa.slug,
        spaName: spa.name,
        reason: finalReasons.join(". ") || `Highly rated verified provider in ${spa.city}`,
        matchScore: Math.min(99, totalScore),
        nameMatched: nameMatch.boost > 0,
      };
    })
    .filter((match) => match.nameMatched || match.matchScore >= MIN_SCORE)
    .sort((a, b) => {
      if (a.nameMatched !== b.nameMatched) return a.nameMatched ? -1 : 1;
      return b.matchScore - a.matchScore;
    })
    .slice(0, RESULT_LIMIT)
    .map(({ nameMatched: _nameMatched, ...match }) => match);

  if (matches.length > 0) return matches;

  return candidateSpas
    .map((spa) => ({
      spaSlug: spa.slug,
      spaName: spa.name,
      reason: `Verified provider in ${spa.city}`,
      matchScore: Math.min(99, spa.rating * 10 + (spa.listingStatus === "verified-partner" ? 10 : 0)),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, RESULT_LIMIT);
}

export function buildConciergeReply(query: string, matches: ConciergeMatch[]): string {
  if (matches.length === 0) {
    return "I couldn't find a strong match yet. Try adjusting your filters — state, city, provider type, treatment category — or search by business name (e.g. \"Lan Aesthetics\").";
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

export async function askConcierge(
  query: string,
  filters: ConciergeFilters = {}
): Promise<{ reply: string; matches: ConciergeMatch[] }> {
  const matches = matchSpas(query, filters);

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
            { role: "user", content: buildCombinedQuery(query, filters) },
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
