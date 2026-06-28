import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // MVP: log booking request. Connect Resend/SendGrid + Supabase later.
  console.log("[Verity Booking Request]", JSON.stringify(body, null, 2));

  return NextResponse.json({
    ok: true,
    message: "Booking request received. Spa will confirm within 2 hours.",
  });
}
