"use client";

import { useRef, useState } from "react";

type ContactFormProps = {
  defaultSubject?: string;
  defaultTopic?: string;
  defaultSpaName?: string;
};

export function ContactForm({ defaultSubject = "", defaultTopic = "", defaultSpaName = "" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [subject, setSubject] = useState(defaultSubject);
  const [spaName, setSpaName] = useState(defaultSpaName);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submitInFlight = useRef(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitInFlight.current) return;

    submitInFlight.current = true;
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, subject, message, spaName, website }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      const sent = res.ok && data?.ok === true;

      if (!sent) {
        setStatus("error");
        setErrorMessage(
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again."
        );
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      if (!defaultTopic) setTopic("");
      if (!defaultSubject) setSubject("");
      if (!defaultSpaName) setSpaName("");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send your message. Please check your connection and try again.");
    } finally {
      submitInFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-cream p-8 text-center">
        <p className="font-serif text-xl text-charcoal">Message sent</p>
        <p className="mt-2 text-sm text-stone">
          Thanks for reaching out. We typically respond within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-gold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-charcoal">
            Name <span className="text-gold">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-stone/20 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold/50"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-charcoal">
            Email <span className="text-gold">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-stone/20 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold/50"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-topic" className="block text-sm font-medium text-charcoal">
            Topic
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-stone/20 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold/50"
          >
            <option value="">Select a topic</option>
            <option value="List my practice">List my practice</option>
            <option value="Claim a listing">Claim a listing</option>
            <option value="Update my profile">Update my profile</option>
            <option value="Featured placement">Featured placement</option>
            <option value="Listing correction">Listing correction</option>
            <option value="Premium inquiry">Premium inquiry</option>
            <option value="Suggest a provider">Suggest a provider</option>
            <option value="Leave a review">Leave a review</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="contact-spa" className="block text-sm font-medium text-charcoal">
            Practice / listing name
          </label>
          <input
            id="contact-spa"
            type="text"
            value={spaName}
            onChange={(e) => setSpaName(e.target.value)}
            placeholder="If applicable"
            className="mt-1.5 w-full rounded-lg border border-stone/20 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold/50"
          />
        </div>
      </div>

      {subject ? (
        <input type="hidden" name="subject" value={subject} />
      ) : (
        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-charcoal">
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-stone/20 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold/50"
          />
        </div>
      )}

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-charcoal">
          Message <span className="text-gold">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full resize-y rounded-lg border border-stone/20 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold/50"
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
