import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings & Copy",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title (Typewriter)", type: "string", initialValue: "Shega Generations" }),
    defineField({ name: "heroCaption", title: "Hero Caption", type: "text", rows: 3 }),
    defineField({ name: "heroCtaPrimary", title: "Hero Primary CTA Text", type: "string", initialValue: "Join the Generation" }),
    defineField({ name: "heroCtaSecondary", title: "Hero Secondary CTA Text", type: "string", initialValue: "Support the Mission" }),
    defineField({ name: "statementBannerTitle1", title: "Statement Banner Line 1", type: "string", initialValue: "Tech Orientation" }),
    defineField({ name: "statementBannerTitle2", title: "Statement Banner Line 2", type: "string", initialValue: "Life Skills" }),
    defineField({ name: "statementBannerTitle3", title: "Statement Banner Line 3", type: "string", initialValue: "Indigenous Weaving" }),
    defineField({ name: "culturalAnchoringSubtitle", title: "Cultural Anchoring Subtitle", type: "string" }),
    defineField({ name: "culturalAnchoringDescription", title: "Cultural Anchoring Description", type: "text", rows: 3 }),
    defineField({ name: "pedagogicalTitle", title: "Pedagogical Section Title", type: "string" }),
    defineField({ name: "pedagogicalDescription", title: "Pedagogical Section Description", type: "text", rows: 3 }),
    defineField({ name: "curriculumTitle", title: "Curriculum Section Title", type: "string" }),
    defineField({ name: "curriculumDescription", title: "Curriculum Section Description", type: "text", rows: 3 }),
    defineField({ name: "journeysTitle", title: "Journeys Section Title", type: "string" }),
    defineField({ name: "journeysDescription", title: "Journeys Section Description", type: "text", rows: 3 }),
    defineField({ name: "testimonialsTitle", title: "Testimonials Section Title", type: "string" }),
    defineField({ name: "testimonialsDescription", title: "Testimonials Section Description", type: "text", rows: 3 }),
    defineField({ name: "communityTitle", title: "Community Section Title", type: "string" }),
  ],
  preview: {
    select: { title: "heroTitle" },
    prepare({ title }) {
      return { title: title || "Site Settings & Main Copy" };
    },
  },
});
