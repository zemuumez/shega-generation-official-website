export type ThemeVariables = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  bg: string;
  text: string;
  textSoft: string;
};

export const THEME_PRESETS: Record<string, ThemeVariables> = {
  "orange-navy": {
    primary: "#EA580C",       // Vibrant Ethiopian Ochre Orange
    primaryLight: "#F97316",  // Bright Supporting Orange
    primaryDark: "#C2410C",   // Deep Burnt Orange
    secondary: "#0A192F",     // Deep Navy Blue
    secondaryLight: "#1E293B",// Slate Navy
    bg: "#F4F3EE",           // Editorial Sand Background
    text: "#1C1E1B",         // Charcoal Text
    textSoft: "#5A5E5B",     // Muted Slate Text
  },
  "minimal-monochrome": {
    primary: "#09090B",       // Pure Pitch Black (Zinc 950)
    primaryLight: "#27272A",  // Deep Charcoal (Zinc 800)
    primaryDark: "#000000",   // Solid Pure Black
    secondary: "#18181B",     // Pure Black Secondary (Zinc 900)
    secondaryLight: "#27272A",// Dark Slate Charcoal (Zinc 800)
    bg: "#F4F4F5",           // Ultra Clean Minimalist Paper Background
    text: "#09090B",         // Deep Pitch Black Text
    textSoft: "#3F3F46",     // Dark Muted Slate Text
  },
  "terracotta-slate": {
    primary: "#B2533E",
    primaryLight: "#D78370",
    primaryDark: "#8C3B29",
    secondary: "#1E293B",
    secondaryLight: "#334155",
    bg: "#F5F4F0",
    text: "#1C1E1B",
    textSoft: "#5A5E5B",
  },
  "emerald-navy": {
    primary: "#145A32",
    primaryLight: "#1E824C",
    primaryDark: "#0E3B21",
    secondary: "#0A192F",
    secondaryLight: "#1E293B",
    bg: "#F4F5F0",
    text: "#1C1E1B",
    textSoft: "#5A5E5B",
  },
  "indigo-gold": {
    primary: "#2A6F6B",
    primaryLight: "#4A9F9A",
    primaryDark: "#1D4D4A",
    secondary: "#C59B27",
    secondaryLight: "#DAB548",
    bg: "#F4F3EE",
    text: "#1C1E1B",
    textSoft: "#5A5E5B",
  },
};

export function resolveTheme(siteSettings?: any): ThemeVariables {
  const presetKey = siteSettings?.themePreset || siteSettings?.colorPreset || "orange-navy";
  const defaultPreset = THEME_PRESETS["orange-navy"];

  if (presetKey === "custom" && siteSettings) {
    return {
      primary: siteSettings.customPrimaryColor || siteSettings.primaryColor || siteSettings.accentColor || defaultPreset.primary,
      primaryLight: siteSettings.customPrimaryLightColor || defaultPreset.primaryLight,
      primaryDark: siteSettings.customPrimaryDarkColor || defaultPreset.primaryDark,
      secondary: siteSettings.customSecondaryColor || siteSettings.secondaryColor || defaultPreset.secondary,
      secondaryLight: siteSettings.customSecondaryLightColor || defaultPreset.secondaryLight,
      bg: siteSettings.customBgColor || defaultPreset.bg,
      text: siteSettings.customTextColor || defaultPreset.text,
      textSoft: defaultPreset.textSoft,
    };
  }

  // Return the selected preset directly
  return THEME_PRESETS[presetKey] || defaultPreset;
}

export function generateThemeCssVariables(theme: ThemeVariables): string {
  return `
    :root {
      --color-primary: ${theme.primary};
      --color-primary-light: ${theme.primaryLight};
      --color-primary-dark: ${theme.primaryDark};
      --color-secondary: ${theme.secondary};
      --color-secondary-light: ${theme.secondaryLight};
      --color-bg: ${theme.bg};
      --color-text: ${theme.text};
      --color-text-soft: ${theme.textSoft};
    }
  `.replace(/\s+/g, " ");
}
