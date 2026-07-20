"use client";

import { useState } from "react";
import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

export default function ExpandingProjectCapsules({ projects }: { projects: any[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-10 mt-10">
      <div className="flex flex-col md:flex-row gap-5 justify-center items-stretch min-h-[480px] w-full">
        {projects.map((project, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={project._id}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
              className={`relative overflow-hidden rounded-[70px] border border-zinc-200 bg-white transition-all duration-750 ease-out cursor-pointer flex-shrink-0 ${
                isActive 
                  ? "w-full md:w-[480px] grow shadow-md border-ochre/30" 
                  : "w-full md:w-[110px] h-[100px] md:h-auto hover:w-[125px] shadow-sm hover:border-ochre/20"
              }`}
            >
              {/* Card Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={safeImageUrl(project.image)}
                  alt={project.title}
                  fill
                  sizes={isActive ? "480px" : "130px"}
                  className="object-cover transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-45 md:opacity-55 group-hover:opacity-30"}`} />
              </div>

              {/* Active Info Content Overlay */}
              {isActive ? (
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-20">
                  <span className="inline-block w-fit px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-zinc-800 text-white font-bold mb-3 border border-white/10">
                    {project.category}
                  </span>
                  <h4 className="font-display text-2xl font-bold uppercase tracking-wide leading-snug text-white">
                    {project.title}
                  </h4>
                  <p className="mt-2 text-sm text-zinc-200 line-clamp-3 max-w-md leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <p className="text-xs font-mono text-zinc-300">by {project.creatorName}</p>
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white text-ink text-[10px] font-mono font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-ink hover:text-white transition-all duration-300 shadow-sm"
                    >
                      Read Journey
                    </a>
                  </div>
                </div>
              ) : (
                /* Inactive Vertical Title Column (Hidden on small mobile where cards collapse vertically) */
                <div className="absolute inset-0 hidden md:flex flex-col items-center justify-end pb-14 text-white z-20 pointer-events-none">
                  <p className="font-display font-bold uppercase text-base tracking-widest vertical-text select-none text-zinc-100 whitespace-nowrap">
                    {project.title.substring(0, 16)}
                  </p>
                </div>
              )}

              {/* Small Mobile Inactive Text Placeholder */}
              {!isActive && (
                <div className="absolute inset-0 md:hidden flex items-center p-6 text-white z-20">
                  <p className="font-display font-bold uppercase tracking-wider text-sm text-white">
                    {project.title}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
