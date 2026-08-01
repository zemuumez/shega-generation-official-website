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

  const circleDimension =
    loaderSize === "sm"
      ? "w-6 h-6 border-2"
      : loaderSize === "lg"
      ? "w-14 h-14 border-4"
      : "w-10 h-10 border-3";

  return (
    <div className={`relative overflow-hidden ${fill ? "w-full h-full" : ""} ${containerClassName}`}>
      {/* Sleek Circular Loading Spinner for Card Scope Level Image Loading */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100/80 dark:bg-navy/80 backdrop-blur-xs transition-opacity duration-300 select-none">
          {/* Circular Spinner */}
          <div className="relative flex items-center justify-center">
            {/* Outer Subtle Background Circle */}
            <div className={`${circleDimension} rounded-full border-zinc-300/60 dark:border-white/20`} />
            {/* Inner Animated Spinning Arc */}
            <div className={`absolute inset-0 ${circleDimension} rounded-full border-ochre border-t-transparent animate-spin`} />
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
          className={`${className} transition-opacity duration-500 ${
            isLoading ? "opacity-0 scale-98" : "opacity-100 scale-100"
          }`}
          onLoad={() => setIsLoading(false)}
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
          className={`${className} transition-opacity duration-500 ${
            isLoading ? "opacity-0 scale-98" : "opacity-100 scale-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(fallbackSrc);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}
