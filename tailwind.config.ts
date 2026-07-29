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
          DEFAULT: "var(--color-bg, #F4F3EE)",
          dim: "#FFFFFF",
          light: "#E4E3DD",
        },
        ink: {
          DEFAULT: "var(--color-text, #1C1E1B)",
          soft: "var(--color-text-soft, #5A5E5B)",
        },
        ochre: {
          DEFAULT: "var(--color-primary, #EA580C)",
          light: "var(--color-primary-light, #F97316)",
          dark: "var(--color-primary-dark, #C2410C)",
        },
        navy: {
          DEFAULT: "var(--color-secondary, #0A192F)",
          light: "var(--color-secondary-light, #1E293B)",
          dark: "#030A16",
        },
        indigo: {
          DEFAULT: "#2A6F6B",
          light: "#4A9F9A",
        },
        brick: {
          DEFAULT: "#B2533E",
          light: "#D78370",
        },
        moss: {
          DEFAULT: "var(--color-primary, #EA580C)",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
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
