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
      // Fetch high-resolution YouTube video thumbnail
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
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

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

  return (
    <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 mt-8">
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2.5 mb-8" role="tablist" aria-label="Media & Program Filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setActiveIdx(0);
              setPlayingVideoId(null);
            }}
            className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
              filter === cat
                ? "bg-ochre border-ochre text-white font-bold shadow-md scale-[1.02]"
                : "bg-white border-zinc-200 text-ink-soft hover:border-zinc-300 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion / Capsules Container */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch min-h-[500px] w-full">
        {filteredProjects.map((project, idx) => {
          const isActive = activeIdx === idx;
          const ctaText = getCtaLabel(project.category);
          
          // Check if link provided is a YouTube video URL
          const ytInfo = parseYouTubeVideo(project.projectUrl);
          const isPlayingVideo = playingVideoId === (project._id || project.title || String(idx));

          // LOGIC: If YouTube URL -> fetch YouTube thumbnail image. If NOT YouTube -> use user-uploaded image from CMS!
          const bgImageSrc = ytInfo
            ? ytInfo.thumbnailUrl
            : safeImageUrl(
                project.image,
                800,
                "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800"
              );

          return (
            <div
              key={project._id || project.title || idx}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
              className={`relative overflow-hidden rounded-[36px] border border-zinc-200 bg-zinc-900 transition-all duration-500 ease-out cursor-pointer flex-shrink-0 ${
                isActive
                  ? "w-full md:w-[560px] grow shadow-2xl border-ochre/60 ring-2 ring-ochre/30"
                  : "w-full md:w-[120px] h-[120px] md:h-auto hover:w-[140px] shadow-sm border-zinc-200/80"
              }`}
            >
              {/* Background Thumbnail Image or Active YouTube Video Player */}
              <div className="absolute inset-0 z-0">
                {isActive && isPlayingVideo && ytInfo ? (
                  <iframe
                    src={ytInfo.embedUrl}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 z-10 relative"
                  />
                ) : (
                  <>
                    <Image
                      src={bgImageSrc}
                      alt={project.title}
                      fill
                      sizes={isActive ? "560px" : "140px"}
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority={idx === 0}
                      unoptimized={bgImageSrc.includes("youtube.com") || bgImageSrc.includes("ytimg.com")}
                    />
                    {/* Subtle Overlay */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isActive
                          ? "bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-black/30"
                          : "bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-black/20 hover:opacity-75"
                      }`}
                    />
                  </>
                )}
              </div>

              {/* ACTIVE EXPANDED CARD CONTENT */}
              {isActive && !isPlayingVideo ? (
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-20 overflow-y-auto">
                  <div>
                    {/* Title */}
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide leading-tight text-white pt-1 drop-shadow-sm">
                      {project.title}
                    </h3>

                    {/* Summary Description */}
                    <p className="mt-4 text-xs sm:text-sm text-zinc-100 leading-relaxed max-w-lg font-medium drop-shadow-xs">
                      {project.description}
                    </p>

                    {/* Student / Presenter Quote */}
                    {project.quote && (
                      <p className="mt-4 text-xs text-zinc-200 italic border-l-2 border-ochre pl-3 py-0.5 font-sans">
                        &ldquo;{project.quote}&rdquo;
                      </p>
                    )}

                    {/* Topic / Tech Tags */}
                    {project.techStack && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="rounded-full bg-black/40 backdrop-blur-md border border-white/15 px-3 py-1 text-[9px] font-mono text-zinc-200 font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
                    <span className="text-xs font-mono text-zinc-200 truncate">
                      Featured: <strong className="text-white font-bold">{project.creatorName}</strong>
                    </span>

                    {ytInfo ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideoId(project._id || project.title || String(idx));
                        }}
                        className="rounded-full bg-ochre text-white text-[10px] font-mono font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-ochre-dark transition-all duration-300 shadow-md flex items-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer border border-orange-400/30"
                      >
                        <span className="w-2 h-2 rounded-full bg-orange-300 animate-ping" />
                        <span>▶ Watch YouTube Video</span>
                      </button>
                    ) : (
                      <a
                        href={project.projectUrl || "https://facebook.com/shegagenerations"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-ochre text-white text-[10px] font-mono font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-ochre-dark transition-all duration-300 shadow-md flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 border border-orange-400/30"
                      >
                        <span>{ctaText}</span>
                        <span>&rarr;</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Close YouTube Video Player Overlay */}
              {isActive && isPlayingVideo && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlayingVideoId(null);
                  }}
                  className="absolute top-4 right-4 z-30 bg-black/90 hover:bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 shadow-xl transition-all"
                >
                  ✕ Close Video
                </button>
              )}

              {/* INACTIVE DESKTOP CARD: THUMBNAIL + PLAY BADGE */}
              {!isActive && (
                <div className="absolute inset-0 hidden md:flex flex-col items-center justify-between py-8 px-3 text-white z-20 pointer-events-none">
                  {/* Step Number */}
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-zinc-200 border border-white/15 font-bold shadow-xs">
                    {idx + 1}
                  </span>

                  {/* PROMINENT PLAY BADGE */}
                  <div className="w-10 h-10 rounded-full bg-ochre border-2 border-orange-400/60 flex items-center justify-center text-white text-sm shadow-xl my-4 transform group-hover:scale-110 transition-transform">
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
                <div className="absolute inset-0 md:hidden flex items-center justify-between p-6 text-white z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-ochre border border-orange-400/50 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      ▶
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-orange-300 font-bold block mb-0.5">
                        {project.category || "Media Highlight"}
                      </span>
                      <p className="font-display font-bold uppercase tracking-wider text-sm text-white drop-shadow-xs line-clamp-1">
                        {project.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-orange-400 font-bold">&rarr;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
