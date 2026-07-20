import type { Metadata } from "next";
import { Outfit, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import TibebPattern from "@/components/TibebPattern";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
  { href: "/donate", label: "Donate" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body bg-ivory text-ink antialiased min-h-screen relative overflow-x-hidden selection:bg-ochre/20 selection:text-ochre-dark">
        {/* Ambient background glow points */}
        <div className="glow-bubble top-[-10%] left-[-20%] w-[60vw] h-[60vw] bg-indigo/5" />
        <div className="glow-bubble top-[40%] right-[-20%] w-[50vw] h-[50vw] bg-ochre/5" />
        <div className="glow-bubble bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-brick/5" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
            <Link href="/" className="font-display text-xl font-bold tracking-tight text-ochre hover:text-ochre-dark transition-colors duration-300">
              Shega Generations
            </Link>
            <nav className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-ink/80">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ochre transition-colors relative py-1 font-medium">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <TibebPattern variant="border" tone="ochre" className="w-full opacity-60" />
        </header>

        <main className="relative z-10">{children}</main>

        <footer className="mt-24 border-t border-zinc-200/50 bg-zinc-50/60 relative z-10">
          <TibebPattern variant="border" tone="indigo" className="w-full opacity-40" />
          <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
            <div className="flex flex-col justify-between gap-8 sm:flex-row">
              <div>
                <p className="font-display text-2xl font-bold text-ochre">Shega Generations</p>
                <p className="mt-2 text-sm text-ink-soft">ሽጋ ትውልድ &mdash; built by the generation it teaches.</p>
              </div>
              <div className="flex items-center gap-6 text-sm font-mono text-ink-soft">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-ochre transition-colors">X</a>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-indigo transition-colors">Telegram</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-brick transition-colors">YouTube</a>
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
