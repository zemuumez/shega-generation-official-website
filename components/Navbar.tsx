"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleTranslator from "@/components/GoogleTranslator";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/studio", label: "Studio" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#F4F3EE]/95 backdrop-blur-md border-b border-ivory-light/80 shadow-sm">
      <div className="mx-auto flex w-full max-w-[90vw] items-center justify-between px-4 py-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-ink hover:text-ink/80 transition-colors duration-300"
        >
          Shega Generations
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-base lg:text-lg tracking-tight text-ink/95">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors relative py-1 font-extrabold ${
                  isActive ? "text-ochre-dark font-extrabold" : "hover:text-ink/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Action */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          <GoogleTranslator />
          <Link
            href="/donate"
            className="border border-ink/40 text-ink rounded-full px-6 lg:px-7 py-2.5 lg:py-3 hover:bg-ochre hover:text-white hover:border-ochre text-xs tracking-widest transition-all uppercase font-mono font-bold"
          >
            Donate
          </Link>
        </div>

        {/* Mobile Hamburger Toggle & Translator */}
        <div className="flex sm:hidden items-center gap-2">
          <GoogleTranslator />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-ink hover:bg-black/5 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="sm:hidden bg-[#F4F3EE] border-b border-zinc-200 px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest font-bold">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-4 rounded-xl text-ink hover:bg-black/5 transition-colors border border-zinc-200/50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center bg-ochre text-white py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold shadow-md"
            >
              Donate Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
