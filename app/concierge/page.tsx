import { AIConcierge } from "@/components/AIConcierge";

export const metadata = {
  title: "AI Concierge — Verity",
  description:
    "Get matched to trusted aesthetics clinics, med spas, and dermatology practices across the United States.",
};

export default function ConciergePage() {
  return (
    <div className="min-h-[70vh] bg-charcoal py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center text-ivory">
          <p className="text-xs uppercase tracking-widest text-gold">Powered by AI</p>
          <h1 className="mt-2 font-serif text-4xl">Verity Concierge</h1>
          <p className="mx-auto mt-3 max-w-xl text-stone/80">
            Describe your treatment goals — injectables, lasers, facials, body contouring — plus your
            budget and city. We recommend listed aesthetics clinics and med spas from our directory —
            matches are drawn from public sources, not paid placement.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs text-stone/70">
            Featured partner listings may appear when our partner program launches.
          </p>
        </div>
        <AIConcierge />
      </div>
    </div>
  );
}
