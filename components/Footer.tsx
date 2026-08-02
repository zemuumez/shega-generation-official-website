"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="border-t border-zinc-200 bg-white/40 relative z-10 overflow-hidden">
      <div className="mx-auto w-full max-w-[90vw] px-4 py-10 sm:py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:gap-10 sm:flex-row items-center text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-xs border border-zinc-200/80 flex items-center justify-center flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Shega Generation Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-ink">
                Shega Generations <span className="text-ochre">| ሸጋ ትውልድ</span>
              </p>
              <p className="mt-1 text-xs sm:text-sm text-ink-soft font-sans">
                Nurturing Tech Geniuses &amp; Indigenous Leadership in Ethiopia.
              </p>
            </div>
          </div>

          {/* Social Links: YouTube, TikTok, Facebook */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 text-xs sm:text-sm font-mono text-ink-soft font-bold uppercase tracking-wider flex-wrap">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 px-2 hover:text-ochre transition-colors min-h-[36px] flex items-center"
            >
              YouTube
            </a>
            <a
              href="https://www.tiktok.com/@samuelgeremew_21"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 px-2 hover:text-ochre transition-colors min-h-[36px] flex items-center"
            >
              TikTok
            </a>
            <a
              href="https://web.facebook.com/share/g/18foDKzcBS/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 px-2 hover:text-ochre transition-colors min-h-[36px] flex items-center"
            >
              Facebook
            </a>
          </div>
        </div>

        <p className="mt-8 sm:mt-12 text-center sm:text-left text-[11px] sm:text-xs font-mono text-ink-soft/60">
          &copy; {new Date().getFullYear()} Shega Generations. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
