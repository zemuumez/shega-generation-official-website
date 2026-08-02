"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const QUICK_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events & Gatherings" },
    { href: "/gallery", label: "Media Gallery" },
    { href: "/contact", label: "Contact Us" },
    { href: "/donate", label: "Support / Donate" },
  ];

  const PROGRAMS = [
    { label: "CTF & Cybersecurity", href: "/events" },
    { label: "Tech Training & Coding", href: "/about" },
    { label: "Life Skills & Leadership", href: "/about" },
    { label: "Indigenous Knowledge", href: "/gallery" },
  ];

  const SOCIAL_LINKS = [
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@samuelgeremew_21",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.27 6.27 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.27 8.27 0 0 0 4.78 1.41V7.01a4.83 4.83 0 0 1-1.00-.32z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://web.facebook.com/share/g/18foDKzcBS/",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-zinc-200/80 bg-white/70 backdrop-blur-md relative z-10 text-zinc-700">
      {/* TOP TIBEB PATTERN DECORATIVE LINE */}
      <div className="h-1 w-full bg-gradient-to-r from-ochre via-navy to-ochre opacity-80" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-zinc-200/80">
          
          {/* BRAND COLUMN (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-xs border border-zinc-200/80 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/images/logo.png"
                  alt="Shega Generations Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-xl sm:text-2xl text-ink uppercase tracking-wide">
                  Shega Generations
                </span>
                <span className="font-mono text-xs font-bold text-ochre mt-0.5 tracking-wider">
                  ሸጋ ትውልድ
                </span>
              </div>
            </Link>

            <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed max-w-sm">
              Nurturing tech geniuses, CTF champions, and indigenous leadership across Ethiopia. Built by the generation it empowers.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-mono font-medium">
              {QUICK_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? "text-ochre font-bold"
                          : "text-zinc-600 hover:text-ochre"
                      }`}
                    >
                      <span className="text-ochre/60 text-[10px]">›</span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* PROGRAMS & FOCUS AREAS */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Focus Areas
            </h4>
            <ul className="space-y-2.5 text-xs font-mono font-medium text-zinc-600">
              {PROGRAMS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-ochre transition-colors flex items-center gap-1.5">
                    <span className="text-zinc-400 text-[10px]">•</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONNECT & SOCIALS COLUMN */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Connect With Us
            </h4>
            <p className="text-xs font-sans text-zinc-500 leading-normal">
              Follow our latest updates, CTFs, and tech workshops.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-100/80 hover:bg-ochre hover:text-white text-zinc-700 font-mono text-xs font-bold transition-all shadow-xs group"
                >
                  <span className="text-zinc-600 group-hover:text-white transition-colors">
                    {social.icon}
                  </span>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & CREDITS */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Shega Generations. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-[11px] text-zinc-400 font-sans font-medium">
            ሸጋ ትውልድ • Built with pride in Addis Ababa
          </p>
        </div>
      </div>
    </footer>
  );
}

