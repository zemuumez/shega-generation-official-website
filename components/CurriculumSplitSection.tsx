"use client";

import LeafPattern from "@/components/LeafPattern";

const curriculumItems = [
  {
    num: "01",
    title: "Artificial Intelligence Laboratory",
    desc: "Focusing on low-resource language processing (NLP), local dialects, optical character recognition (OCR) for Ge'ez, and agricultural diagnostic models.",
  },
  {
    num: "02",
    title: "Software Engineering Studio",
    desc: "Constructing robust backend layers, native cross-platform mobile portals, and database architectures to support commerce in secondary cities.",
  },
  {
    num: "03",
    title: "Cloud Infrastructure Pipeline",
    desc: "Continuous integration, GitOps deployment practices, local server administration, and offline-first container systems for rural deployments.",
  },
  {
    num: "04",
    title: "Traditional Craft & Ethnomathematics",
    desc: "Decoding structural geometry patterns in traditional Ethiopian weaving (Tibeb), translating organic matrices into scalable CSS grids and graphics code.",
  },
  {
    num: "05",
    title: "Life Skills & Local Leadership",
    desc: "Storytelling, critical thinking, negotiation, community support ethics, and financial literacy, preparing developers to run sustainable ventures.",
  },
];

export default function CurriculumSplitSection() {
  return (
    <section className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 pt-14 sm:pt-16 pb-28 relative border-t border-b border-zinc-200">
      {/* Background Geometric Line Pattern */}
      <div className="absolute inset-y-0 -left-8 md:-left-14 w-96 pointer-events-none opacity-60 z-0 hidden lg:block [mask-image:linear-gradient(to_right,white_50%,transparent_100%)]">
        <LeafPattern tone="gray" variant="mosaic" id="curriculum-leaf" opacity="0.3" />
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-16 relative z-10">
        {/* Left Column - Sticky Section Title */}
        <div className="md:w-1/2 md:sticky md:top-28 h-fit pt-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold block mb-1">
            &bull; Pedagogical Architecture
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink uppercase tracking-wide leading-tight">
            A curriculum designed for regional leaders
          </h2>
          <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-md">
            We do not just teach syntax. We build builders who are anchored in their heritage, prepared to lead local industries, and capable of constructing localized engineering solutions.
          </p>
          <div className="mt-8 hidden md:block">
            <a
              href="/donate"
              className="inline-flex border border-ink/40 text-ink rounded-full px-6 py-3 hover:bg-ochre hover:text-white hover:border-ochre text-[10px] tracking-widest transition-all uppercase font-mono font-bold"
            >
              Pledge a Scholarship
            </a>
          </div>
        </div>

        {/* Right Column - Fast Scrollable Content Blocks */}
        <div className="md:w-1/2 space-y-12 pt-2">
          {curriculumItems.map((item) => (
            <div key={item.num} className="border-b border-zinc-200 pb-8 last:border-0 last:pb-0">
              <span className="font-mono text-2xl font-bold text-ink/30 block mb-2">{item.num}</span>
              <h3 className="font-display text-xl font-bold text-ink uppercase tracking-wide">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
