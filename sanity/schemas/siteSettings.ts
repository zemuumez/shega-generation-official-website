import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export default defineType({
  name: "siteSettings",
  title: "Site Settings & Page Copy",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "hero", title: "🎯 Hero Section", default: true },
    { name: "statement", title: "📢 Statement Banner" },
    { name: "cultural", title: "🌿 Cultural Anchoring" },
    { name: "pedagogical", title: "🎓 Pedagogical Section" },
    { name: "curriculum", title: "📚 Curriculum Section" },
    { name: "journeys", title: "🚀 Journeys Section" },
    { name: "testimonials", title: "💬 Testimonials Section" },
    { name: "partners", title: "🤝 Partners Section" },
    { name: "community", title: "👥 Community Section" },
  ],
  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Title (Typewriter)",
      type: "string",
      initialValue: "Shega Generations",
      group: "hero",
    }),
    defineField({
      name: "heroCaption",
      title: "Hero Caption",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "Hero Primary CTA Text",
      type: "string",
      initialValue: "Join the Generation",
      group: "hero",
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "Hero Secondary CTA Text",
      type: "string",
      initialValue: "Support the Mission",
      group: "hero",
    }),
    defineField({
      name: "heroTitleBgImage",
      title: "Hero Title Mask Background Image",
      description: "Upload custom image asset to fill/mask the typewriter title background",
      type: "image",
      options: { hotspot: true },
      group: "hero",
    }),

    // Statement Banner Section
    defineField({
      name: "statementBannerTitle1",
      title: "Banner Line 1",
      type: "string",
      group: "statement",
    }),
    defineField({
      name: "statementBannerTitle2",
      title: "Banner Line 2 (Outlined Stroke)",
      type: "string",
      group: "statement",
    }),
    defineField({
      name: "statementBannerTitle3",
      title: "Banner Line 3",
      type: "string",
      group: "statement",
    }),
    defineField({
      name: "statementBannerImage",
      title: "Banner Background Image",
      type: "image",
      options: { hotspot: true },
      group: "statement",
    }),

    // Cultural Anchoring Section
    defineField({
      name: "culturalAnchoringSubtitle",
      title: "Cultural Anchoring Subtitle",
      type: "string",
      group: "cultural",
    }),
    defineField({
      name: "culturalAnchoringDescription",
      title: "Cultural Anchoring Description",
      type: "text",
      rows: 3,
      group: "cultural",
    }),
    defineField({
      name: "culturalAnchoringImage",
      title: "Cultural Anchoring Background Image",
      type: "image",
      options: { hotspot: true },
      group: "cultural",
    }),

    // Pedagogical Section
    defineField({
      name: "pedagogicalTitle",
      title: "Pedagogical Section Title",
      type: "string",
      group: "pedagogical",
    }),
    defineField({
      name: "pedagogicalDescription",
      title: "Pedagogical Section Description",
      type: "text",
      rows: 3,
      group: "pedagogical",
    }),

    // Curriculum Section
    defineField({
      name: "curriculumTitle",
      title: "Curriculum Section Title",
      type: "string",
      group: "curriculum",
    }),
    defineField({
      name: "curriculumDescription",
      title: "Curriculum Section Description",
      type: "text",
      rows: 3,
      group: "curriculum",
    }),

    // Journeys Section
    defineField({
      name: "journeysTitle",
      title: "Journeys Section Title",
      type: "string",
      group: "journeys",
    }),
    defineField({
      name: "journeysDescription",
      title: "Journeys Section Description",
      type: "text",
      rows: 3,
      group: "journeys",
    }),

    // Testimonials Section
    defineField({
      name: "testimonialsTitle",
      title: "Testimonials Section Title",
      type: "string",
      group: "testimonials",
    }),
    defineField({
      name: "testimonialsDescription",
      title: "Testimonials Section Description",
      type: "text",
      rows: 3,
      group: "testimonials",
    }),

    // Partners Section
    defineField({
      name: "partnersKicker",
      title: "Partners Section Kicker Tag",
      type: "string",
      initialValue: "Our clients / partners",
      group: "partners",
    }),
    defineField({
      name: "partnersHeadline",
      title: "Partners Section Headline",
      type: "string",
      initialValue: "Pleasure to work with",
      group: "partners",
    }),
    defineField({
      name: "partnersDescription",
      title: "Partners Section Description",
      type: "text",
      rows: 3,
      initialValue: "Shega Generation collaborates with Ethiopia's premier educational academies, hospitality centers, media houses, and venue operators across Addis Ababa.",
      group: "partners",
    }),

    // Community Section
    defineField({
      name: "communityTitle",
      title: "Community Section Title",
      type: "string",
      group: "community",
    }),
  ],
  preview: {
    select: { title: "heroTitle" },
    prepare({ title }) {
      return { title: title || "Site Settings & Page Copy" };
    },
  },
});
