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

    // Statement Banner Section
    defineField({
      name: "statementBannerTitle1",
      title: "Statement Banner Line 1",
      type: "string",
      initialValue: "Tech Orientation",
      group: "statement",
    }),
    defineField({
      name: "statementBannerTitle2",
      title: "Statement Banner Line 2",
      type: "string",
      initialValue: "Life Skills",
      group: "statement",
    }),
    defineField({
      name: "statementBannerTitle3",
      title: "Statement Banner Line 3",
      type: "string",
      initialValue: "Indigenous Weaving",
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
