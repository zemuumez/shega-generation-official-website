"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import TypewriterTitle from "@/components/TypewriterTitle";
import { safeImageUrl } from "@/sanity/lib/client";

const TIME_FILTERS = ["All", "Upcoming", "Past"];
const CATEGORY_FILTERS = ["All", "CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity"];

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function renderDescriptionText(desc: any): string {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block) => {
        if (block && typeof block === "object" && block.children) {
          return block.children.map((c: any) => c?.text || "").join("");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }
  if (typeof desc === "object" && desc.text) return desc.text;
  return "";
}

export default function EventsDirectory({
  events,
  customPhrases,
  customSubtitle,
  customCategories,
}: {
  events: any[];
  customPhrases?: string[];
  customSubtitle?: string;
  customCategories?: string[];
}) {
  const [timeFilter, setTimeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const categoryOptions = [
    "All",
    ...(customCategories && customCategories.length > 0
      ? customCategories
      : ["CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity"]),
  ];

  const phrases =
    customPhrases && customPhrases.length > 0
      ? customPhrases
      : ["Where the generation gathers.", "የትውልዱ መገናኛ"];

  const subtitle =
    customSubtitle ||
    "Active, incoming and historic meetups from CTFs in Addis to Simien treks.";

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Time filter
      const eventDate = new Date(event.eventDate || Date.now());
      const isUpcoming = event.isUpcoming !== false && eventDate >= new Date();

      if (timeFilter === "Upcoming" && !isUpcoming) return false;
      if (timeFilter === "Past" && isUpcoming) return false;

      // 2. Category filter
      if (categoryFilter !== "All") {
        const type = (event.type || "").toLowerCase();
        const target = categoryFilter.toLowerCase();
        if (type !== target && !type.includes(target)) return false;
      }

      return true;
    });
  }, [events, timeFilter, categoryFilter]);

  return (
    <div className="w-full max-w-[90vw] mx-auto px-4 sm:px-6 pt-16 pb-28">
      {/* HEADER SECTION WITH TYPEWRITER ANIMATION */}
      <div className="text-center max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center text-center min-h-[2.4em] select-none py-2">
          <TypewriterTitle
            phrases={phrases}
            className="font-display font-black text-[clamp(2.4rem,7vw,4.8rem)] sm:text-[clamp(3.8rem,7vw,6.5rem)] leading-[0.96] uppercase text-[#145A32] text-center max-w-full drop-shadow-xs flex flex-col items-center justify-center"
          />
        </div>

        <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-sans font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="mt-14 mb-14 border-y border-zinc-200 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Time Segmented Pills Switcher (Left) */}
        <div className="inline-flex items-center gap-1 bg-zinc-100 p-1 rounded-full border border-zinc-200/80">
          {TIME_FILTERS.map((tf) => {
            const isActive = timeFilter === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-5 py-2 rounded-full font-mono text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#145A32] text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60"
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {/* Category Pills (Right) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categoryOptions.map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#145A32] text-white font-bold shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 border border-zinc-200/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESPONSIVE FULL-WIDTH OVAL ARCH CARDS GRID */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 w-full">
          {filteredEvents.map((event) => {
            const dateDisplay = formatDate(event.eventDate);

            return (
              <button
                key={event._id || event.title}
                onClick={() => setSelectedEvent(event)}
                className="group flex flex-col items-stretch text-left transition-all w-full cursor-pointer focus:outline-none"
              >
                {/* RESPONSIVE ELONGATED OVAL ARCH IMAGE CONTAINER */}
                <div className="w-full aspect-[3/4] rounded-[140px] sm:rounded-[170px] overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all duration-500 bg-zinc-100 border border-zinc-200/80">
                  <Image
                    src={safeImageUrl(
                      event.coverImage,
                      800,
                      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                    )}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Category Overlay Badge */}
                  {event.type && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20 shadow-xs">
                        {event.type}
                      </span>
                    </div>
                  )}
                </div>

                {/* ELEGANT CARD TEXT LAYOUT */}
                <div className="mt-4 w-full px-1">
                  {/* Title + Arrow Row */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase tracking-tight text-ink group-hover:text-[#145A32] transition-colors leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    <span className="text-base text-zinc-400 group-hover:text-[#145A32] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 pt-0.5">
                      &nearr;
                    </span>
                  </div>

                  {/* Date & Location Line */}
                  <div className="mt-2.5 flex items-center justify-between text-xs font-mono text-zinc-500 font-medium pt-2 border-t border-zinc-100">
                    <span className="flex items-center gap-1.5 text-zinc-600">
                      <span>{dateDisplay}</span>
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1.5 truncate max-w-[50%] text-zinc-500" title={event.location}>
                        <span className="truncate">{event.location.split(",")[0]}</span>
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300 max-w-2xl mx-auto">
          <p className="font-display text-xl font-bold uppercase text-zinc-700">No events found</p>
          <p className="mt-2 text-sm text-zinc-500 font-mono">
            No events match the selected &ldquo;{timeFilter}&rdquo; status and &ldquo;{categoryFilter}&rdquo; category.
          </p>
          <button
            onClick={() => {
              setTimeFilter("All");
              setCategoryFilter("All");
            }}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#145A32] text-white font-mono text-xs uppercase font-bold hover:bg-[#0E3B21] transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* EVENT DETAIL MODAL DIALOG */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 z-50 my-auto overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-20 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* RECTANGULAR COVER IMAGE AS REQUESTED */}
            <div className="relative w-full h-[240px] sm:h-[320px] rounded-2xl overflow-hidden mb-6 shadow-sm border border-zinc-200/80">
              <Image
                src={safeImageUrl(
                  selectedEvent.coverImage,
                  1200,
                  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
                )}
                alt={selectedEvent.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Category & Date / Location Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-[#145A32]/10 text-[#145A32] px-3 py-1 rounded-full border border-[#145A32]/20">
                {selectedEvent.type || "Event"}
              </span>

              <div className="flex flex-wrap items-center gap-4 text-zinc-500 font-medium">
                <span>{formatDate(selectedEvent.eventDate)}</span>
                {selectedEvent.location && <span>{selectedEvent.location}</span>}
              </div>
            </div>

            {/* Event Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-ink mt-4 leading-tight">
              {selectedEvent.title}
            </h2>

            {/* Description */}
            <p className="mt-4 text-zinc-600 text-sm sm:text-base leading-relaxed font-sans whitespace-pre-line">
              {renderDescriptionText(selectedEvent.description) ||
                "Join Shega Generation students, tech leaders, and community members for an interactive gathering filled with technology demonstrations, workshops, and youth innovation."}
            </p>

            {/* Action / Registration Link (If Available) */}
            <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between gap-4">
              <a
                href={
                  selectedEvent.registrationLink ||
                  (selectedEvent.slug?.current
                    ? `/events/${selectedEvent.slug.current}`
                    : "/contact")
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#145A32] text-white px-7 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#0E3B21] transition-all shadow-md"
              >
                <span>Register &amp; Learn More</span>
                <span>&rarr;</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-900 underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
