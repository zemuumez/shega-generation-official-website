"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TypewriterTitle from "@/components/TypewriterTitle";
import { safeImageUrl } from "@/sanity/lib/client";

const DEFAULT_TAGS = ["Expeditions", "Hackathons", "Classroom", "Volunteer-Work"];

export default function GalleryGrid({
  items,
  customPhrases,
  customSubtitle,
  customCategories,
}: {
  items: any[];
  customPhrases?: string[];
  customSubtitle?: string;
  customCategories?: string[];
}) {
  const [active, setActive] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const categoryOptions = [
    "All",
    ...(customCategories && customCategories.length > 0
      ? customCategories
      : DEFAULT_TAGS),
  ];

  const phrases =
    customPhrases && customPhrases.length > 0
      ? customPhrases
      : ["The weave, in pictures.", "በስዕሎች የተሸመነው"];

  const subtitle =
    customSubtitle ||
    "Expeditions, hackathons, classrooms, and volunteer work across Ethiopia.";

  const filtered = useMemo(
    () =>
      active === "All"
        ? items
        : items.filter(
            (i) =>
              (i.categoryTag || "").toLowerCase() === active.toLowerCase() ||
              (i.categoryTag || "").toLowerCase().includes(active.toLowerCase())
          ),
    [active, items]
  );

  return (
    <div className="w-full max-w-[90vw] mx-auto px-4 sm:px-6 pt-16 pb-28">
      {/* HEADER SECTION WITH TYPEWRITER ANIMATION & MAX 2 LINES */}
      <div className="text-center max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center text-center min-h-[2.4em] select-none py-2">
          <TypewriterTitle
            phrases={phrases}
            className="font-display font-black text-[clamp(2.4rem,7vw,4.8rem)] sm:text-[clamp(3.8rem,7vw,6.5rem)] leading-[0.96] uppercase text-ochre text-center max-w-full drop-shadow-xs flex flex-col items-center justify-center"
          />
        </div>

        <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-sans font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* CENTERED FILTER NAVIGATION BAR WITH ANIMATED SLIDER PILL */}
      <div className="relative w-full max-w-7xl mx-auto mt-12 mb-14">
        {/* Dynamic Fade Gradients - Only visible when actually scrollable */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-20 transition-opacity duration-300" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-20 transition-opacity duration-300" />
        )}

        <div
          ref={tabsRef}
          onScroll={checkScroll}
          className="overflow-x-auto no-scrollbar py-2 px-1 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 w-full"
        >
          {categoryOptions.map((tag) => {
            const isActive = active === tag;
            return (
              <button
                key={tag}
                onClick={() => setActive(tag)}
                className={`relative flex-shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all duration-300 flex items-center gap-2 border select-none outline-none ${
                  isActive
                    ? "text-white border-ochre bg-ochre shadow-md"
                    : "text-zinc-600 bg-zinc-100 hover:bg-zinc-200/80 hover:text-zinc-900 border-zinc-200/60 shadow-xs"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="galleryTabPill"
                    className="absolute inset-0 rounded-full bg-ochre shadow-md z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span>{tag}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CIRCULAR / SPHERICAL IMAGE CARDS GRID MATCHING TEMPLATE */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 w-full">
          {filtered.map((item, i) => (
            <div
              key={item._id || i}
              onClick={() => setLightboxItem(item)}
              className="group flex flex-col items-center text-left transition-all w-full cursor-pointer"
            >
              {/* CIRCULAR / SPHERE IMAGE CONTAINER */}
              <div className="w-full max-w-[340px] aspect-square rounded-full overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-zinc-100 border border-zinc-200/80 mx-auto">
                <Image
                  src={safeImageUrl(
                    item.image,
                    800,
                    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                  )}
                  alt={item.caption || "Shega Generation Gallery"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* CAPTION DETAILS BELOW SPHERE IMAGE */}
              <div className="mt-4 w-full max-w-[340px] px-2 flex items-start justify-between gap-3">
                <p className="text-sm font-sans font-medium text-ink-soft group-hover:text-ochre transition-colors leading-snug line-clamp-2">
                  {item.caption}
                </p>
                {item.categoryTag && (
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ochre flex-shrink-0 pt-0.5">
                    {item.categoryTag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300 max-w-2xl mx-auto">
          <p className="font-display text-xl font-bold uppercase text-zinc-700">No photos found</p>
          <p className="mt-2 text-sm text-zinc-500 font-mono">
            No photos match the selected &ldquo;{active}&rdquo; category tag.
          </p>
          <button
            onClick={() => setActive("All")}
            className="mt-6 px-6 py-2.5 rounded-full bg-ochre text-white font-mono text-xs uppercase font-bold hover:bg-ochre-dark transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* FULL IMAGE LIGHTBOX MODAL */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full p-4 sm:p-6 text-white text-left z-50 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-2 right-2 sm:-top-4 sm:-right-4 z-30 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border border-white/20"
              aria-label="Close photo preview"
            >
              ✕
            </button>

            {/* High-Res Image Container */}
            <div className="relative w-full h-[65vh] max-h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black">
              <Image
                src={safeImageUrl(
                  lightboxItem.image,
                  1600,
                  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600"
                )}
                alt={lightboxItem.caption}
                fill
                className="object-contain"
              />
            </div>

            {/* Caption Footer */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-base sm:text-lg font-sans font-medium text-zinc-100">
                {lightboxItem.caption}
              </p>
              {lightboxItem.categoryTag && (
                <span className="font-mono text-xs font-bold uppercase tracking-wider bg-ochre text-white px-3.5 py-1.5 rounded-full border border-orange-400/40 w-fit">
                  {lightboxItem.categoryTag}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
