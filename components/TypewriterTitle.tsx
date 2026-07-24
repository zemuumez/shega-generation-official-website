"use client";

import React, { useEffect, useState } from "react";

type TypewriterTitleProps = {
  phrases?: string[];
  text?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function TypewriterTitle({
  phrases = ["ሸጋ ትውልድ"],
  text,
  className = "",
  style,
}: TypewriterTitleProps) {
  const phraseList = text ? [text] : phrases;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phraseList[phraseIndex % phraseList.length];

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
      // Re-type phrase after brief pause
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phraseList.length);
      }, 600);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhrase, phraseList.length]);

  // Find space index to split into 2 distinct lines ("ሸጋ" on Line 1, "ትውልድ" on Line 2)
  const spaceIndex = currentPhrase.indexOf(" ");
  const firstWord = spaceIndex !== -1 ? currentPhrase.slice(0, spaceIndex) : currentPhrase;

  const isLine1Active = displayText.length <= firstWord.length;
  const line1Text = isLine1Active ? displayText : firstWord;
  const line2Text = !isLine1Active ? displayText.slice(firstWord.length + 1) : "";

  return (
    <h1 className={`${className} transition-all duration-500`} style={style}>
      {/* Line 1: "ሸጋ" */}
      <span className="block">
        {line1Text}
        {isLine1Active && (
          <span
            aria-hidden="true"
            className="inline-block w-[4px] sm:w-[8px] h-[0.75em] bg-ochre align-baseline ml-1.5 sm:ml-2.5 rounded-full animate-pulse"
          />
        )}
      </span>

      {/* Line 2: "ትውልድ" */}
      <span className="block min-h-[1em]">
        {!isLine1Active ? (
          <span className="inline-block whitespace-nowrap">
            {line2Text}
            <span
              aria-hidden="true"
              className="inline-block w-[4px] sm:w-[8px] h-[0.75em] bg-ochre align-baseline ml-1.5 sm:ml-2.5 rounded-full animate-pulse"
            />
          </span>
        ) : (
          "\u00A0"
        )}
      </span>
    </h1>
  );
}
