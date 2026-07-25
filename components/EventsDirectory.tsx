"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import TypewriterTitle from "@/components/TypewriterTitle";
import { safeImageUrl } from "@/sanity/lib/client";

const TIME_FILTERS = ["Upcoming", "Past", "All"];
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

export default function EventsDirectory({ events }: { events: any[] }) {
  const [timeFilter, setTimeFilter] = useState("Upcoming");
  const [categoryFilter, setCategoryFilter] = useState("All");

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
      {/* HEADER SECTION WITH TYPEWRITER ANIMATION & MAX 2 LINES */}
      <div className="text-center max-w-5xl mx-auto flex flex-col items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#145A32] font-bold block mb-3">
          &mdash; DIRECTORY
        </span>

        <div className="w-full flex items-center justify-center text-center min-h-[2.4em] select-none py-2">
          <TypewriterTitle
            phrases={["Where the generation gathers.", "የትውልዱ መገናኛ"]}
            className="font-display font-black text-[clamp(2.4rem,7vw,4.8rem)] sm:text-[clamp(3.8rem,7vw,6.5rem)] leading-[0.96] uppercase text-ink text-center max-w-full drop-shadow-xs flex flex-col items-center justify-center"
          />
        </div>

        <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-sans font-medium leading-relaxed">
          Active, incoming and historic meetups &mdash; from CTFs in Addis to Simien treks.
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
                    ? "bg-black text-white shadow-xs"
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
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white font-bold shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 border border-zinc-200/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPACT & ELEGANT OVAL ARCH CARDS GRID */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-6xl mx-auto">
          {filteredEvents.map((event) => {
            const dateDisplay = formatDate(event.eventDate);
            const targetUrl =
              event.registrationLink ||
              (event.slug?.current ? `/events/${event.slug.current}` : "/contact");

            return (
              <a
                key={event._id || event.title}
                href={targetUrl}
                target={targetUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-left transition-all"
              >
                {/* PROPORTIONED ELONGATED OVAL ARCH IMAGE CONTAINER */}
                <div className="w-full max-w-[320px] aspect-[3/4] rounded-[150px] overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all duration-500 bg-zinc-100 border border-zinc-200/80">
                  <Image
                    src={safeImageUrl(
                      event.coverImage,
                      600,
                      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                    )}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Subtle Category Pill Overlay on Top Right */}
                  {event.type && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20 shadow-xs">
                        {event.type}
                      </span>
                    </div>
                  )}
                </div>

                {/* ELEGANT CARD TEXT LAYOUT BELOW ARCH IMAGE */}
                <div className="mt-5 w-full max-w-[320px] px-1">
                  {/* Title + Arrow Row */}
                  <div className="flex items-start justify-between gap-2.5">
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase tracking-tight text-ink group-hover:text-[#145A32] transition-colors leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    <span className="text-base text-zinc-400 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 flex-shrink-0 pt-0.5">
                      &nearr;
                    </span>
                  </div>

                  {/* Date & Location Line */}
                  <div className="mt-2.5 flex items-center justify-between text-xs font-mono text-zinc-500 font-medium pt-2 border-t border-zinc-100">
                    <span className="flex items-center gap-1.5 text-zinc-600">
                      <span>📅</span>
                      <span>{dateDisplay}</span>
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1.5 truncate max-w-[150px] text-zinc-500" title={event.location}>
                        <span>📍</span>
                        <span className="truncate">{event.location.split(",")[0]}</span>
                      </span>
                    )}
                  </div>
                </div>
              </a>
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
            className="mt-6 px-6 py-2.5 rounded-full bg-black text-white font-mono text-xs uppercase font-bold hover:bg-zinc-800 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
