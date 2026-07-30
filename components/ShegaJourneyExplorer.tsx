"use client";

import { useState } from "react";
import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

const milestoneFallbackImages: Record<number | string, string> = {
  1: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
  2: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  3: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
  4: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
  5: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  6: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
  7: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
};

export default function ShegaJourneyExplorer({ milestones = [] }: { milestones: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!milestones || milestones.length === 0) return null;

  const current = milestones[activeIndex] || milestones[0];
  const progressPercent = ((activeIndex + 1) / milestones.length) * 100;
  const fallbackImg = milestoneFallbackImages[current.stepNumber] || milestoneFallbackImages[1];

  return (
    <section className="py-16 md:py-24 bg-white/70 backdrop-blur-md border-y border-zinc-200/80 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-ochre/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-navy/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink font-display tracking-tight leading-tight mb-4">
            From <span className="text-ochre">Weyn Coffee</span> to the <span className="text-navy">Future Campus</span>
          </h2>
          <p className="text-base sm:text-lg text-ink/75 font-sans leading-relaxed">
            Explore how a Sunday morning class on wooden stools inside a small Addis Ababa coffee shop grew into an institutional movement empowering over 500 tech geniuses.
          </p>
        </div>

        {/* Timeline Navigation Bar */}
        <div className="mb-10 max-w-7xl mx-auto w-full">
          {/* Progress Bar Container */}
          <div className="relative mb-6">
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ochre to-navy transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Timeline Pills */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto px-2 py-3 scrollbar-none snap-x">
            {milestones.map((m, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={m._id || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 whitespace-nowrap px-5 py-3 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 snap-center flex items-center gap-2.5 border select-none ${
                    isActive
                      ? "bg-navy text-white border-navy shadow-md scale-105"
                      : "bg-ivory/90 text-zinc-700 hover:text-ink border-zinc-200/90 hover:bg-white"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? "bg-ochre" : "bg-zinc-400"}`} />
                  <span className="whitespace-nowrap leading-none">{m.year}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Content Card */}
        <div className="max-w-7xl mx-auto w-full glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-zinc-200/90 shadow-lg relative bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Image Card */}
            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-zinc-200/80 bg-zinc-100">
                <Image
                  src={safeImageUrl(current.image, 800, fallbackImg)}
                  alt={current.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Year Badge Overlay */}
                <div className="absolute top-4 left-4 bg-ochre text-white text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                  {current.year}
                </div>

                {/* Location Badge Overlay */}
                {current.location && (
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans font-medium flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                    <svg className="w-4 h-4 text-ochre flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{current.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Story Text & Highlights */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-ochre font-bold uppercase tracking-widest">
                  <span>Milestone {current.stepNumber} of {milestones.length}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-ink font-display leading-tight mb-4">
                  {current.title}
                </h3>

                <p className="text-sm sm:text-base text-ink/80 font-sans leading-relaxed mb-6">
                  {current.description}
                </p>

                {/* Key Memory Quote */}
                {current.quote && (
                  <div className="p-4 rounded-2xl bg-ivory border-l-4 border-ochre mb-6 text-sm italic font-sans text-ink/90">
                    &ldquo;{current.quote}&rdquo;
                  </div>
                )}

                {/* Highlight Tags */}
                {current.highlights && current.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {current.highlights.map((h: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-sans font-medium"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-2">
                <button
                  onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeIndex === 0}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 hover:text-ink hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                <div className="text-xs font-mono text-zinc-400">
                  {activeIndex + 1} / {milestones.length}
                </div>

                <button
                  onClick={() => setActiveIndex((prev) => Math.min(milestones.length - 1, prev + 1))}
                  disabled={activeIndex === milestones.length - 1}
                  className="px-4 py-2 rounded-xl bg-ochre hover:bg-ochre-dark text-white text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Next Stage →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
