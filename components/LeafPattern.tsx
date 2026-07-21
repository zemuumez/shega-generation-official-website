/**
 * LeafPattern
 * -----------
 * A procedurally tiled SVG pattern inspired by flowing organic leaf veins,
 * replicating the golden leaf wallpaper layout.
 *
 * Use this behind subpage text boxes, event blocks, or call-to-actions.
 */

type LeafPatternProps = {
  tone?: "gold" | "ink" | "ochre" | "brick";
  id?: string;
  className?: string;
  opacity?: string;
};

const toneMap = {
  gold: "#C59B27", // Subtle golden-bronze matching the layout
  ink: "#1C1E1B",
  ochre: "#27AE60",
  brick: "#B2533E",
};

export default function LeafPattern({
  tone = "gold",
  id = "leaf-pattern",
  className = "",
  opacity = "0.08",
}: LeafPatternProps) {
  const color = toneMap[tone];
  const patternId = `${id}-${tone}`;

  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Main leaf outline group 1 (angled left-upwards) */}
          <g transform="translate(10, 10)">
            {/* Outer contour */}
            <path
              d="M 0 100 Q 15 40 50 10 Q 85 40 100 100 Q 50 110 0 100 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            {/* Center vein */}
            <path d="M 50 105 Q 50 50 50 10" fill="none" stroke={color} strokeWidth="1" />
            {/* Right side sub-veins */}
            <path d="M 50 85 Q 65 75 78 72" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 65 Q 68 55 83 48" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 45 Q 68 35 80 25" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 25 Q 62 18 68 12" fill="none" stroke={color} strokeWidth="0.6" />
            {/* Left side sub-veins */}
            <path d="M 50 85 Q 35 75 22 72" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 65 Q 32 55 17 48" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 45 Q 32 35 20 25" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 25 Q 38 18 32 12" fill="none" stroke={color} strokeWidth="0.6" />
          </g>

          {/* Overlapping offset leaf group 2 (smaller, rotated right) */}
          <g transform="translate(70, 70) rotate(35) scale(0.65)">
            <path
              d="M 0 100 Q 15 40 50 10 Q 85 40 100 100 Q 50 110 0 100 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            <path d="M 50 105 Q 50 50 50 10" fill="none" stroke={color} strokeWidth="1" />
            <path d="M 50 80 Q 65 70 78 68" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 60 Q 68 50 83 43" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 40 Q 68 30 80 20" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 80 Q 35 70 22 68" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 60 Q 32 50 17 43" fill="none" stroke={color} strokeWidth="0.6" />
            <path d="M 50 40 Q 32 30 20 20" fill="none" stroke={color} strokeWidth="0.6" />
          </g>

          {/* Seamless filler leaf veins on edges */}
          <g transform="translate(-40, 60) scale(0.55)">
            <path d="M 50 105 Q 50 50 50 10" fill="none" stroke={color} strokeWidth="0.7" />
            <path d="M 50 70 Q 70 60 85 55" fill="none" stroke={color} strokeWidth="0.5" />
            <path d="M 50 50 Q 70 40 85 32" fill="none" stroke={color} strokeWidth="0.5" />
          </g>
          <g transform="translate(100, -30) rotate(-15) scale(0.6)">
            <path d="M 50 105 Q 50 50 50 10" fill="none" stroke={color} strokeWidth="0.7" />
            <path d="M 50 70 Q 30 60 15 55" fill="none" stroke={color} strokeWidth="0.5" />
            <path d="M 50 50 Q 30 40 15 32" fill="none" stroke={color} strokeWidth="0.5" />
          </g>
        </pattern>
      </defs>
      <rect width="240" height="240" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
}
