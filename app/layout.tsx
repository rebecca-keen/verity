import type { Metadata } from "next";
import { ContactEmail } from "@/components/ContactEmail";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verity — Trusted Aesthetics Across Florida",
  description:
    "Find verified aesthetics clinics, med spas, and dermatology practices across Florida — Miami, Tampa Bay, Orlando, Jacksonville, Southwest Florida, Treasure Coast, and more. Product transparency, medical director info, verified reviews, and AI-powered matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-stone/15 bg-cream py-12 text-center text-sm text-stone">
          <p className="font-serif text-lg text-charcoal">Verity</p>
          <p className="mt-2">
            Aesthetics clinics, med spas & dermatology · Florida statewide · Verified providers
          </p>
          <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <a href="/for-spas" className="text-gold hover:underline">
              For Providers
            </a>
            <a href="/premium" className="text-gold hover:underline">
              Premium
            </a>
          </p>
          <p className="mt-4 text-sm text-stone">
            Questions? <ContactEmail />
          </p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} Verity. Not medical advice.</p>
        </footer>
      </body>
    </html>
  );
}
