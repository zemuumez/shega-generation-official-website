"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

interface PageLoaderProps {
  forceShow?: boolean;
}

// Track active loader instances so header & footer stay hidden until ALL loaders finish
let activeLoadersCount = 0;

function incrementActiveLoaders() {
  activeLoadersCount++;
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("is-page-loading");
  }
}

function decrementActiveLoaders() {
  activeLoadersCount = Math.max(0, activeLoadersCount - 1);
  if (activeLoadersCount === 0 && typeof document !== "undefined") {
    document.documentElement.classList.remove("is-page-loading");
  }
}

export default function PageLoader({ forceShow = false }: PageLoaderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const isActiveRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically manage active count and html class
  useEffect(() => {
    if (isLoading) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        incrementActiveLoaders();
      }
    } else {
      if (isActiveRef.current) {
        isActiveRef.current = false;
        decrementActiveLoaders();
      }
    }

    return () => {
      if (isActiveRef.current) {
        isActiveRef.current = false;
        decrementActiveLoaders();
      }
    };
  }, [isLoading]);

  // Function to hide loader with smooth fade transition
  const hideLoader = () => {
    setIsFading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  // Initial page load handler
  useEffect(() => {
    if (forceShow) {
      setIsLoading(true);
      setIsFading(false);
      return;
    }

    if (document.readyState === "complete") {
      const timer = setTimeout(hideLoader, 200);
      return () => clearTimeout(timer);
    } else {
      const handleLoad = () => hideLoader();
      window.addEventListener("load", handleLoad);
      const fallback = setTimeout(handleLoad, 3000);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallback);
      };
    }
  }, [forceShow]);

  // Route change handler
  useEffect(() => {
    if (forceShow) return;

    setIsLoading(true);
    setIsFading(false);

    const timer = setTimeout(hideLoader, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  const loaderUI = (
    <div
      className={`fixed inset-0 w-screen h-screen z-[99999999] flex items-center justify-center bg-[#F4F3EE] dark:bg-[#0A192F] transition-opacity duration-400 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999999,
      }}
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

  if (mounted && typeof document !== "undefined") {
    return createPortal(loaderUI, document.body);
  }

  return loaderUI;
}
