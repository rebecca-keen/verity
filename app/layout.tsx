import Link from "next/link";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, rootMetadata, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Header />
        <main>{children}</main>
        <footer className="border-t border-stone/15 bg-cream py-12 text-center text-sm text-stone">
          <p className="font-serif text-lg text-charcoal">Verity</p>
          <p className="mt-2">
            Aesthetics clinics, med spas & dermatology · Nationwide · Curated listings
          </p>
          <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <Link href="/providers" className="text-gold hover:underline">
              Providers
            </Link>
            <Link href="/concierge" className="text-gold hover:underline">
              Concierge
            </Link>
            <Link href="/shop" className="text-gold hover:underline">
              Shop
            </Link>
            <Link href="/for-spas" className="text-gold hover:underline">
              For Providers
            </Link>
            <Link href="/how-we-verify" className="text-gold hover:underline">
              How we verify
            </Link>
            <Link href="/contact" className="text-gold hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="text-gold hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-gold hover:underline">
              Terms
            </Link>
            <Link href="/premium" className="text-gold hover:underline">
              Premium
            </Link>
          </p>
          <p className="mt-4 text-sm text-stone">
            Questions?{" "}
            <Link href="/contact" className="text-gold hover:underline">
              Contact us
            </Link>
          </p>
          <p className="mt-4 max-w-xl mx-auto text-xs text-stone/80">
            As an Amazon Associate, Verity Aesthetics earns from qualifying purchases. Product links
            may be affiliate links at no extra cost to you.
          </p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} Verity. Not medical advice.</p>
        </footer>
      </body>
    </html>
  );
}
