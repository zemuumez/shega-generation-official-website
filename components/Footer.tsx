"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
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
  );
}
