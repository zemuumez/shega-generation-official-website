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
          DEFAULT: "#FAF7F0",
          dim: "#F2EEE3",
        },
        ink: {
          DEFAULT: "#201D1A",
          soft: "#4A453E",
        },
        ochre: {
          DEFAULT: "#A9792C",
          light: "#C79A4F",
          dark: "#7E5A1F",
        },
        indigo: {
          DEFAULT: "#2B3A5C",
          light: "#3E5280",
        },
        brick: {
          DEFAULT: "#8C3A2B",
          light: "#A94C3A",
        },
        moss: {
          DEFAULT: "#4B5A3F",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
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
