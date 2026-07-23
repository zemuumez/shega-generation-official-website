import type { Metadata } from "next";
import { Oswald, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import GoogleTranslator from "@/components/GoogleTranslator";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shega Generations | ሽጋ ትውልድ",
  description:
    "Free tech orientation, life skills, and indigenous knowledge for underprivileged geniuses across Ethiopia.",
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/studio", label: "Studio" },
];

import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body bg-ivory text-ink antialiased min-h-screen relative overflow-x-hidden selection:bg-ochre/20 selection:text-ochre-dark">
        <Navbar />

        <main className="relative z-10">{children}</main>

        <footer className="mt-24 border-t border-ivory-light bg-white/40 relative z-10">
          <div className="mx-auto w-full max-w-[90vw] px-4 py-14 sm:px-6">
            <div className="flex flex-col justify-between gap-10 sm:flex-row">
              <div>
                <p className="font-display text-2xl font-bold uppercase tracking-wider text-ink">Shega Generations</p>
                <p className="mt-2 text-sm text-ink-soft">ሽጋ ትውልድ &mdash; built by the generation it teaches.</p>
              </div>
              <div className="flex items-center gap-8 text-sm font-mono text-ink-soft font-medium">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink/70 transition-colors">X</a>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-ink/70 transition-colors">Telegram</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink/70 transition-colors">YouTube</a>
              </div>
            </div>
            <p className="mt-12 text-xs text-ink-soft/60">
              &copy; {new Date().getFullYear()} Shega Generations. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
