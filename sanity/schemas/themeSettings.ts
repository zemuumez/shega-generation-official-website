import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export default defineType({
  name: "themeSettings",
  title: "Global Theme & Brand Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "Shega Generations",
    }),
    defineField({
      name: "siteTagline",
      title: "Site Tagline / Slogan",
      type: "string",
      initialValue: "Nurturing Tech Geniuses & Indigenous Leadership in Ethiopia",
    }),
    defineField({
      name: "themePreset",
      title: "Color Theme Preset",
      description: "Select a curated color palette preset, or choose 'Custom Colors' to define custom hex codes below.",
      type: "string",
      initialValue: "orange-navy",
      options: {
        list: [
          { title: "Orange & Deep Navy (Default)", value: "orange-navy" },
          { title: "Warm Terracotta & Dark Slate", value: "terracotta-slate" },
          { title: "Deep Emerald & Royal Navy", value: "emerald-navy" },
          { title: "Manuscript Indigo & Sunset Gold", value: "indigo-gold" },
          { title: "Custom Colors (Set below)", value: "custom" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "primaryColor",
      title: "Primary Color (Hex)",
      type: "string",
      description: "Main brand color (e.g. #D97706 or #EA580C)",
    }),
    defineField({
      name: "secondaryColor",
      title: "Secondary Color (Hex)",
      type: "string",
      description: "Secondary brand color (e.g. #0F172A or #0A192F)",
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color (Hex)",
      type: "string",
    }),
    defineField({
      name: "customPrimaryColor",
      title: "Custom Main / Accent Color (Hex)",
      description: "e.g. #EA580C - Used for main buttons, highlights, brand logo mark",
      type: "string",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
    defineField({
      name: "customPrimaryLightColor",
      title: "Custom Light Accent Color (Hex)",
      description: "e.g. #F97316 - Used for active rings, hover states",
      type: "string",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Global Theme & Brand Colors" };
    },
  },
});
