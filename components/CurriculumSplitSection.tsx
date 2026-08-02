"use client";

import LeafPattern from "@/components/LeafPattern";

const curriculumItems = [
  {
    num: "01",
    title: "Modern & Advanced Tech",
    desc: "From foundational computational thinking and block coding (Scratch, Minecraft) for kids to full-stack web development, Python, cybersecurity, and AI command engineering for youth.",
  },
  {
    num: "02",
    title: "Indigenous Knowledge & Heritage",
    desc: "Ancient Ge'ez fundamentals, Ethiopian history, structural engineering secrets behind historic Ethiopian landmarks, and traditional conflict resolution principles (Erq).",
  },
  {
    num: "03",
    title: "Etiquette, Hospitality & Life Skills",
    desc: "Practical instruction in የማዕድ ስነ-ስርዓት (Dining Etiquette), ፈገግታና አዎንታዊ ተግባቦት (Positive Communication) through interactive games, public speaking, and mineralogy.",
  },
  {
    num: "04",
    title: "Physical Fitness & Talent Showcases",
    desc: "Sports activities, self-defense martial arts, traditional board games (Gebeta), and national talent showcases such as 'Sofor's Got Talent'.",
  },
  {
    num: "05",
    title: "High-Level Field Trips & Network Access",
    desc: "Direct operational visits to major national tech hubs—including INSA (Information Network Security Agency) and the Ethiopian Artificial Intelligence Institute.",
  },
];

export default function CurriculumSplitSection() {
  return (
    <section className="w-full relative border-t border-b border-zinc-200 bg-[#F4F3EE]">
      {/* Background Geometric Line Pattern - Sticking flush to left edge */}
      <div className="absolute inset-y-0 left-0 w-96 md:w-[32vw] max-w-md pointer-events-none opacity-60 z-0 hidden lg:block [mask-image:linear-gradient(to_right,white_50%,transparent_100%)]">
        <LeafPattern tone="gray" variant="mosaic" id="curriculum-leaf" opacity="0.3" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-28 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 relative z-10">
        {/* Left Column - Sticky header that stays pinned as right column scrolls */}
        <div className="md:w-1/2 md:sticky md:top-28 lg:top-32 h-fit pt-2 transition-all duration-300">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ink/65 font-bold block mb-1.5">
             Pedagogical Architecture
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink uppercase tracking-wide leading-tight">
            A curriculum designed for regional leaders
          </h2>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-ink-soft leading-relaxed max-w-md font-sans font-medium">
            We do not just teach syntax. We build builders who are anchored in their heritage, prepared to lead local industries, and capable of constructing localized engineering solutions.
          </p>
          <div className="mt-6 sm:mt-8 hidden md:block">
            <a
              href="/donate"
              className="inline-flex border border-ink/40 text-ink rounded-full px-6 py-3 hover:bg-ochre hover:text-white hover:border-ochre text-[10px] sm:text-xs tracking-widest transition-all uppercase font-mono font-bold"
            >
              Pledge a Scholarship
            </a>
          </div>
        </div>

        {/* Right Column - Content Blocks that scroll alongside left column */}
        <div className="md:w-1/2 space-y-8 sm:space-y-12 pt-2">
          {curriculumItems.map((item) => (
            <div key={item.num} className="border-b border-zinc-200/90 pb-6 sm:pb-8 last:border-0 last:pb-0">
              <span className="font-mono text-xl sm:text-2xl font-bold text-ochre/70 block mb-1.5">{item.num}</span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink uppercase tracking-wide">{item.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
