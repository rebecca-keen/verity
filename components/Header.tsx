import Link from "next/link";

const links = [
  { href: "/spas", label: "Providers" },
  { href: "/products", label: "Products" },
  { href: "/concierge", label: "AI Concierge" },
  { href: "/premium", label: "Premium" },
  { href: "/for-spas", label: "For Providers" },
  { href: "/affiliates", label: "Affiliate Program" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone/10 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide text-charcoal">
          Verity
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
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
          Find My Match
        </Link>
      </div>
    </header>
  );
}
