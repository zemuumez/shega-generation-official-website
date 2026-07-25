"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRACKS = [
  {
    id: "creative-kids",
    name: "Creative Kids (Ages 7–10)",
    slogan: "Learning Through Play & Computer Science Basics",
    desc: "Designed for young minds to explore computational thinking through block coding (Scratch, Minecraft), interactive cooking games, computer fundamentals, and tales of kindness.",
    tech: ["Scratch", "Minecraft", "Block Coding", "Tales of Kindness", "Logic Games"],
    capacity: 60,
    enrolled: 58,
    date: "Summer Camp Batch",
  },
  {
    id: "astute-teens",
    name: "Astute Teens (Ages 11–13)",
    slogan: "Logical Reasoning & Web Engineering",
    desc: "Focusing on logical problem solving, intermediate HTML/CSS web development, life skills, and constructing real tourism-related web portals for Ethiopian heritage.",
    tech: ["HTML5", "CSS3", "JavaScript", "Tourism Portals", "Life Skills"],
    capacity: 70,
    enrolled: 65,
    date: "Summer Camp Batch",
  },
  {
    id: "leader-youth",
    name: "Leader Youth (Ages 14–18)",
    slogan: "Advanced Python, AI & Cybersecurity",
    desc: "Advanced programming in Python, full-stack web architecture, cybersecurity protocols, AI command engineering, entrepreneurship, and youth leadership.",
    tech: ["Python", "AI Engineering", "Cybersecurity", "Full-Stack Web", "Leadership"],
    capacity: 70,
    enrolled: 70,
    date: "Summer Camp Batch",
  },
  {
    id: "student-lab",
    name: "Real-World Student Project Lab",
    slogan: "Commercial Software Contracts & Industry Training",
    desc: "Senior students execute external software development contracts for businesses—gaining portfolio experience while earning money for their contributions.",
    tech: ["Next.js", "TypeScript", "Client Build Contracts", "Corporate Training", "Partnerships"],
    capacity: 30,
    enrolled: 28,
    date: "Year-Round",
  },
];

export default function InteractiveProgramExplorer() {
  const [activeTab, setActiveTab] = useState("creative-kids");
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
    <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Sticky Section Header, Navigation Tabs & Active Overview */}
        <div className="md:w-5/12 w-full md:sticky md:top-28 h-fit space-y-6 z-10">
          {/* Section Entrance Header */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold block mb-1">
               Dynamic Curriculum
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink uppercase tracking-wide leading-tight">
              Interactive Track Explorer
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed">
              Explore our curriculum paths, tech stacks, cohort dates, and class size metrics below.
            </p>
          </div>

          {/* Tab Buttons List */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-2.5" role="tablist" aria-label="Course Tracks">
            {TRACKS.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabClick(t.id)}
                  className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-full transition-all duration-300 border text-[11px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest flex items-center justify-between ${
                    isActive
                      ? "bg-ochre border-ochre text-white font-bold shadow-md sm:translate-x-1"
                      : "bg-white border-zinc-200 text-ink-soft hover:border-zinc-300 hover:text-ink"
                  }`}
                >
                  <span className="truncate">{t.name}</span>
                  <span className={`text-[10px] hidden sm:inline ${isActive ? "text-white/80" : "text-ink-soft/60"}`}>
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
