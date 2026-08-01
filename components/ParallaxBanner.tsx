"use client";

import React from "react";

interface ParallaxBannerProps {
  src: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
  heightClass?: string;
  overlayOpacity?: string;
}

export default function ParallaxBanner({
  src,
  children,
  className = "",
  heightClass = "h-[65vh] min-h-[440px]",
  overlayOpacity = "bg-black/50",
}: ParallaxBannerProps) {
  return (
    <section
      className={`relative w-full ${heightClass} overflow-hidden flex items-center justify-center select-none bg-fixed bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url('${src}')` }}
    >
      {/* Dark Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} z-10 pointer-events-none`} />

      {/* Content scrolling over fixed background */}
      {children && (
        <div className="relative z-20 w-full flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </section>
  );
}
