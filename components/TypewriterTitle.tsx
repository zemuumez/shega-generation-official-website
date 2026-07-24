"use client";

import { useEffect, useState } from "react";

type TypewriterTitleProps = {
  text?: string;
  className?: string;
};

export default function TypewriterTitle({
  text = "Shega Generation",
  className = "",
}: TypewriterTitleProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText.length < text.length) {
      // Type out character by character
      timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, 90);
    } else if (!isDeleting && displayText.length === text.length) {
      // Hold at full text
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 5500);
    } else if (isDeleting && displayText.length > 0) {
      // Backspace character by character
      timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length - 1));
      }, 55);
    } else if (isDeleting && displayText.length === 0) {
      // Hold before typing again
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 900);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text]);

  // Find space index to split into 2 distinct lines
  const spaceIndex = text.indexOf(" ");
  const firstWord = spaceIndex !== -1 ? text.slice(0, spaceIndex) : text;

  const isLine1Active = displayText.length <= firstWord.length;
  const line1Text = isLine1Active ? displayText : firstWord;
  const line2Text = !isLine1Active ? displayText.slice(firstWord.length + 1) : "";

  return (
    <h1 className={className}>
      {/* Line 1: SHEGA */}
      <span className="block">
        {line1Text}
        {isLine1Active && (
          <span
            aria-hidden="true"
            className="inline-block w-[4px] sm:w-[8px] h-[0.75em] bg-ochre align-baseline ml-1.5 sm:ml-2.5 rounded-full animate-pulse"
          />
        )}
      </span>

      {/* Line 2: GENERATION(S) */}
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
