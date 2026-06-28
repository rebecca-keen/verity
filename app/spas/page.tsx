import { SpaCard } from "@/components/SpaCard";
import { spas } from "@/lib/data";

export const metadata = {
  title: "Miami Med Spas — Verity",
  description: "Browse verified clean-beauty med spas in Miami.",
};

export default function SpasPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Discovery</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Miami med spas</h1>
      <p className="mt-3 max-w-2xl text-stone">
        Every listing is verified. Clean Beauty Partners disclose every product used in treatment.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {spas.map((spa) => (
          <SpaCard key={spa.slug} spa={spa} />
        ))}
      </div>
    </div>
  );
}
