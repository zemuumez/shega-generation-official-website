"use client";

import React from "react";

export default function SideFramingPatterns() {
  return (
    <>
      {/* Left Side Framing Tibeb Pattern Ribbon */}
      <div className="absolute left-0 top-0 bottom-0 w-[22vw] max-w-xs z-0 pointer-events-none opacity-15 hidden md:block [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] [-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] select-none">
        <img
          src="/images/pattern1.svg"
          alt=""
          className="h-full w-full object-cover object-left scale-x-[-1]"
        />
      </div>

      {/* Right Side Framing Tibeb Pattern Ribbon */}
      <div className="absolute right-0 top-0 bottom-0 w-[22vw] max-w-xs z-0 pointer-events-none opacity-15 hidden md:block [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] [-webkit-mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] select-none">
        <img
          src="/images/pattern1.svg"
          alt=""
          className="h-full w-full object-cover object-left"
        />
      </div>
    </>
  );
}
