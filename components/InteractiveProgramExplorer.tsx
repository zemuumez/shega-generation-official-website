"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRACKS = [
  {
    id: "ai",
    name: "AI Laboratory",
    slogan: "Machine Learning & Natural Language Processing",
    desc: "Underprivileged students deep-dive into Python fundamentals, data handling, training custom neural networks, and optimizing open-weights models (like Llama) for local dialects.",
    tech: ["Python", "PyTorch", "HuggingFace", "Jupyter", "Scikit-Learn"],
    capacity: 25,
    enrolled: 22,
    date: "Sept 15, 2026",
  },
  {
    id: "dev",
    name: "Software Studio",
    slogan: "Web & Mobile Development",
    desc: "Building highly responsive interfaces, responsive layouts, and cross-platform native applications. Students construct full-stack ecosystems using modern database engines.",
    tech: ["Next.js", "React Native", "TypeScript", "TailwindCSS", "PostgreSQL"],
    capacity: 30,
    enrolled: 29,
    date: "Oct 01, 2026",
  },
  {
    id: "ops",
    name: "DevOps Pipeline",
    slogan: "Cloud Architecture & GitOps Systems",
    desc: "Understanding code deployment pipelines, containerization, orchestration, and continuous integration models. Preparing students to construct self-healing environments.",
    tech: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "AWS"],
    capacity: 20,
    enrolled: 16,
    date: "Oct 10, 2026",
  },
  {
    id: "craft",
    name: "Craft & Culture",
    slogan: "Traditional Weaving & Ethnomathematics",
    desc: "Connecting ancestral geometric designs (like Ethiopian Tibeb weaving patterns) to computational thinking and matrix transformations. Nurturing cultural roots as structural design inputs.",
    tech: ["Ethnomathematics", "Vector Art", "SVG Grid System", "Weaving Geometry"],
    capacity: 40,
    enrolled: 40,
    date: "Ongoing",
  },
];

export default function InteractiveProgramExplorer() {
  const [activeTab, setActiveTab] = useState("ai");
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isClickScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const trackId = entry.target.getAttribute("data-track-id");
          if (trackId) {
            setActiveTab(trackId);
          }
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-25% 0px -45% 0px",
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    TRACKS.forEach((t) => {
      const el = document.getElementById(`track-card-${t.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    isClickScrolling.current = true;

    const el = document.getElementById(`track-card-${id}`);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const activeTrack = TRACKS.find((t) => t.id === activeTab) || TRACKS[0];
  const activePct = Math.round((activeTrack.enrolled / activeTrack.capacity) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-10 mt-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Sticky Navigation Tabs & Active Overview */}
        <div className="md:w-5/12 w-full md:sticky md:top-28 h-fit space-y-6 z-10">
          {/* Tab Buttons List */}
          <div className="flex flex-col gap-2.5" role="tablist" aria-label="Course Tracks">
            {TRACKS.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabClick(t.id)}
                  className={`w-full text-left px-6 py-4 rounded-full transition-all duration-300 border text-xs font-mono uppercase tracking-widest flex items-center justify-between ${
                    isActive
                      ? "bg-ochre border-ochre text-white font-bold shadow-md translate-x-1"
                      : "bg-white border-zinc-200 text-ink-soft hover:border-zinc-300 hover:text-ink"
                  }`}
                >
                  <span>{t.name}</span>
                  <span className={`text-[10px] ${isActive ? "text-white/80" : "text-ink-soft/60"}`}>
                    &rarr;
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sticky Active Track Summary Box */}
          <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <span className="inline-block px-3 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ochre/10 text-ochre-dark border border-ochre/20 font-bold mb-2">
                  Active Track Overview
                </span>
                <h4 className="font-display text-lg font-bold text-ink uppercase tracking-wide">
                  {activeTrack.name}
                </h4>
                <p className="mt-1.5 text-xs text-ink-soft line-clamp-3 leading-relaxed">
                  {activeTrack.desc}
                </p>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-ink-soft font-bold">Capacity Filled</span>
                  <span className="font-bold text-ochre-dark">{activePct}% ({activeTrack.enrolled}/{activeTrack.capacity})</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrollable Cards for Each Track */}
        <div className="md:w-7/12 w-full space-y-8">
          {TRACKS.map((track) => {
            const pct = Math.round((track.enrolled / track.capacity) * 100);
            const isActive = activeTab === track.id;

            return (
              <div
                key={track.id}
                id={`track-card-${track.id}`}
                data-track-id={track.id}
                className={`bg-white border rounded-[32px] p-8 sm:p-10 shadow-sm transition-all duration-300 ${
                  isActive
                    ? "border-ochre ring-2 ring-ochre/20 shadow-md"
                    : "border-zinc-200 opacity-80 hover:opacity-100"
                }`}
              >
                <span className="inline-block px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ink/5 text-ink border border-zinc-200 font-bold mb-4">
                  {track.slogan}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink uppercase tracking-wide">
                  {track.name}
                </h3>
                <p className="mt-4 text-sm text-ink-soft leading-relaxed">
                  {track.desc}
                </p>

                <div className="mt-8">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ink-soft/60 font-bold">Tech Stack & Tools</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {track.tech.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full bg-zinc-50 border border-zinc-200 px-3.5 py-1.5 text-[10px] font-mono text-ink-soft font-semibold"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress and Stats */}
                <div className="mt-10 pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-ink-soft font-bold mb-2">
                      <span>Cohort Capacity ({track.enrolled}/{track.capacity})</span>
                      <span>{pct}% Filled</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-ochre rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-start sm:justify-end gap-6 text-left sm:text-right font-mono">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-ink-soft/60 font-bold">Commences</div>
                      <div className="text-sm font-bold text-ink mt-0.5">{track.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
