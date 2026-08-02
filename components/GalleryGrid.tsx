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
  const [lightboxItem, setLightboxItem] = useState<{
    image: any;
    caption: string;
    groupTitle: string;
    categoryTag: string;
  } | null>(null);

  const [visibleRowsMap, setVisibleRowsMap] = useState<Record<string, number>>({});
  const [itemsPerRow, setItemsPerRow] = useState(4);

  useEffect(() => {
    const updateItemsPerRow = () => {
      const w = window.innerWidth;
      if (w >= 1280) setItemsPerRow(4);
      else if (w >= 1024) setItemsPerRow(3);
      else if (w >= 640) setItemsPerRow(2);
      else setItemsPerRow(1);
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);

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


  // Dynamically merge CMS-configured categories and any custom tags used on gallery documents
  const categoryOptions = useMemo(() => {
    const base =
      customCategories && customCategories.length > 0
        ? customCategories
        : DEFAULT_TAGS;

    const set = new Set<string>(base);
    (items || []).forEach((item) => {
      if (item.categoryTag && typeof item.categoryTag === "string" && item.categoryTag.trim()) {
        set.add(item.categoryTag.trim());
      }
    });

    return ["All", ...Array.from(set)];
  }, [customCategories, items]);

  const phrases =
    customPhrases && customPhrases.length > 0
      ? customPhrases
      : ["The weave, in pictures.", "በስዕሎች የተሸመነው"];

  const subtitle =
    customSubtitle ||
    "Expeditions, hackathons, classrooms, and volunteer work across Ethiopia.";

  // Normalize Sanity items into structured album groups with photos
  const processedGroups = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((doc, docIdx) => {
      const groupTitle = doc.title || doc.caption || "Gallery Collection";
      const categoryTag = doc.categoryTag || "General";
      const description = doc.description || "";

      let photos: Array<{
        id: string;
        image: any;
        caption: string;
        groupTitle: string;
        categoryTag: string;
      }> = [];

      // Check if document has bulk images array
      if (Array.isArray(doc.images) && doc.images.length > 0) {
        photos = doc.images.map((imgObj: any, imgIdx: number) => ({
          id: imgObj._key || `${doc._id || docIdx}-${imgIdx}`,
          image: imgObj.image || imgObj,
          caption: imgObj.caption || doc.caption || groupTitle,
          groupTitle,
          categoryTag,
        }));
      } else if (doc.image) {
        // Fallback to legacy single image
        photos = [
          {
            id: doc._id || `doc-${docIdx}`,
            image: doc.image,
            caption: doc.caption || groupTitle,
            groupTitle,
            categoryTag,
          },
        ];
      }

      return {
        id: doc._id || `group-${docIdx}`,
        title: groupTitle,
        categoryTag,
        description,
        photos,
      };
    });
  }, [items]);

  // Filter album groups according to the selected category tag
  const filteredGroups = useMemo(() => {
    return processedGroups.filter((group) => {
      if (group.photos.length === 0) return false;
      if (active === "All") return true;

      const groupTagLower = (group.categoryTag || "").toLowerCase().trim();
      const activeLower = active.toLowerCase().trim();

      return groupTagLower === activeLower || groupTagLower.includes(activeLower);
    });
  }, [processedGroups, active]);

  const totalPhotosCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.photos.length, 0);
  }, [filteredGroups]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-28">
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

      {/* TITLED PHOTO GROUPS / ALBUMS GRID */}
      {filteredGroups.length > 0 && totalPhotosCount > 0 ? (
        <div className="space-y-16 sm:space-y-20 w-full">
          {filteredGroups.map((group) => {
            const currentRows = visibleRowsMap[group.id] || 1;
            const maxVisible = currentRows * itemsPerRow;
            const visiblePhotos = group.photos.slice(0, maxVisible);
            const hiddenCount = group.photos.length - visiblePhotos.length;

            return (
              <div key={group.id} className="w-full">
                {/* ALBUM GROUP HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-300/80 pb-4 mb-8 gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ochre bg-ochre/10 px-3 py-1 rounded-full border border-ochre/25">
                        {group.categoryTag}
                      </span>
                      <span className="font-mono text-xs font-semibold text-zinc-500">
                        • {group.photos.length} {group.photos.length === 1 ? "photo" : "photos"}
                      </span>
                    </div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-zinc-900 tracking-tight">
                      {group.title}
                    </h3>
                    {group.description && (
                      <p className="mt-1.5 text-sm font-sans font-medium text-zinc-600 max-w-2xl leading-relaxed">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* CIRCULAR / SPHERICAL IMAGE CARDS GRID MATCHING TEMPLATE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 w-full">
                  {visiblePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setLightboxItem(photo)}
                      className="group flex flex-col items-center text-left transition-all w-full cursor-pointer"
                    >
                      {/* CIRCULAR / SPHERE IMAGE CONTAINER */}
                      <div className="w-full max-w-[340px] aspect-square rounded-full overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-zinc-100 border border-zinc-200/80 mx-auto">
                        <Image
                          src={safeImageUrl(
                            photo.image,
                            800,
                            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                          )}
                          alt={photo.caption || group.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* CAPTION DETAILS BELOW SPHERE IMAGE */}
                      <div className="mt-4 w-full max-w-[340px] px-2 flex items-start justify-between gap-3">
                        <p className="text-sm font-sans font-medium text-ink-soft group-hover:text-ochre transition-colors leading-snug line-clamp-2">
                          {photo.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SEE MORE BUTTON FOR +1 ROW UNLOCK */}
                {hiddenCount > 0 && (
                  <div className="mt-10 flex items-center justify-center">
                    <button
                      onClick={() =>
                        setVisibleRowsMap((prev) => ({
                          ...prev,
                          [group.id]: (prev[group.id] || 1) + 1,
                        }))
                      }
                      className="px-6 py-2.5 rounded-full bg-white border border-ochre/40 text-ochre font-mono text-xs uppercase font-bold hover:bg-ochre hover:text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
                    >
                      <span>See More</span>
                      <span className="bg-ochre/10 text-ochre group-hover:bg-white/20 group-hover:text-white px-2.5 py-0.5 rounded-full text-[10px]">
                        +{Math.min(hiddenCount, itemsPerRow)} ({hiddenCount} remaining)
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

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
                alt={lightboxItem.caption || lightboxItem.groupTitle}
                fill
                className="object-contain"
              />
            </div>

            {/* Caption & Title Footer */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase font-bold text-ochre tracking-wider mb-0.5">
                  {lightboxItem.groupTitle}
                </p>
                <p className="text-base sm:text-lg font-sans font-medium text-zinc-100">
                  {lightboxItem.caption}
                </p>
              </div>
              {lightboxItem.categoryTag && (
                <span className="font-mono text-xs font-bold uppercase tracking-wider bg-ochre text-white px-3.5 py-1.5 rounded-full border border-orange-400/40 w-fit shrink-0">
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

