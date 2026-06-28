import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verity — Trusted Clean-Beauty Med Spas",
  description:
    "Find verified, reputable med spas in Miami. Product transparency, verified reviews, and AI-powered matching.",
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
          <p className="mt-2">Trusted clean-beauty med spas · Launching Miami · Expanding nationwide</p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} Verity. Not medical advice.</p>
        </footer>
      </body>
    </html>
  );
}
