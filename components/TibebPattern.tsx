/**
 * TibebPattern
 * ------------
 * A procedurally tiled SVG pattern inspired by traditional Ethiopian
 * tibeb/tilf weaving and coffee heritage, reproducing the geometric
 * square-grid grid border style.
 *
 * Variants:
 *  - "border-horizontal": Horizontal repeating stripe (height 40px)
 *  - "border-vertical": Vertical repeating stripe (width 40px)
 *  - "watermark": Repeating grid texture for background panels
 */

type TibebPatternProps = {
  variant?: "border-horizontal" | "border-vertical" | "watermark";
  tone?: "ochre" | "indigo" | "brick" | "ink";
  id?: string;
  className?: string;
};

const toneMap = {
  ochre: "#27AE60",
  indigo: "#2A6F6B",
  brick: "#B2533E",
  ink: "#1C1E1B",
};

export default function TibebPattern({
  variant = "border-horizontal",
  tone = "ochre",
  id = "tibeb-weave",
  className = "",
}: TibebPatternProps) {
  const color = toneMap[tone];
  const patternId = `${id}-${tone}-${variant}`;

  // Individual cell geometry helpers (each cell is 40x40px)
  const CoffeeBean = ({ x, y }: { x: number; y: number }) => (
    <g key={`bean-${x}-${y}`}>
      <circle cx={x + 20} cy={y + 20} r="9" fill="none" stroke={color} strokeWidth="1" />
      <path
        d={`M ${x + 13} ${y + 27} C ${x + 16} ${y + 23}, ${x + 24} ${y + 17}, ${x + 27} ${y + 13}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx={x + 16} cy={y + 17} r="1.5" fill={color} />
      <circle cx={x + 24} cy={y + 23} r="1.5" fill={color} />
    </g>
  );

  const FourDots = ({ x, y }: { x: number; y: number }) => (
    <g key={`dots-${x}-${y}`}>
      <circle cx={x + 13} cy={y + 13} r="1.8" fill={color} />
      <circle cx={x + 27} cy={y + 13} r="1.8" fill={color} />
      <circle cx={x + 13} cy={y + 27} r="1.8" fill={color} />
      <circle cx={x + 27} cy={y + 27} r="1.8" fill={color} />
    </g>
  );

  const CornerArcs = ({ x, y }: { x: number; y: number }) => (
    <g key={`arcs-${x}-${y}`}>
      <path d={`M ${x} ${y + 30} A 30 30 0 0 1 ${x + 30} ${y}`} fill="none" stroke={color} strokeWidth="0.8" />
      <path d={`M ${x} ${y + 20} A 20 20 0 0 1 ${x + 20} ${y}`} fill="none" stroke={color} strokeWidth="0.8" />
      <path d={`M ${x} ${y + 10} A 10 10 0 0 1 ${x + 10} ${y}`} fill="none" stroke={color} strokeWidth="0.8" />
    </g>
  );

  const StriatedDiagonal = ({ x, y }: { x: number; y: number }) => (
    <g key={`diag-${x}-${y}`}>
      <line x1={x} y1={y} x2={x + 40} y2={y + 40} stroke={color} strokeWidth="1" />
      <line x1={x} y1={y + 10} x2={x + 10} y2={y + 10} stroke={color} strokeWidth="0.7" />
      <line x1={x} y1={y + 20} x2={x + 20} y2={y + 20} stroke={color} strokeWidth="0.7" />
      <line x1={x} y1={y + 30} x2={x + 30} y2={y + 30} stroke={color} strokeWidth="0.7" />
      <line x1={x + 10} y1={y} x2={x + 10} y2={y + 10} stroke={color} strokeWidth="0.7" />
      <line x1={x + 20} y1={y} x2={x + 20} y2={y + 20} stroke={color} strokeWidth="0.7" />
      <line x1={x + 30} y1={y} x2={x + 30} y2={y + 30} stroke={color} strokeWidth="0.7" />
    </g>
  );

  const ZigzagWave = ({ x, y }: { x: number; y: number }) => (
    <g key={`zigzag-${x}-${y}`}>
      <path
        d={`M ${x} ${y + 12} L ${x + 10} ${y + 28} L ${x + 20} ${y + 12} L ${x + 30} ${y + 28} L ${x + 40} ${y + 12}`}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />
      <path
        d={`M ${x} ${y + 20} L ${x + 10} ${y + 36} L ${x + 20} ${y + 20} L ${x + 30} ${y + 36} L ${x + 40} ${y + 20}`}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />
    </g>
  );

  const ChevronTeeth = ({ x, y }: { x: number; y: number }) => (
    <g key={`chevrons-${x}-${y}`}>
      <line x1={x} y1={y + 12} x2={x + 40} y2={y + 12} stroke={color} strokeWidth="0.8" />
      <line x1={x} y1={y + 28} x2={x + 40} y2={y + 28} stroke={color} strokeWidth="0.8" />
      <path
        d={`M ${x} ${y + 12} L ${x + 8} ${y + 28} L ${x + 16} ${y + 12} L ${x + 24} ${y + 28} L ${x + 32} ${y + 12} L ${x + 40} ${y + 28}`}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />
    </g>
  );

  const VerticalHatching = ({ x, y }: { x: number; y: number }) => (
    <g key={`hatch-${x}-${y}`}>
      <line x1={x + 10} y1={y} x2={x + 10} y2={y + 40} stroke={color} strokeWidth="0.7" />
      <line x1={x + 20} y1={y} x2={x + 20} y2={y + 40} stroke={color} strokeWidth="0.7" />
      <line x1={x + 30} y1={y} x2={x + 30} y2={y + 40} stroke={color} strokeWidth="0.7" />
    </g>
  );

  // 6x6 grid layout map matching the uploaded image cells
  const gridLayout = [
    [CornerArcs, StriatedDiagonal, CoffeeBean, VerticalHatching, StriatedDiagonal, FourDots],
    [CoffeeBean, ZigzagWave, CornerArcs, ChevronTeeth, CoffeeBean, StriatedDiagonal],
    [VerticalHatching, FourDots, StriatedDiagonal, CornerArcs, ZigzagWave, CoffeeBean],
    [ChevronTeeth, CornerArcs, ZigzagWave, FourDots, VerticalHatching, CornerArcs],
    [FourDots, StriatedDiagonal, CoffeeBean, VerticalHatching, ChevronTeeth, ZigzagWave],
    [CornerArcs, ZigzagWave, VerticalHatching, CoffeeBean, StriatedDiagonal, FourDots],
  ];

  if (variant === "border-horizontal") {
    // Horizontal strip ribbon showing a single row of cells (height 40px)
    return (
      <svg
        className={className}
        viewBox="0 0 240 40"
        width="100%"
        height="40"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <pattern id={patternId} width="240" height="40" patternUnits="userSpaceOnUse">
            {/* Grid dividers */}
            <path d="M 0 0 H 240 M 0 40 H 240" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
            <path d="M 0 0 V 40 M 40 0 V 40 M 80 0 V 40 M 120 0 V 40 M 160 0 V 40 M 200 0 V 40 M 240 0 V 40" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
            {/* Single Row 0 Cells */}
            {gridLayout[0].map((CellComponent, idx) => (
              <CellComponent key={`h-cell-${idx}`} x={idx * 40} y={0} />
            ))}
          </pattern>
        </defs>
        <rect width="240" height="40" fill={`url(#${patternId})`} />
      </svg>
    );
  }

  if (variant === "border-vertical") {
    // Vertical strip ribbon showing a single column of cells (width 40px)
    return (
      <svg
        className={className}
        viewBox="0 0 40 240"
        width="40"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <pattern id={patternId} width="40" height="240" patternUnits="userSpaceOnUse">
            {/* Grid dividers */}
            <path d="M 0 0 H 40 M 0 40 H 40 M 0 80 H 40 M 0 120 H 40 M 0 160 H 40 M 0 200 H 40 M 0 240 H 40" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
            <path d="M 0 0 V 240 M 40 0 V 240" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
            {/* Single Column 0 Cells */}
            {gridLayout.map((row, idx) => {
              const CellComponent = row[0];
              return <CellComponent key={`v-cell-${idx}`} x={0} y={idx * 40} />;
            })}
          </pattern>
        </defs>
        <rect width="40" height="240" fill={`url(#${patternId})`} />
      </svg>
    );
  }

  // Watermark Grid variant (240x240px repeating pattern tile)
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
        <pattern id={patternId} width="240" height="240" patternUnits="userSpaceOnUse">
          {/* Inner Grid cell border lines */}
          <path
            d="M 0 0 H 240 M 0 40 H 240 M 0 80 H 240 M 0 120 H 240 M 0 160 H 240 M 0 200 H 240 M 0 240 H 240
               M 0 0 V 240 M 40 0 V 240 M 80 0 V 240 M 120 0 V 240 M 160 0 V 240 M 200 0 V 240 M 240 0 V 240"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.25"
          />
          {/* Map entire 6x6 grid */}
          {gridLayout.flatMap((row, rIdx) =>
            row.map((CellComponent, cIdx) => (
              <CellComponent key={`cell-${rIdx}-${cIdx}`} x={cIdx * 40} y={rIdx * 40} />
            ))
          )}
        </pattern>
      </defs>
      <rect width="480" height="480" fill={`url(#${patternId})`} opacity="0.08" />
    </svg>
  );
}
