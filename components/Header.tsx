import Link from "next/link";

const links = [
  { href: "/spas", label: "Spas" },
  { href: "/products", label: "Products" },
  { href: "/concierge", label: "AI Concierge" },
  { href: "/for-spas", label: "For Spas" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone/10 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide text-charcoal">
          Verity
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-stone transition hover:text-charcoal"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/concierge"
          className="rounded-full bg-charcoal px-5 py-2 text-xs font-medium tracking-wider text-ivory transition hover:bg-charcoal/90"
        >
          Find My Spa
        </Link>
      </div>
    </header>
  );
}
