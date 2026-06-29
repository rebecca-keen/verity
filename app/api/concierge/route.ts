import { NextResponse } from "next/server";
import { askConcierge } from "@/lib/ai-concierge";
import type { ConciergeFilters } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { query, filters } = body as { query?: string; filters?: ConciergeFilters };

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const result = await askConcierge(query, filters ?? {});
  return NextResponse.json(result);
}
