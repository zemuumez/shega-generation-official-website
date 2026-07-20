/**
 * TibebPattern
 * ------------
 * The signature visual thread of the Shega Generations site.
 * A procedurally tiled SVG pattern inspired by the diamond-and-chevron
 * borders woven into traditional Ethiopian tibeb/tilf cloth.
 *
 * Rendered as pure vector so it costs bytes, not kilobytes: this is the
 * "low bandwidth" requirement solved structurally, not with image
 * compression tricks.
 *
 * Variants:
 *  - "border"    thin repeating strip, use on section dividers / card edges
 *  - "watermark" large, low-opacity field, use behind hero content
 */

type TibebPatternProps = {
  variant?: "border" | "watermark";
  tone?: "ochre" | "indigo" | "brick";
  id?: string;
  className?: string;
};

const toneMap = {
  ochre: "#F39C12",
  indigo: "#5B6BF9",
  brick: "#E74C3C",
};

export default function TibebPattern({
  variant = "border",
  tone = "ochre",
  id = "tibeb-weave",
  className = "",
}: TibebPatternProps) {
  const color = toneMap[tone];
  const patternId = `${id}-${tone}-${variant}`;

  if (variant === "border") {
    return (
      <svg
        className={className}
        viewBox="0 0 240 24"
        width="100%"
        height="24"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            {/* Clean vector pattern */}
            <path d="M0 12 L12 0 L24 12 L12 24 Z" fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />
            <path d="M12 4 L20 12 L12 20 L4 12 Z" fill={color} opacity="0.12" />
          </pattern>
        </defs>
        <rect width="240" height="24" fill={`url(#${patternId})`} />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 480 480"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M0 30 L30 0 L60 30 L30 60 Z" fill="none" stroke={color} strokeWidth="1" opacity="0.15" />
          <circle cx="30" cy="30" r="3" fill={color} opacity="0.1" />
        </pattern>
      </defs>
      <rect width="480" height="480" fill={`url(#${patternId})`} opacity="0.08" />
    </svg>
  );
}
