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
          DEFAULT: "#F4F3EE", // Editorial sand background
          dim: "#FFFFFF",    // Solid card white
          light: "#E4E3DD",  // Sand border
        },
        ink: {
          DEFAULT: "#1C1E1B", // Dark pine charcoal text
          soft: "#5A5E5B",    // Muted slate text
        },
        ochre: {
          DEFAULT: "#145A32", // Deep #145A32 green accent
          light: "#1E824C",   // Supporting emerald green
          dark: "#0E3B21",    // Dark forest green
        },
        indigo: {
          DEFAULT: "#2A6F6B", // Secondary slate green/teal
          light: "#4A9F9A",
        },
        brick: {
          DEFAULT: "#B2533E", // Supporting earthy terracotta
          light: "#D78370",
        },
        moss: {
          DEFAULT: "#145A32", // Primary #145A32 green
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
