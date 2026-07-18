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
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery by category">
        {TAGS.map((tag) => (
          <button
            key={tag}
            role="tab"
            aria-selected={active === tag}
            onClick={() => setActive(tag)}
            className={`px-4 py-2 text-sm font-mono uppercase tracking-wide transition-colors ${
              active === tag
                ? "bg-ink text-ivory"
                : "border border-ink/20 text-ink-soft hover:border-ink"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.figure
              key={item._id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
              className="overflow-hidden rounded-sm border border-ink/10 bg-white"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={safeImageUrl(item.image)}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ochre">{item.categoryTag}</p>
                <p className="mt-1 text-sm text-ink-soft">{item.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
