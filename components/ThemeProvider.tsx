"use client";

import { resolveTheme, generateThemeCssVariables } from "@/lib/themePresets";

export default function ThemeProvider({ siteSettings }: { siteSettings?: any }) {
  const theme = resolveTheme(siteSettings);
  const cssString = generateThemeCssVariables(theme);

  return <style id="dynamic-theme-vars" dangerouslySetInnerHTML={{ __html: cssString }} />;
}
