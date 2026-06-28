"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingForm({ spaSlug, spaName }: { spaSlug: string; spaName: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const body = {
      spaSlug,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      treatment: form.get("treatment"),
      preferredDate: form.get("date"),
      preferredTime: form.get("time"),
      notes: form.get("notes"),
    };

    await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setStatus("done");
    router.push(`/book/success?spa=${encodeURIComponent(spaName)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-border space-y-4 rounded-2xl bg-white p-6">
      <h3 className="font-serif text-xl text-charcoal">Request Appointment</h3>
      <p className="text-sm text-stone">
        Request-to-book — {spaName} confirms within 2 hours. No phone tag.
      </p>
      <input
        name="name"
        required
        placeholder="Full name"
        className="w-full rounded-lg border border-stone/20 px-4 py-3 text-sm outline-none focus:border-gold"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-lg border border-stone/20 px-4 py-3 text-sm outline-none focus:border-gold"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone"
        className="w-full rounded-lg border border-stone/20 px-4 py-3 text-sm outline-none focus:border-gold"
      />
      <select
        name="treatment"
        required
        className="w-full rounded-lg border border-stone/20 px-4 py-3 text-sm outline-none focus:border-gold"
      >
        <option value="">Select treatment</option>
        <option>Consultation</option>
        <option>Botox</option>
        <option>Dermal Fillers</option>
        <option>Clean Facial</option>
        <option>Laser Treatment</option>
        <option>Microneedling</option>
      </select>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="date"
          type="date"
          required
          className="rounded-lg border border-stone/20 px-4 py-3 text-sm outline-none focus:border-gold"
        />
        <select
          name="time"
          required
          className="rounded-lg border border-stone/20 px-4 py-3 text-sm outline-none focus:border-gold"
        >
          <option value="">Preferred time</option>
          <option>Morning (9–12)</option>
          <option>Afternoon (12–4)</option>
          <option>Evening (4–7)</option>
        </select>
      </div>
      <textarea
        name="notes"
        rows={3}
        placeholder="Ingredient concerns, first visit, etc."
        className="w-full rounded-lg border border-stone/20 px-4 py-3 text-sm outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-charcoal py-3 text-sm font-medium tracking-wider text-ivory transition hover:bg-charcoal/90 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Request Booking"}
      </button>
    </form>
  );
}
