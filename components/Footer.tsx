"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-zinc-200 bg-white/40 relative z-10">
      <div className="mx-auto w-full max-w-[90vw] px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-10 sm:flex-row items-start sm:items-center">
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-wider text-ink">
              Shega Generations
            </p>
            <p className="mt-2 text-sm text-ink-soft font-sans">
              ሽጋ ትውልድ built by the generation it teaches.
            </p>
          </div>

          {/* Social Links: YouTube, TikTok, Facebook */}
          <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-mono text-ink-soft font-bold uppercase tracking-wider">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#145A32] transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://www.tiktok.com/@samuelgeremew_21"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#145A32] transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://web.facebook.com/share/g/18foDKzcBS/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#145A32] transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        <p className="mt-12 text-xs font-mono text-ink-soft/60">
          &copy; {new Date().getFullYear()} Shega Generations. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
