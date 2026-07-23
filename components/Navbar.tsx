"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/events", label: "Events", hasChevron: true },
  { href: "/gallery", label: "Gallery", hasChevron: true },
  { href: "/gallery", label: "Donate", hasChevron: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F4F3EE]/95 backdrop-blur-md border-b border-zinc-200/80 shadow-sm">
      <div className="mx-auto flex w-full max-w-[90vw] items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo: Bold 'Shega' in Dark, Regular 'Generations' in Muted Gray */}
        <Link
          href="/"
          className="flex items-center gap-1 text-xl sm:text-2xl tracking-tight transition-opacity hover:opacity-85 select-none"
        >
          <span className="font-extrabold text-zinc-950 font-display">Shega</span>
          <span className="font-normal text-zinc-500 font-sans">Generations</span>
        </Link>

        {/* Desktop Navigation Links (Center / Right Aligned with Chevrons) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href && item.label !== "Donate";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 transition-colors py-1 ${
                  isActive ? "text-zinc-950 font-semibold" : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <span>{item.label}</span>
                {item.hasChevron && (
                  <svg className="w-3.5 h-3.5 text-zinc-400 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Far Right Action: Black Pill Donate Button with Download/Arrow Icon */}
        <div className="hidden md:flex items-center">
          <Link
            href="/donate"
            className="bg-zinc-950 hover:bg-black text-white rounded-full px-5 py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          >
            <span>Donate</span>
            <svg className="w-3.5 h-3.5 text-white/80 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/donate"
            className="bg-zinc-950 text-white rounded-full px-4 py-1.5 text-xs font-medium flex items-center gap-1"
          >
            <span>Donate</span>
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
