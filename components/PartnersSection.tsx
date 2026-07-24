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

// Render high-resolution vector brand logo mark when no image asset is uploaded
function PartnerLogoMark({ name, isSelected }: { name: string; isSelected: boolean }) {
  const textColor = isSelected ? "text-[#145A32]" : "text-zinc-800 group-hover:text-[#145A32]";
  const accentColor = isSelected ? "text-[#145A32]" : "text-zinc-400 group-hover:text-[#145A32]";

  if (name.includes("Sofor")) {
    return (
      <div className="flex items-center gap-2 select-none">
        <span className={`font-mono text-xl font-bold ${accentColor}`}>&lt;/&gt;</span>
        <span className={`font-display text-xl font-black tracking-tight ${textColor}`}>
          SOFOR<span className="text-[#145A32]">.</span>
        </span>
      </div>
    );
  }

  if (name.includes("Tourism") || name.includes("TTI")) {
    return (
      <div className="flex items-center gap-2 select-none">
        <div className="w-6 h-6 rounded-md bg-[#145A32]/10 border border-[#145A32]/30 flex items-center justify-center font-serif text-xs font-bold text-[#145A32]">
          T
        </div>
        <span className={`font-display text-lg font-extrabold tracking-wider ${textColor}`}>
          TTI<span className="font-mono text-xs text-zinc-400 ml-1 font-semibold">INSTITUTE</span>
        </span>
      </div>
    );
  }

  if (name.includes("Guenet")) {
    return (
      <div className="flex items-center gap-1.5 select-none">
        <span className={`font-serif text-2xl font-black tracking-widest uppercase ${textColor}`}>
          GUENET
        </span>
      </div>
    );
  }

  if (name.includes("Samilos")) {
    return (
      <div className="flex items-center gap-2 select-none">
        <div className="w-5 h-5 rounded-full bg-ochre/20 border border-ochre/40 flex items-center justify-center text-[10px] font-bold text-ochre-dark">
          S
        </div>
        <span className={`font-display text-lg font-black tracking-tight ${textColor}`}>
          SAMILOS<span className="text-ochre">MEDIA</span>
        </span>
      </div>
    );
  }

  if (name.includes("Enqu")) {
    return (
      <div className="flex items-center gap-1.5 select-none">
        <span className={`font-mono text-lg font-bold text-emerald-600`}>✦</span>
        <span className={`font-display text-xl font-black tracking-wider uppercase ${textColor}`}>
          ENQU
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 select-none">
      <span className={`font-display text-lg font-bold tracking-tight uppercase ${textColor}`}>
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
          
          {/* LEFT COLUMN: TALKING ABOUT OUR PARTNERS (Matching user reference) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Kicker Tag */}
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink font-bold block mb-6">
                Our clients / partners
              </span>

              {/* Large Display Title matching reference image layout */}
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-300 tracking-tight leading-[1.05] uppercase select-none">
                Pleasure to <br /> work with
              </h2>

              <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-md">
                Shega Generation collaborates with Ethiopia&apos;s premier educational academies, hospitality centers, media houses, and venue operators across Addis Ababa.
              </p>
            </div>

            {/* INTERACTIVE SPOTLIGHT FOCUS CAPTION BOX FOR HOVERED PARTNER */}
            <div className="mt-10 p-6 rounded-3xl border border-zinc-200 bg-[#F7F9F7] transition-all duration-500 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#145A32] animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#145A32] font-bold">
                  {activePartner.role || "Strategic Partner"}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-ink uppercase tracking-wide">
                {activePartner.name}
              </h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed font-sans">
                {activePartner.description ||
                  "Leading institutional collaborator driving tech, hospitality, and character education with Shega Generation."}
              </p>
              {activePartner.websiteUrl && (
                <a
                  href={activePartner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#145A32] hover:underline"
                >
                  Learn More &rarr;
                </a>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: BRAND LOGO GRID MATCHING USER REFERENCE IMAGE */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-center">
              {partnerList.map((partner) => {
                const partnerLogo = partner.logo ? safeImageUrl(partner.logo) : null;
                const isSelected = activePartner.name === partner.name;

                return (
                  <button
                    key={partner._id || partner.name}
                    onMouseEnter={() => setActivePartner(partner)}
                    onFocus={() => setActivePartner(partner)}
                    onClick={() => setActivePartner(partner)}
                    className={`group relative rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[120px] sm:min-h-[140px] border outline-none ${
                      isSelected
                        ? "border-[#145A32] bg-[#F7F9F7] shadow-md scale-[1.02]"
                        : "border-zinc-200/60 bg-white hover:border-zinc-300 hover:bg-zinc-50/80 hover:-translate-y-1"
                    }`}
                  >
                    {partnerLogo ? (
                      <div className="relative w-full h-12 flex items-center justify-center">
                        <Image
                          src={partnerLogo}
                          alt={partner.name}
                          fill
                          sizes="200px"
                          className={`object-contain transition-all duration-300 ${
                            isSelected
                              ? "filter-none scale-105"
                              : "filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                          }`}
                        />
                      </div>
                    ) : (
                      <PartnerLogoMark name={partner.name} isSelected={isSelected} />
                    )}

                    {/* HOVER TOOLTIP CAPTION PREVIEW */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 hidden sm:block">
                      <div className="bg-ink text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                        {partner.name}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* SPECIAL CALLOUT CARD FOR NEW PARTNERS */}
              <a
                href="/contact"
                className="rounded-2xl border border-dashed border-[#145A32]/40 bg-white hover:bg-[#F7F9F7] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-[#145A32] hover:-translate-y-1 transition-all duration-300 min-h-[120px] sm:min-h-[140px] group"
              >
                <span className="font-mono text-xs font-bold text-[#145A32] group-hover:text-[#145A32] flex items-center gap-1.5">
                  + Partner with us &rarr;
                </span>
                <span className="text-[10px] font-mono text-zinc-400 mt-1">
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
