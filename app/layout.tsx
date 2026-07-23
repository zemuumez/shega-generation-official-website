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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body bg-ivory text-ink antialiased min-h-screen relative overflow-x-hidden selection:bg-ochre/20 selection:text-ochre-dark">
        <header className="sticky top-0 z-40 bg-[#F4F3EE]/95 backdrop-blur-md border-b border-ivory-light/80 shadow-sm">
          <div className="mx-auto flex w-full max-w-[90vw] items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="font-display text-3xl font-bold uppercase tracking-tight text-ink hover:text-ink/80 transition-colors duration-300">
              Shega Generations
            </Link>
            <nav className="hidden md:flex items-center gap-10 text-lg tracking-tight text-ink/95">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ink/70 transition-colors relative py-1 font-extrabold">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-6">
              <GoogleTranslator />
              <Link href="/donate" className="border border-ink/40 text-ink rounded-full px-7 py-3 hover:bg-ochre hover:text-white hover:border-ochre text-xs tracking-widest transition-all uppercase font-mono font-bold">
                Donate
              </Link>
            </div>
          </div>
        </header>

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
