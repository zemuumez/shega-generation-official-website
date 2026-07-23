"use client";

import { useEffect, useState } from "react";

type TypewriterTitleProps = {
  text?: string;
  className?: string;
};

export default function TypewriterTitle({
  text = "Shega Generations",
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
      }, 110);
    } else if (!isDeleting && displayText.length === text.length) {
      // Hold at full text for 2.5s
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
    } else if (isDeleting && displayText.length > 0) {
      // Backspace character by character
      timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length - 1));
      }, 55);
    } else if (isDeleting && displayText.length === 0) {
      // Hold at empty before typing again
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text]);

  return (
    <h1 className={className}>
      <span>{displayText}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[4px] sm:w-[8px] h-[0.75em] bg-ochre align-baseline ml-1 sm:ml-2 rounded-full animate-pulse"
      />
    </h1>
  );
}
