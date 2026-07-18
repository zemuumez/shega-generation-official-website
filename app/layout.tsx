import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import TibebPattern from "@/components/TibebPattern";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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
  { href: "/donate", label: "Donate" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body bg-ivory text-ink antialiased">
        <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur border-b border-ink/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
            <Link href="/" className="font-display text-lg font-medium tracking-tight">
              Shega Generations
            </Link>
            <nav className="flex items-center gap-6 text-sm font-mono uppercase tracking-wide">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ochre transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <TibebPattern variant="border" tone="ochre" className="w-full" />
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t border-ink/10">
          <TibebPattern variant="border" tone="indigo" className="w-full" />
          <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div>
                <p className="font-display text-xl">Shega Generations</p>
                <p className="mt-1 text-sm text-ink-soft">ሽጋ ትውልድ &mdash; built by the generation it teaches.</p>
              </div>
              <div className="flex gap-8 text-sm font-mono">
                <a href="https://x.com" className="hover:text-ochre">X</a>
                <a href="https://t.me" className="hover:text-ochre">Telegram</a>
                <a href="https://youtube.com" className="hover:text-ochre">YouTube</a>
              </div>
            </div>
            <p className="mt-8 text-xs text-ink-soft/60">
              &copy; {new Date().getFullYear()} Shega Generations. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
