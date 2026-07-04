import { NextResponse } from "next/server";
import { Resend } from "resend";

function formatField(label: string, value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? `${label}: ${text}` : "";
}

export async function POST(request: Request) {
  const contactEmail = process.env.CONTACT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.CONTACT_FROM || "Verity Aesthetics <onboarding@resend.dev>";

  if (!contactEmail || !resendApiKey) {
    console.error("Contact form misconfigured: missing CONTACT_EMAIL or RESEND_API_KEY");
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const topic = String(body.topic || "").trim();
  const subjectLine = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  const spaName = String(body.spaName || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const emailSubject = subjectLine
    ? `Verity: ${subjectLine}`
    : topic
      ? `Verity contact — ${topic}`
      : `Verity contact from ${name}`;

  const lines = [
    formatField("Name", name),
    formatField("Email", email),
    formatField("Topic", topic),
    formatField("Subject", subjectLine),
    formatField("Practice / listing", spaName),
    "",
    "Message:",
    message,
  ].filter(Boolean);

  const resend = new Resend(resendApiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: contactEmail,
      replyTo: email,
      subject: emailSubject,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Unable to send your message. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again shortly." },
      { status: 500 }
    );
  }
}
