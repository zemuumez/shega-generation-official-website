/**
 * GeometricPattern / LeafPattern
 * ------------------------------
 * A modern geometric line art SVG pattern generator (Bauhaus / Tibeb line geometry).
 * Features clean vector outlines (semicircles, concentric arcs, arches, triangles, hatch lines)
 * with zero heavy solid fills to ensure text readability across any section background.
 */

type LeafPatternProps = {
  tone?: "gold" | "ink" | "ochre" | "gray" | "teal" | "brick";
  variant?: "mosaic" | "arches" | "concentric" | "matrix";
  id?: string;
  className?: string;
  opacity?: string;
};

const toneMap = {
  gold: "#C59B27",
  ink: "#1E293B",
  gray: "#475569", // Rich slate gray for clear vector line visibility
  ochre: "#27AE60",
  teal: "#0D9488",
  brick: "#B2533E",
};

export default function LeafPattern({
  tone = "gray",
  variant = "mosaic",
  id = "geo-pattern",
  className = "",
  opacity = "0.45",
}: LeafPatternProps) {
  const color = toneMap[tone] || toneMap.gray;
  const patternId = `${id}-${variant}-${tone}`;

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {variant === "mosaic" && (
              <>
                {/* 4x4 Grid of 40x40 Line Geometry */}
                {/* Cell (0,0): Semicircle Up */}
                <path d="M 0 40 A 20 20 0 0 1 40 40 Z" />
                <path d="M 10 40 A 10 10 0 0 1 30 40 Z" />

                {/* Cell (40,0): Vertical Line Hatching */}
                <line x1="48" y1="0" x2="48" y2="40" strokeWidth="1.2" />
                <line x1="56" y1="0" x2="56" y2="40" strokeWidth="1.2" />
                <line x1="64" y1="0" x2="64" y2="40" strokeWidth="1.2" />
                <line x1="72" y1="0" x2="72" y2="40" strokeWidth="1.2" />

                {/* Cell (80,0): Concentric Circle Outline */}
                <circle cx="100" cy="20" r="18" />
                <circle cx="100" cy="20" r="10" />

                {/* Cell (120,0): Diagonal Split Triangle Outline */}
                <path d="M 120 0 L 160 0 L 120 40 Z" />
                <path d="M 160 0 L 160 40 L 120 40 Z" />

                {/* Cell (0,40): Concentric Line Arcs */}
                <path d="M 0 80 A 35 35 0 0 1 35 45" strokeWidth="1.4" />
                <path d="M 0 80 A 22 22 0 0 1 22 58" strokeWidth="1.4" />
                <path d="M 0 80 A 10 10 0 0 1 10 70" strokeWidth="1.4" />

                {/* Cell (40,40): Pillar Archway Outline */}
                <path d="M 40 80 L 40 60 A 20 20 0 0 1 80 60 L 80 80 Z" />

                {/* Cell (80,40): Semicircle Left Outline */}
                <path d="M 120 40 A 20 20 0 0 1 120 80 Z" />

                {/* Cell (120,40): Horizontal Line Hatching */}
                <line x1="120" y1="48" x2="160" y2="48" strokeWidth="1.2" />
                <line x1="120" y1="56" x2="160" y2="56" strokeWidth="1.2" />
                <line x1="120" y1="64" x2="160" y2="64" strokeWidth="1.2" />
                <line x1="120" y1="72" x2="160" y2="72" strokeWidth="1.2" />

                {/* Cell (0,80): Quarter-Circle Wedges */}
                <path d="M 0 80 A 40 40 0 0 1 40 120 L 0 120 Z" />

                {/* Cell (40,80): Diagonal Cross Lines */}
                <line x1="40" y1="80" x2="80" y2="120" />
                <line x1="80" y1="80" x2="40" y2="120" />

                {/* Cell (80,80): Semicircle Down Outline */}
                <path d="M 80 80 A 20 20 0 0 1 120 80 Z" />

                {/* Cell (120,80): Diagonal Split Triangle Outline */}
                <path d="M 120 80 L 160 80 L 160 120 Z" />
                <path d="M 120 80 L 160 120 L 120 120 Z" />

                {/* Cell (0,120): Dot Grid */}
                <circle cx="10" cy="130" r="2.5" fill={color} stroke="none" />
                <circle cx="30" cy="130" r="2.5" fill={color} stroke="none" />
                <circle cx="10" cy="150" r="2.5" fill={color} stroke="none" />
                <circle cx="30" cy="150" r="2.5" fill={color} stroke="none" />

                {/* Cell (40,120): Semicircle Right Outline */}
                <path d="M 40 120 A 20 20 0 0 1 40 160 Z" />

                {/* Cell (80,120): Quarter-Circle Top-Left Outline */}
                <path d="M 80 120 L 120 120 L 80 160 A 40 40 0 0 1 80 120 Z" />

                {/* Cell (120,120): Archway Outline Up */}
                <path d="M 120 160 L 120 140 A 20 20 0 0 1 160 140 L 160 160 Z" />
              </>
            )}

            {variant === "arches" && (
              <>
                <path d="M 0 80 L 0 40 A 40 40 0 0 1 80 40 L 80 80 Z" />
                <path d="M 80 160 L 80 120 A 40 40 0 0 1 160 120 L 160 160 Z" />
                <circle cx="120" cy="40" r="28" />
                <circle cx="40" cy="120" r="28" />
              </>
            )}

            {variant === "concentric" && (
              <>
                <circle cx="80" cy="80" r="70" strokeWidth="1.8" />
                <circle cx="80" cy="80" r="50" strokeWidth="1.4" />
                <circle cx="80" cy="80" r="30" strokeWidth="1.2" />
                <circle cx="80" cy="80" r="10" strokeWidth="1" />
              </>
            )}

            {variant === "matrix" && (
              <>
                <path d="M 0 0 L 80 0 L 0 80 Z" />
                <path d="M 80 0 L 80 80 L 0 80 Z" />
                <path d="M 80 80 L 160 80 L 80 160 Z" />
                <path d="M 160 80 L 160 160 L 80 160 Z" />
              </>
            )}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
}

export { LeafPattern as GeometricPattern };
