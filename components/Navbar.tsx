"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Unbounded } from "next/font/google";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const NAV = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#F4F3EE]/95 backdrop-blur-md border-b border-ivory-light/80 shadow-sm">
      <div className="mx-auto flex w-full max-w-[90vw] items-center justify-between px-4 py-4 sm:px-6">
        {/* Brand Logo - Unique Unbounded Font in Brand Green */}
        <Link
          href="/"
          className={`${unbounded.className} text-xl sm:text-2xl font-black uppercase tracking-tight text-ochre hover:text-ochre-dark transition-colors duration-300`}
        >
          Shega Generations
        </Link>

        {/* Desktop Navigation - Right Aligned with Green Button for Donate */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-base lg:text-lg tracking-tight text-ink/95 ml-auto">
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
          {/* Donate Green Button */}
          <Link
            href="/donate"
            className="bg-ochre hover:bg-ochre-dark text-white rounded-full px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.98]"
          >
            Donate
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
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
        <div className="md:hidden bg-[#F4F3EE] border-b border-zinc-200 px-6 py-6 space-y-3">
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
              className="mt-2 w-full text-center bg-ochre hover:bg-ochre-dark text-white py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold shadow-md"
            >
              Donate
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
