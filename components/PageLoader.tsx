"use client";

import React, { useEffect, useState } from "react";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if document and window images are already complete
    const handleLoad = () => {
      // Start smooth fade out
      setIsFading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 600); // 600ms fade transition
    };

    if (document.readyState === "complete") {
      // Small tick to ensure smooth transition
      const timer = setTimeout(handleLoad, 300);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleLoad);
      // Safety fallback max timeout of 3.5s in case of slow external networks
      const fallbackTimer = setTimeout(handleLoad, 3500);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F4F3EE] dark:bg-[#0A192F] transition-opacity duration-600 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 1. LEFT SIDE ANIMATED HERO PATTERN RIBBON */}
      <div className="absolute left-0 top-0 bottom-0 w-[30vw] max-w-sm z-0 pointer-events-none opacity-20 hidden sm:block [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0)_100%)] [-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0)_100%)]">
        <div className="w-full h-[200%] animate-pattern-scroll">
          <img
            src="/images/pattern1.svg"
            alt=""
            className="h-full w-full object-cover object-left scale-x-[-1]"
          />
        </div>
      </div>

      {/* 2. RIGHT SIDE ANIMATED HERO PATTERN RIBBON */}
      <div className="absolute right-0 top-0 bottom-0 w-[30vw] max-w-sm z-0 pointer-events-none opacity-20 hidden sm:block [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0)_100%)] [-webkit-mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0)_100%)]">
        <div className="w-full h-[200%] animate-pattern-scroll-reverse">
          <img
            src="/images/pattern1.svg"
            alt=""
            className="h-full w-full object-cover object-left"
          />
        </div>
      </div>

      {/* 3. CENTER: TRANSPARENT LOGO WITH ANIMATED GLOW */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
        {/* Soft Radial Glow Aura */}
        <div className="relative mb-6">
          <div className="absolute -inset-6 rounded-full bg-ochre/25 blur-2xl animate-pulse" />

          {/* Transparent Logo Frame */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 p-3 flex items-center justify-center transition-transform duration-500">
            <img
              src="/images/logo.png"
              alt="Shega Generation"
              className="w-full h-full object-contain drop-shadow-xl animate-pulse"
            />
          </div>
        </div>

        {/* Amharic & English Brand Title */}
        <div className="flex flex-col items-center justify-center leading-none mb-4">
          <div className="flex items-baseline gap-1.5 text-2xl sm:text-3xl">
            <span className="font-black text-ochre font-display tracking-wide">ሸጋ</span>
            <span className="font-bold text-navy dark:text-white font-sans tracking-wider">ትውልድ</span>
          </div>
          <span className="text-xs font-sans font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Shega Generation
          </span>
        </div>

        {/* Sleek Animated Shimmer Line Indicator */}
        <div className="w-36 h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-ochre via-amber-400 to-ochre w-full rounded-full animate-progress-slide" />
        </div>
      </div>
    </div>
  );
}
