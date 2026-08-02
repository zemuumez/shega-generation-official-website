"use client";

import React from "react";

export default function SideFramingPatterns() {
  return (
    <>
      {/* Left Side Framing Tibeb Pattern Ribbon - Non-faded at left screen edge, fading towards center content */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[18vw] max-w-xs z-0 pointer-events-none opacity-15 hidden md:block select-none bg-[url('/images/pattern1.svg')] bg-repeat-y bg-top bg-contain"
        style={{
          maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Right Side Framing Tibeb Pattern Ribbon - Non-faded at right screen edge, fading towards center content */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[18vw] max-w-xs z-0 pointer-events-none opacity-15 hidden md:block select-none bg-[url('/images/pattern1.svg')] bg-repeat-y bg-top bg-contain"
        style={{
          maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)",
        }}
      />
    </>
  );
}


