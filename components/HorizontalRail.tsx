"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * HorizontalRail
 * ---------------
 * Generic horizontal-scroll showcase used for the LMS course carousel and
 * the events directory. Built on native CSS scroll-snap (see .rail in
 * globals.css) rather than a JS scroll-jacking approach, so it stays
 * responsive on low-end touch devices.
 *
 * A subtle vertical parallax reveal is layered on top via Framer Motion,
 * tied to viewport intersection, not to horizontal position, so it degrades
 * gracefully and respects prefers-reduced-motion globally.
 */
export default function HorizontalRail({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [24, 0, -12]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <motion.div ref={containerRef} style={{ y, opacity }}>
      <div
        className="rail gap-5 px-6 pb-4 sm:px-10"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>
      <p className="mt-2 px-6 text-xs text-ink-soft/60 font-mono sm:px-10">
        drag to explore &rarr;
      </p>
    </motion.div>
  );
}
