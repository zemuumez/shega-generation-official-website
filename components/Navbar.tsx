"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-black backdrop-blur-md  ">
      <div className="mx-auto flex w-full max-w-[90vw] items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo: Official Shega Generation Emblem */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-all duration-300 hover:opacity-90 select-none flex-shrink-0 group"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl  p-1  group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Shega Generation"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <div className="flex items-baseline gap-1 text-lg sm:text-xl">
              <span className="font-extrabold text-ochre font-display tracking-wide">ሸጋ</span>
              <span className="font-bold text-navy font-sans tracking-wider">ትውልድ</span>
            </div>
            <span className="text-[9px] font-sans font-bold tracking-widest text-zinc-500 uppercase mt-0.5">
              Shega Generation
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links: Home, Events, Gallery, Contact */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors py-1 ${
                  isActive ? "text-zinc-950 font-semibold" : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Far Right Action: Orange Donate Pill Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/donate"
            className="bg-ochre hover:bg-ochre-dark text-white rounded-full px-5 py-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>Donate</span>
            <svg className="w-3.5 h-3.5 text-white/90 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm9 3v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9m18 0H3m18 0l-2-4H5L3 11" />
            </svg>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/donate"
            className="bg-ochre text-white rounded-full px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>Donate</span>
            <svg className="w-3.5 h-3.5 text-white/90 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm9 3v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9m18 0H3m18 0l-2-4H5L3 11" />
            </svg>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-zinc-900 hover:bg-black/5 transition-colors focus:outline-none"
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
        <div className="md:hidden bg-[#F4F3EE] border-b border-zinc-200 px-6 py-5 space-y-3">
          <nav className="flex flex-col gap-3 font-sans text-sm font-medium">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded-xl text-zinc-800 hover:bg-black/5 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
