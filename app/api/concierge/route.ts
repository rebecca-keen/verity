import { NextResponse } from "next/server";
import { askConcierge } from "@/lib/ai-concierge";

export async function POST(request: Request) {
  const { query } = await request.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const result = await askConcierge(query);
  return NextResponse.json(result);
}
