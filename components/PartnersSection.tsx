"use client";

import React, { useState } from "react";
import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

type PartnerItem = {
  _id?: string;
  name: string;
  role?: string;
  description?: string;
  logo?: any;
  websiteUrl?: string;
};

// Render bold, high-contrast vector brand logo mark filling the box when no image asset is uploaded
function PartnerLogoMark({ name, isSelected }: { name: string; isSelected: boolean }) {
  const textColor = isSelected
    ? "text-ochre"
    : "text-zinc-900 group-hover:text-ochre";
  const accentColor = isSelected
    ? "text-ochre"
    : "text-zinc-600 group-hover:text-ochre";

  if (name.includes("Sofor")) {
    return (
      <div className="flex items-center justify-center gap-2.5 select-none w-full py-2">
        <span className={`font-mono text-2xl sm:text-3xl font-black ${accentColor}`}>&lt;/&gt;</span>
        <span className={`font-display text-2xl sm:text-3xl font-black tracking-tight ${textColor}`}>
          SOFOR<span className="text-ochre">.</span>
        </span>
      </div>
    );
  }

  if (name.includes("Tourism") || name.includes("TTI")) {
    return (
      <div className="flex items-center justify-center gap-2.5 select-none w-full py-2">
        <div className="w-8 h-8 rounded-lg bg-ochre/15 border-2 border-ochre/40 flex items-center justify-center font-serif text-sm font-black text-ochre shadow-xs">
          T
        </div>
        <span className={`font-display text-xl sm:text-2xl font-black tracking-wider ${textColor}`}>
          TTI<span className="font-mono text-xs text-zinc-600 ml-1.5 font-bold tracking-widest">INSTITUTE</span>
        </span>
      </div>
    );
  }

  if (name.includes("Guenet")) {
    return (
      <div className="flex items-center justify-center gap-2 select-none w-full py-2">
        <span className={`font-serif text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase ${textColor}`}>
          GUENET
        </span>
      </div>
    );
  }

  if (name.includes("Samilos")) {
    return (
      <div className="flex items-center justify-center gap-2.5 select-none w-full py-2">
        <div className="w-6 h-6 rounded-full bg-ochre/25 border-2 border-ochre/50 flex items-center justify-center text-xs font-black text-ochre-dark shadow-xs">
          S
        </div>
        <span className={`font-display text-xl sm:text-2xl font-black tracking-tight ${textColor}`}>
          SAMILOS<span className="text-ochre font-black">MEDIA</span>
        </span>
      </div>
    );
  }

  if (name.includes("Enqu")) {
    return (
      <div className="flex items-center justify-center gap-2 select-none w-full py-2">
        <span className="font-mono text-xl sm:text-2xl font-black text-orange-600">✦</span>
        <span className={`font-display text-2xl sm:text-3xl font-black tracking-wider uppercase ${textColor}`}>
          ENQU
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 select-none w-full py-2">
      <span className={`font-display text-xl sm:text-2xl font-black tracking-tight uppercase ${textColor}`}>
        {name}
      </span>
    </div>
  );
}

export default function PartnersSection({ partners }: { partners: PartnerItem[] }) {
  const partnerList = partners && partners.length > 0 ? partners : [];
  const [activePartner, setActivePartner] = useState<PartnerItem>(
    partnerList[0] || {
      name: "Sofor Code Academy",
      role: "Advanced Coding & Robotics Partner",
      description:
        "Direct partner executing advanced programming languages, Python labs, AI command engineering, and robotics curriculum.",
    }
  );

  return (
    <section className="px-4 py-24 sm:px-6 relative bg-white border-t border-zinc-200 overflow-hidden">
      <div className="mx-auto w-full max-w-[90vw]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: TALKING ABOUT OUR PARTNERS */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Large Display Title matching user reference layout */}
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-300 tracking-tight leading-[1.05] uppercase select-none">
                Pleasure to <br /> work with
              </h2>

              <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-md">
                Shega Generation collaborates with Ethiopia&apos;s premier educational academies, hospitality centers, media houses, and venue operators across Addis Ababa.
              </p>
            </div>

            {/* INTERACTIVE SPOTLIGHT FOCUS CAPTION BOX */}
            <div className="mt-10 p-6 rounded-3xl border border-zinc-200 bg-[#F7F9F7] transition-all duration-500 shadow-sm relative overflow-hidden">
              <div className="mb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ochre">
                  {activePartner.role || "Strategic Partner"}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink uppercase tracking-wide">
                {activePartner.name}
              </h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed font-sans font-medium">
                {activePartner.description ||
                  "Leading institutional collaborator driving tech, hospitality, and character education with Shega Generation."}
              </p>
              {activePartner.websiteUrl && (
                <a
                  href={activePartner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ochre hover:underline"
                >
                  Learn More &rarr;
                </a>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: BIGGER & HIGH-CONTRAST BRAND LOGO GRID */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 items-center">
              {partnerList.map((partner) => {
                const partnerLogoUrl = partner.logo ? safeImageUrl(partner.logo, 600, "") : "";
                const hasUploadedLogo = Boolean(
                  partnerLogoUrl &&
                    partnerLogoUrl.length > 0 &&
                    partnerLogoUrl !==
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
                );
                const isSelected = activePartner.name === partner.name;

                return (
                  <button
                    key={partner._id || partner.name}
                    onMouseEnter={() => setActivePartner(partner)}
                    onFocus={() => setActivePartner(partner)}
                    onClick={() => setActivePartner(partner)}
                    className={`group relative rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[135px] sm:min-h-[155px] border outline-none ${
                      isSelected
                        ? "border-ochre bg-[#F7F9F7] shadow-md scale-[1.03] z-30"
                        : "border-zinc-200 bg-white hover:border-ochre/50 hover:bg-zinc-50/90 hover:-translate-y-1 shadow-xs z-10 hover:z-40"
                    }`}
                  >
                    {hasUploadedLogo ? (
                      <div className="relative w-full h-16 sm:h-20 flex items-center justify-center p-1">
                        <Image
                          src={partnerLogoUrl}
                          alt={partner.name}
                          fill
                          sizes="280px"
                          className={`object-contain transition-all duration-300 ${
                            isSelected
                              ? "contrast-[1.12] opacity-100 scale-105"
                              : "contrast-[1.08] opacity-95 group-hover:opacity-100 group-hover:scale-108 group-hover:contrast-125"
                          }`}
                        />
                      </div>
                    ) : (
                      <PartnerLogoMark name={partner.name} isSelected={isSelected} />
                    )}

                    {/* HOVER TOOLTIP CAPTION PREVIEW - FLOATS ABOVE CARD WITH HIGH Z-INDEX */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 hidden sm:block">
                      <div className="bg-ochre text-white font-mono text-[9.5px] uppercase tracking-widest px-3.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-orange-400/20">
                        {partner.name}
                      </div>
                      <div className="w-2 h-2 bg-ochre rotate-45 mx-auto -mt-1 shadow-xs" />
                    </div>
                  </button>
                );
              })}

              {/* SPECIAL CALLOUT CARD FOR NEW PARTNERS */}
              <a
                href="/contact"
                className="rounded-2xl border border-dashed border-ochre/40 bg-white hover:bg-[#F7F9F7] p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-ochre hover:-translate-y-1 transition-all duration-300 min-h-[135px] sm:min-h-[155px] group"
              >
                <span className="font-mono text-xs font-bold text-ochre group-hover:text-ochre flex items-center gap-1.5">
                  + Partner with us &rarr;
                </span>
                <span className="text-[10px] font-mono text-zinc-500 font-medium mt-1">
                  Join our ecosystem
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
