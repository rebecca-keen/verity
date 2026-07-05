"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/providers", label: "Providers" },
  { href: "/shop", label: "Shop" },
  { href: "/concierge", label: "Concierge" },
  { href: "/premium", label: "Premium" },
  { href: "/for-spas", label: "For Providers" },
  { href: "/contact", label: "Contact" },
];

const mobilePrimary = links.slice(0, 3);

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone/10 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide text-charcoal">
          Verity
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
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

        <div className="flex items-center gap-3">
          <Link
            href="/concierge"
            className="hidden rounded-full bg-charcoal px-5 py-2 text-xs font-medium tracking-wider text-ivory transition hover:bg-charcoal/90 sm:inline-block"
          >
            Find My Match
          </Link>

          <button
            type="button"
            className="inline-flex flex-col justify-center gap-1.5 rounded-lg p-2 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`block h-0.5 w-5 bg-charcoal transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-charcoal transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-charcoal transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-stone/10 bg-ivory px-6 py-4 lg:hidden" aria-label="Mobile navigation">
          <ul className="space-y-3">
            {mobilePrimary.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block text-sm tracking-wide text-charcoal"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/concierge"
                className="mt-2 block rounded-full bg-charcoal px-5 py-2.5 text-center text-xs font-medium tracking-wider text-ivory"
                onClick={() => setOpen(false)}
              >
                Find My Match
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
