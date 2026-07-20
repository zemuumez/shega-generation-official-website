"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

const TAGS = ["All", "Expeditions", "Hackathons", "Classroom", "Volunteer-Work"];

export default function GalleryGrid({ items }: { items: any[] }) {
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.categoryTag === active)),
    [active, items]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter gallery by category">
        {TAGS.map((tag) => (
          <button
            key={tag}
            role="tab"
            aria-selected={active === tag}
            onClick={() => setActive(tag)}
            className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
              active === tag
                ? "bg-ochre text-white shadow-sm border border-ochre/25 font-bold"
                : "border border-zinc-200 bg-zinc-50 text-ink-soft hover:border-zinc-300 hover:text-ink font-semibold"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.figure
              key={item._id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
              className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white group hover:border-ochre/30 transition-all duration-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent z-10 opacity-40" />
                <Image
                  src={safeImageUrl(item.image)}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-6 relative z-20">
                <span className="inline-block px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ink/5 text-ink border border-zinc-200 font-bold">
                  {item.categoryTag}
                </span>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">{item.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
