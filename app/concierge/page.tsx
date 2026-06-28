import { AIConcierge } from "@/components/AIConcierge";

export const metadata = {
  title: "AI Concierge — Verity",
  description: "Get matched to trusted med spas in Miami.",
};

export default function ConciergePage() {
  return (
    <div className="min-h-[70vh] bg-charcoal py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center text-ivory">
          <p className="text-xs uppercase tracking-widest text-gold">Powered by AI</p>
          <h1 className="mt-2 font-serif text-4xl">Verity Concierge</h1>
          <p className="mx-auto mt-3 max-w-xl text-stone/80">
            Describe your treatment goals, budget, and neighborhood. We recommend verified spas —
            not sponsored listings.
          </p>
        </div>
        <AIConcierge />
      </div>
    </div>
  );
}
