"use client";

import { useState } from "react";
import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

export default function ExpandingProjectCapsules({ projects }: { projects: any[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 mt-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Project Categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setActiveIdx(0);
            }}
            className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 border ${
              filter === cat
                ? "bg-ochre border-ochre text-white font-bold shadow-sm"
                : "bg-white border-zinc-200 text-ink-soft hover:border-zinc-300 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion / Capsules Container */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch min-h-[520px] w-full">
        {filteredProjects.map((project, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={project._id || project.title}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
              className={`relative overflow-hidden rounded-[36px] border border-zinc-200 bg-zinc-900 transition-all duration-500 ease-out cursor-pointer flex-shrink-0 ${
                isActive
                  ? "w-full md:w-[540px] grow shadow-xl border-ochre/40"
                  : "w-full md:w-[120px] h-[110px] md:h-auto hover:w-[140px] shadow-sm border-zinc-200/80"
              }`}
            >
              {/* Card Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={safeImageUrl(project.image)}
                  alt={project.title}
                  fill
                  sizes={isActive ? "540px" : "140px"}
                  className="object-cover transition-transform duration-700"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-black/30 transition-opacity duration-500 ${
                    isActive ? "opacity-95" : "opacity-75 hover:opacity-60"
                  }`}
                />
              </div>

              {/* Active Info Content Overlay */}
              {isActive ? (
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-20 overflow-y-auto">
                  <div>
                    {/* Category & Location Badges */}
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                      <span className="px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ochre/90 text-white font-bold shadow-sm">
                        {project.category}
                      </span>
                      {project.cohortLocation && (
                        <span className="px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-white/15 backdrop-blur-md text-zinc-200 border border-white/10 font-medium">
                          {project.cohortLocation}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide leading-tight text-white">
                      {project.title}
                    </h3>
                    
                    {/* Impact Metric Banner */}
                    {project.impactMetric && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 font-mono text-[10px] text-amber-300 font-bold">
                        <span>⚡</span>
                        <span>{project.impactMetric}</span>
                      </div>
                    )}

                    <p className="mt-4 text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-lg">
                      {project.description}
                    </p>

                    {/* Student Quote */}
                    {project.quote && (
                      <p className="mt-4 text-xs text-zinc-300 italic border-l-2 border-ochre pl-3 py-0.5">
                        &ldquo;{project.quote}&rdquo;
                      </p>
                    )}

                    {/* Tech Stack Tags */}
                    {project.techStack && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-[9px] font-mono text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-300">by <strong className="text-white font-bold">{project.creatorName}</strong></span>
                    <a
                      href={project.projectUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-ochre text-white text-[10px] font-mono font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-ochre-dark transition-all duration-300 shadow-md flex items-center gap-1.5"
                    >
                      <span>Read Story</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Inactive Vertical Title Column (Desktop) */
                <div className="absolute inset-0 hidden md:flex flex-col items-center justify-between py-10 px-4 text-white z-20 pointer-events-none">
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-black/60 px-2 py-1 rounded-full text-zinc-300 border border-white/10">
                    {idx + 1}
                  </span>
                  <p className="font-display font-bold uppercase text-sm tracking-widest vertical-text select-none text-zinc-100 whitespace-nowrap">
                    {project.title}
                  </p>
                  <span className="text-xs text-ochre">&rarr;</span>
                </div>
              )}

              {/* Mobile Inactive Text Row */}
              {!isActive && (
                <div className="absolute inset-0 md:hidden flex items-center justify-between p-6 text-white z-20">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ochre font-bold block mb-1">
                      {project.category}
                    </span>
                    <p className="font-display font-bold uppercase tracking-wider text-base text-white">
                      {project.title}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">&rarr;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
