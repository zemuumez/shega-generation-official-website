"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalRail({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [16, 0, -8]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const scrollLeft = () => {
    if (railRef.current) {
      railRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (railRef.current) {
      railRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <motion.div ref={containerRef} style={{ y, opacity }} className="relative">
      <div
        ref={railRef}
        className="rail gap-5 px-6 pb-4 sm:px-10 scroll-smooth"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>

      <div className="mt-4 px-6 sm:px-10 flex items-center justify-between">
        <p className="text-xs text-ink-soft/60 font-mono">
          scroll or drag to explore &rarr;
        </p>

        {/* Scroll Control Arrows */}
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-zinc-200 bg-white text-ink hover:border-ochre hover:text-ochre flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 shadow-sm active:scale-95"
          >
            &larr;
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-zinc-200 bg-white text-ink hover:border-ochre hover:text-ochre flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 shadow-sm active:scale-95"
          >
            &rarr;
          </button>
        </div>
      </div>
    </motion.div>
  );
}
