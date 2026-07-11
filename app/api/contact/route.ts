import { NextResponse } from "next/server";
import { Resend } from "resend";

function formatField(label: string, value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? `${label}: ${text}` : "";
}

/** Server-only inbox — never exposed in the client bundle. */
const DEFAULT_CONTACT_EMAIL = "rebeccakeen@gmail.com";

/** Verified domain sender — preferred when verityaesthetics.app is verified in Resend. */
const VERIFIED_FROM_ADDRESS = "Verity Aesthetics <hello@verityaesthetics.app>";

/**
 * Resend's test sender — works without domain verification.
 * Delivers only to the email on your Resend account (rebeccakeen@gmail.com).
 */
const DEFAULT_FROM_ADDRESS = "Verity Aesthetics <onboarding@resend.dev>";

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

type ContactConfig = {
  contactEmail: string;
  resendApiKey: string | undefined;
  fromAddress: string;
};

function getContactConfig(): ContactConfig {
  const contactEmail = process.env.CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY?.trim() || undefined;
  const fromAddress = process.env.CONTACT_FROM?.trim() || DEFAULT_FROM_ADDRESS;

  if (!resendApiKey) {
    console.error(
      "Contact form: RESEND_API_KEY is not set. Set it in Vercel → Project → Settings → Environment Variables (Production)."
    );
  }

  return { contactEmail, resendApiKey, fromAddress };
}

function resendFromCandidates(config: ContactConfig): string[] {
  return [...new Set([config.fromAddress, VERIFIED_FROM_ADDRESS, DEFAULT_FROM_ADDRESS])];
}

async function isResendApiKeyValid(apiKey: string | undefined): Promise<boolean> {
  if (!apiKey) return false;

  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

function isFormSubmitSuccess(success: unknown): boolean {
  return success === true || success === "true";
}

async function sendViaResend(
  config: ContactConfig,
  payload: ContactPayload
): Promise<{ ok: true } | { ok: false; detail: unknown }> {
  if (!config.resendApiKey) {
    return { ok: false, detail: { message: "RESEND_API_KEY not configured" } };
  }

  const resend = new Resend(config.resendApiKey);

  for (const fromAddress of resendFromCandidates(config)) {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: config.contactEmail,
      replyTo: payload.email,
      subject: payload.emailSubject,
      text: payload.lines.join("\n"),
    });

    if (data?.id) {
      console.log("Contact form delivered via Resend", {
        id: data.id,
        from: fromAddress,
        to: config.contactEmail,
      });
      return { ok: true };
    }

    if (error) {
      console.error("Resend send failed:", {
        name: error.name,
        message: error.message,
        statusCode: "statusCode" in error ? error.statusCode : undefined,
        from: fromAddress,
        to: config.contactEmail,
      });
    }
  }

  return { ok: false, detail: { message: "Resend did not accept the message" } };
}

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
        Origin: "https://verityaesthetics.app",
        Referer: "https://verityaesthetics.app/contact",
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
    success?: string | boolean;
    message?: string;
  };

  if (!formSubmitResponse.ok || !isFormSubmitSuccess(formSubmitResult.success)) {
    console.error("FormSubmit send failed:", {
      httpStatus: formSubmitResponse.status,
      success: formSubmitResult.success,
      message: formSubmitResult.message,
      to: contactEmail,
    });
    return { ok: false, detail: formSubmitResult };
  }

  console.log("Contact form delivered via FormSubmit", { to: contactEmail });
  return { ok: true };
}

/** Lightweight config check — does not send email. */
export async function GET() {
  const config = getContactConfig();
  const resendKeyValid = await isResendApiKeyValid(config.resendApiKey);

  return NextResponse.json({
    ok: true,
    resendConfigured: Boolean(config.resendApiKey),
    resendKeyValid,
    contactConfigured: Boolean(config.contactEmail),
    fromAddress: config.fromAddress,
    fromCandidates: resendFromCandidates(config),
  });
}

export async function POST(request: Request) {
  const config = getContactConfig();

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
    const resendResult = await sendViaResend(config, payload);
    if (resendResult.ok) {
      return NextResponse.json({ ok: true });
    }

    console.error("Resend unavailable — trying FormSubmit fallback");

    const formSubmitResult = await sendViaFormSubmit(config.contactEmail, payload);
    if (formSubmitResult.ok) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Unable to send your message. Please try again shortly." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Contact form unexpected error:", err);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again shortly." },
      { status: 500 }
    );
  }
}
