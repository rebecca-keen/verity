import { NextResponse } from "next/server";
import { Resend } from "resend";

function formatField(label: string, value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? `${label}: ${text}` : "";
}

/** Server-only inbox — never exposed in the client bundle. */
const DEFAULT_CONTACT_EMAIL = "rebeccakeen@gmail.com";

const DEFAULT_FROM_ADDRESS = "Verity Aesthetics <hello@verityaesthetics.app>";

type ContactPayload = {
  name: string;
  email: string;
  topic: string;
  subjectLine: string;
  message: string;
  spaName: string;
  emailSubject: string;
  lines: string[];
};

async function sendViaFormSubmit(
  contactEmail: string,
  payload: ContactPayload
): Promise<{ ok: true } | { ok: false; detail: unknown }> {
  const { name, email, topic, subjectLine, message, spaName, emailSubject } = payload;

  const formSubmitResponse = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: emailSubject,
        _replyto: email,
        _captcha: "false",
        _template: "table",
        name,
        email,
        topic,
        subject: subjectLine,
        "Practice / listing": spaName,
        message,
      }),
    }
  );

  const formSubmitResult = (await formSubmitResponse.json().catch(() => ({}))) as {
    success?: string;
    message?: string;
  };

  if (!formSubmitResponse.ok || formSubmitResult.success !== "true") {
    return { ok: false, detail: formSubmitResult };
  }

  return { ok: true };
}

export async function POST(request: Request) {
  const contactEmail = process.env.CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.CONTACT_FROM || DEFAULT_FROM_ADDRESS;

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

  const payload: ContactPayload = {
    name,
    email,
    topic,
    subjectLine,
    message,
    spaName,
    emailSubject,
    lines,
  };

  try {
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: contactEmail,
        replyTo: email,
        subject: emailSubject,
        text: lines.join("\n"),
      });

      if (!error) {
        return NextResponse.json({ ok: true });
      }

      console.error("Resend error — falling back to FormSubmit:", {
        name: error.name,
        message: error.message,
        from: fromAddress,
      });
    }

    const formSubmitResult = await sendViaFormSubmit(contactEmail, payload);

    if (formSubmitResult.ok) {
      return NextResponse.json({ ok: true });
    }

    console.error("FormSubmit error:", formSubmitResult.detail);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again shortly." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again shortly." },
      { status: 500 }
    );
  }
}
