import type { Config } from "tailwindcss";

// Design tokens for Shega Generations
// Palette pulled from tibeb/tilf weaving materials: undyed cotton, ochre dye,
// manuscript indigo, and oxidized brick red. Deliberately avoiding the
// generic warm-cream + terracotta AI-default combo.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FBFBF9", // Soft clean warm white background
          dim: "#FFFFFF",    // Solid white for cards
          light: "#F0EFEA",  // Soft border gray-sand
        },
        ink: {
          DEFAULT: "#1B221E", // Deep Pine charcoal main text
          soft: "#55625B",    // Muted slate-green text
        },
        ochre: {
          DEFAULT: "#1E5D3A", // Organic forest green (primary accent)
          light: "#3E8E5E",   // Sage green
          dark: "#103F25",    // Deep pine green
        },
        indigo: {
          DEFAULT: "#2A6F6B", // Secondary accent green/teal
          light: "#4A9F9A",   // Sage teal
        },
        brick: {
          DEFAULT: "#B2533E", // Earthy clay terracotta highlight
          light: "#D78370",
        },
        moss: {
          DEFAULT: "#1E5D3A", // Forest green
        },
      },
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.5rem, 2.6vw, 2.25rem)", { lineHeight: "1.1" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      animation: {
        "weave-drift": "weave-drift 40s linear infinite",
      },
      keyframes: {
        "weave-drift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "240px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
