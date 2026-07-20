"use client";

import { useState } from "react";
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
  const track = TRACKS.find((t) => t.id === activeTab) || TRACKS[0];
  const pct = Math.round((track.enrolled / track.capacity) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Left Sidebar */}
        <div className="md:col-span-4 flex flex-col gap-2" role="tablist" aria-label="Course Tracks">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full text-left px-6 py-4.5 rounded-full transition-all duration-300 border text-xs font-mono uppercase tracking-widest ${
                activeTab === t.id
                  ? "bg-ochre border-ochre text-white font-bold shadow-md"
                  : "bg-white border-zinc-200 text-ink-soft hover:border-zinc-300 hover:text-ink"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Content Right Panel */}
        <div className="md:col-span-8 bg-white border border-zinc-200 rounded-[32px] p-8 sm:p-10 shadow-sm min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div>
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
                      animate={{ width: `${pct}%` }}
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
