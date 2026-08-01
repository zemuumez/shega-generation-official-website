"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithLoaderProps extends Omit<ImageProps, "onLoad"> {
  fallbackSrc?: string;
  loaderSize?: "sm" | "md" | "lg";
  containerClassName?: string;
}

export default function ImageWithLoader({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  containerClassName = "",
  loaderSize = "md",
  fallbackSrc = "/images/logo.png",
  ...props
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  const logoDimension = loaderSize === "sm" ? "w-8 h-8" : loaderSize === "lg" ? "w-16 h-16" : "w-12 h-12";

  return (
    <div className={`relative overflow-hidden ${fill ? "w-full h-full" : ""} ${containerClassName}`}>
      {/* Sleek Glassmorphic Skeleton Loader with Pulsing Shega Logo */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-100/90 dark:bg-navy/90 backdrop-blur-xs transition-opacity duration-500 select-none">
          {/* Subtle animated shimmer background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer" />

          {/* Centered Pulsing Shega Generation Logo */}
          <div className="relative z-10 flex flex-col items-center justify-center p-3">
            <div className={`relative ${logoDimension} animate-pulse drop-shadow-md`}>
              <img
                src="/images/logo.png"
                alt="Loading..."
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-2 flex items-center space-x-1 text-[10px] font-sans font-bold tracking-widest text-ochre uppercase animate-pulse">
              <span>Shega</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-ochre animate-ping" />
            </div>
          </div>
        </div>
      )}

      {/* Main Image */}
      {fill ? (
        <Image
          {...props}
          src={imgSrc}
          alt={alt || "Shega Generation"}
          fill={fill}
          className={`transition-all duration-700 ${isLoading ? "scale-105 blur-xs opacity-0" : "scale-100 blur-0 opacity-100"} ${className}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(fallbackSrc);
            setIsLoading(false);
          }}
        />
      ) : (
        <Image
          {...props}
          src={imgSrc}
          alt={alt || "Shega Generation"}
          width={width}
          height={height}
          className={`transition-all duration-700 ${isLoading ? "scale-105 blur-xs opacity-0" : "scale-100 blur-0 opacity-100"} ${className}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(fallbackSrc);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}
