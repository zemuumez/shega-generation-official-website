"use client";

import { useState } from "react";
import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

const DEFAULT_CATEGORIES = ["Podcasts", "Radio Programs", "Programs", "Interviews"];

/**
 * Extracts YouTube video ID and embed/thumbnail URLs if the link is a YouTube URL.
 */
function parseYouTubeVideo(url?: string) {
  if (!url) return null;

  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  return null;
}

const getCtaLabel = (category?: string) => {
  if (category?.includes("Radio")) return "Listen Broadcast";
  if (category?.includes("Podcast")) return "Listen Podcast";
  if (category?.includes("Interview")) return "Watch Feature";
  return "Watch Highlight";
};

export default function ExpandingProjectCapsules({
  projects,
  customCategories,
}: {
  projects: any[];
  customCategories?: string[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [filter, setFilter] = useState("All");
  const [activeVideoModal, setActiveVideoModal] = useState<any | null>(null);

  // Filter list from siteSettings customCategories or defaults
  const categories = [
    "All",
    ...(customCategories && customCategories.length > 0
      ? customCategories
      : DEFAULT_CATEGORIES),
  ];

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) => {
          if (!p.category) return false;
          const cat = p.category.toLowerCase();
          const target = filter.toLowerCase();
          return cat === target || cat.includes(target) || target.includes(cat);
        });

  const handleCardClick = (idx: number, project: any, e: React.MouseEvent) => {
    setActiveIdx(idx);
  };

  const handleWatchVideo = (project: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const projectLink = project.projectUrl || project.link;
    const ytInfo = parseYouTubeVideo(projectLink);

    if (ytInfo) {
      setActiveVideoModal({
        title: project.title,
        creatorName: project.creatorName,
        embedUrl: ytInfo.embedUrl,
        projectLink,
      });
    } else if (projectLink) {
      window.open(projectLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 mt-6 sm:mt-8">
      {/* Filter Pills: Scrollable rail on mobile, wrapped flex on desktop */}
      <div className="overflow-x-auto no-scrollbar flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pb-2 sm:pb-0 mb-6 sm:mb-8" role="tablist" aria-label="Media & Program Filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setActiveIdx(0);
            }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 border flex-shrink-0 min-h-[38px] cursor-pointer ${
              filter === cat
                ? "bg-ochre border-ochre text-white font-bold shadow-md scale-[1.02]"
                : "bg-white border-zinc-200 text-ink-soft hover:border-zinc-300 hover:text-ink font-semibold"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion / Capsules Container */}
      <div className="flex flex-col md:flex-row gap-3.5 sm:gap-4 justify-center items-stretch min-h-[460px] sm:min-h-[500px] w-full">
        {filteredProjects.map((project, idx) => {
          const isActive = activeIdx === idx;
          const ctaText = getCtaLabel(project.category);
          
          const projectLink = project.projectUrl || project.link;
          const ytInfo = parseYouTubeVideo(projectLink);

          const cmsUploadedImage = safeImageUrl(
            project.mainImage || project.image || project.coverImage,
            800,
            ""
          );
          const bgImageSrc =
            cmsUploadedImage ||
            (ytInfo ? ytInfo.thumbnailUrl : "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800");

          return (
            <div
              key={project._id || project.title || idx}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={(e) => handleCardClick(idx, project, e)}
              className={`relative overflow-hidden rounded-[24px] sm:rounded-[36px] border border-zinc-200 bg-zinc-900 transition-all duration-500 ease-out cursor-pointer flex-shrink-0 ${
                isActive
                  ? "w-full md:w-[560px] min-h-[400px] sm:min-h-[460px] grow shadow-2xl border-ochre/60 ring-2 ring-ochre/30"
                  : "w-full md:w-[120px] h-[90px] sm:h-[110px] md:h-auto hover:w-[140px] shadow-sm border-zinc-200/80"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={bgImageSrc}
                  alt={project.title}
                  fill
                  sizes={isActive ? "(max-width: 768px) 100vw, 560px" : "140px"}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority={idx === 0}
                  unoptimized={bgImageSrc.includes("youtube.com") || bgImageSrc.includes("ytimg.com")}
                />
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? "bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-black/40"
                      : "bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-black/30 hover:opacity-75"
                  }`}
                />
              </div>

              {/* ACTIVE EXPANDED CARD CONTENT */}
              {isActive && (
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 text-white z-20 overflow-y-auto no-scrollbar">
                  <div>
                    {/* Category Badge & Step */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-ochre/90 px-2.5 py-0.5 rounded-full text-white font-bold">
                        {project.category || "Media Feature"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide leading-tight text-white pt-1 drop-shadow-sm">
                      {project.title}
                    </h3>

                    {/* Summary Description */}
                    <p className="mt-3 text-xs sm:text-sm text-zinc-100 leading-relaxed max-w-lg font-medium drop-shadow-xs">
                      {project.description}
                    </p>

                    {/* Student / Presenter Quote */}
                    {project.quote && (
                      <p className="mt-3 text-xs text-zinc-200 italic border-l-2 border-ochre pl-3 py-0.5 font-sans">
                        &ldquo;{project.quote}&rdquo;
                      </p>
                    )}

                    {/* Topic / Tech Tags */}
                    {project.techStack && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[9px] font-mono text-zinc-200 font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-mono text-zinc-200 truncate">
                      Featured: <strong className="text-white font-bold">{project.creatorName}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleWatchVideo(project, e)}
                      className="w-full sm:w-auto rounded-full bg-ochre hover:bg-ochre-dark active:scale-95 text-white text-[11px] font-mono font-bold uppercase tracking-wider px-5 py-3 shadow-lg flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border border-orange-400/40 transition-all min-h-[44px]"
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-200 animate-ping" />
                      <span>▶ {ytInfo ? "Watch Video Feature" : ctaText}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* INACTIVE DESKTOP CARD: THUMBNAIL + PLAY BADGE */}
              {!isActive && (
                <div className="absolute inset-0 hidden md:flex flex-col items-center justify-between py-8 px-3 text-white z-20 pointer-events-none">
                  {/* Step Number */}
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-zinc-200 border border-white/15 font-bold shadow-xs">
                    {idx + 1}
                  </span>

                  {/* PROMINENT PLAY BADGE */}
                  <div className="w-10 h-10 rounded-full bg-ochre border-2 border-orange-400/60 flex items-center justify-center text-white text-sm shadow-xl my-4">
                    ▶
                  </div>

                  {/* Vertical Title */}
                  <p className="font-display font-bold uppercase text-xs tracking-widest vertical-text select-none text-white whitespace-nowrap drop-shadow-md my-auto">
                    {project.title}
                  </p>

                  <span className="text-sm font-bold text-orange-400">&rarr;</span>
                </div>
              )}

              {/* INACTIVE MOBILE CARD ROW */}
              {!isActive && (
                <div className="absolute inset-0 md:hidden flex items-center justify-between p-4 sm:p-6 text-white z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-ochre border border-orange-400/50 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                      ▶
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-orange-300 font-bold block mb-0.5">
                        {project.category || "Media Highlight"}
                      </span>
                      <p className="font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-white drop-shadow-xs line-clamp-1">
                        {project.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-orange-400 font-bold ml-2">&rarr;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FULL-SCREEN VIDEO LIGHTBOX MODAL FOR MOBILE & DESKTOP */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative max-w-4xl w-full p-4 sm:p-6 text-white text-left z-50 my-auto bg-zinc-950 rounded-3xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveVideoModal(null)}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-50 bg-ochre text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xl transition-transform hover:scale-110 border border-orange-300/40 cursor-pointer"
              aria-label="Close video"
            >
              ✕
            </button>

            {/* Video Player Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/15">
              <iframe
                src={activeVideoModal.embedUrl}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Details & Action Footer */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white leading-tight">
                  {activeVideoModal.title}
                </h3>
                {activeVideoModal.creatorName && (
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Featured: <span className="text-amber-300 font-bold">{activeVideoModal.creatorName}</span>
                  </p>
                )}
              </div>

              {activeVideoModal.projectLink && (
                <a
                  href={activeVideoModal.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/15 hover:bg-white/25 text-white text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2 border border-white/20 transition-all"
                >
                  Open on YouTube ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
