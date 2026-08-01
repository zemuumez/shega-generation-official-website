"use client";

import React, { useEffect, useState } from "react";

type TypewriterTitleProps = {
  phrases?: string[];
  text?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function TypewriterTitle({
  phrases = ["Shega Generation", "ሸጋ ትውልድ"],
  text,
  className = "",
  style,
}: TypewriterTitleProps) {
  const rawPhrases = text ? [text, "ሸጋ ትውልድ"] : phrases;
  const sanitizedPhrases = rawPhrases && Array.isArray(rawPhrases)
    ? rawPhrases.filter((p) => typeof p === "string" && p.trim().length > 0)
    : [];
  const phraseList = sanitizedPhrases.length > 0 ? sanitizedPhrases : ["Shega Generation", "ሸጋ ትውልድ"];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phraseList[phraseIndex % phraseList.length] || "Shega Generation";
  const isAmharic = /[\u1200-\u137F]/.test(currentPhrase);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentPhrase.length) {
      // Type out character by character
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
      }, 95);
    } else if (!isDeleting && displayText.length === currentPhrase.length) {
      // Hold at full text for 4 seconds
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 4000);
    } else if (isDeleting && displayText.length > 0) {
      // Backspace character by character
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length - 1));
      }, 55);
    } else if (isDeleting && displayText.length === 0) {
      // Switch to next phrase in loop after brief pause
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phraseList.length);
      }, 600);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhrase, phraseList.length]);

  // Split phrase into 2 balanced lines maximum
  const words = currentPhrase.split(" ");
  let line1Full = currentPhrase;
  let line2Full = "";

  if (words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    line1Full = words.slice(0, mid).join(" ");
    line2Full = words.slice(mid).join(" ");
  }

  const isLine1Active = displayText.length <= line1Full.length;
  const line1Text = isLine1Active ? displayText : line1Full;
  const line2Text = !isLine1Active ? displayText.slice(line1Full.length + 1) : "";

  // Balanced tracking for Amharic vs English without horizontal scaling distortion
  const trackingClass = isAmharic
    ? "tracking-[0.10em] sm:tracking-[0.16em]"
    : "tracking-[0.04em] sm:tracking-[0.08em]";

  return (
    <h1
      className={`text-ochre ${className} ${trackingClass} transition-all duration-500`}
      style={style}
    >
      {/* Line 1 - Strict single line */}
      <span className="block whitespace-nowrap">
        {line1Text}
        {isLine1Active && (
          <span
            aria-hidden="true"
            className="inline-block w-[4px] sm:w-[8px] h-[0.75em] bg-ochre align-baseline ml-2 sm:ml-3 rounded-full animate-pulse"
          />
        )}
      </span>

      {/* Line 2 - Strict single line (Maximum 2 lines total) */}
      {line2Full ? (
        <span className="block min-h-[1em] whitespace-nowrap">
          {!isLine1Active ? (
            <span className="inline-block whitespace-nowrap">
              {line2Text}
              <span
                aria-hidden="true"
                className="inline-block w-[4px] sm:w-[8px] h-[0.75em] bg-ochre align-baseline ml-2 sm:ml-3 rounded-full animate-pulse"
              />
            </span>
          ) : (
            "\u00A0"
          )}
        </span>
      ) : null}
    </h1>
  );
}
