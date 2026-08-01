import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F4F3EE] dark:bg-[#0A192F] transition-colors duration-500">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
        {/* Outer Pulsing Glow Aura */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-ochre/20 blur-xl animate-pulse" />
          
          {/* Logo Frame */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 p-4 rounded-3xl bg-white/80 dark:bg-navy/80 shadow-2xl border border-zinc-200/60 dark:border-white/10 backdrop-blur-md flex items-center justify-center animate-bounce-gentle">
            <img
              src="/images/logo.png"
              alt="Shega Generation Logo"
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Brand Title */}
        <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-ochre uppercase mb-1">
          ሸጋ ትውልድ
        </h2>
        <p className="text-xs sm:text-sm font-sans font-semibold text-zinc-600 dark:text-zinc-300 tracking-wider uppercase mb-6">
          Shega Generation
        </p>

        {/* Sleek Animated Progress Bar */}
        <div className="w-48 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-ochre via-amber-500 to-ochre w-full rounded-full animate-progress-slide" />
        </div>

        <p className="mt-4 text-[11px] font-sans font-medium text-zinc-500 dark:text-zinc-400 italic">
          Nurturing Tech Geniuses & Indigenous Leadership
        </p>
      </div>
    </div>
  );
}
