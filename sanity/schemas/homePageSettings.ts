import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export default defineType({
  name: "homePageSettings",
  title: "Home Page Copy & Settings",
  type: "document",
  icon: HomeIcon,
  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Section Title",
      type: "string",
      initialValue: "Shega Generation",
    }),
    defineField({
      name: "heroCaption",
      title: "Hero Section Caption / Description",
      type: "text",
      rows: 3,
      initialValue:
        "Sharing knowledge in kindness across generations — fusing software engineering and AI with Ethiopian heritage to empower future leaders.",
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "Primary Button Text",
      type: "string",
      initialValue: "Apply for Summer Camp",
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "Secondary Button Text",
      type: "string",
      initialValue: "Partner & Sponsor",
    }),
    defineField({
      name: "heroTitleBgImage",
      title: "Hero Title Mask Background Image",
      type: "image",
      options: { hotspot: true },
    }),

    // Statement Banner Section
    defineField({
      name: "statementBannerTitle1",
      title: "Statement 1 (Solid White)",
      type: "string",
      initialValue: "Software & AI Labs",
    }),
    defineField({
      name: "statementBannerTitle2",
      title: "Statement 2 (Stroked Text)",
      type: "string",
      initialValue: "Indigenous Wisdom & Erq",
    }),
    defineField({
      name: "statementBannerTitle3",
      title: "Statement 3 (Solid White)",
      type: "string",
      initialValue: "Youth Leadership",
    }),
    defineField({
      name: "statementBannerImage",
      title: "Statement Banner Background Image",
      type: "image",
      options: { hotspot: true },
    }),

    // Cultural Anchoring Section
    defineField({
      name: "culturalAnchoringSubtitle",
      title: "Cultural Anchoring Subtitle",
      type: "string",
      initialValue: "Rooted in Ethiopian Heritage & Character",
    }),
    defineField({
      name: "culturalAnchoringDescription",
      title: "Cultural Anchoring Description",
      type: "text",
      rows: 3,
      initialValue:
        "From ancient Ge'ez fundamentals and Ethiopian history to traditional dining etiquette (የማዕድ ስነ-ስርዓት) and positive communication (ፈገግታና አዎንታዊ ተግባቦት), we nurture technically elite, culturally grounded leaders.",
    }),
    defineField({
      name: "culturalAnchoringImage",
      title: "Cultural Anchoring Background Image",
      type: "image",
      options: { hotspot: true },
    }),

    // Pedagogical & Curriculum Sections
    defineField({
      name: "pedagogicalTitle",
      title: "Pedagogical Section Title",
      type: "string",
      initialValue: "Peer Mentorship & Hands-On Engineering",
    }),
    defineField({
      name: "pedagogicalDescription",
      title: "Pedagogical Section Description",
      type: "text",
      rows: 3,
      initialValue:
        "Students learn full-stack development, AI model integration, hardware tinkering, and project management in real commercial client software labs.",
    }),
    defineField({
      name: "curriculumTitle",
      title: "Curriculum Section Title",
      type: "string",
      initialValue: "Complete Engineering & Leadership Curriculum",
    }),
    defineField({
      name: "curriculumDescription",
      title: "Curriculum Section Description",
      type: "text",
      rows: 3,
      initialValue:
        "From foundational computer science and web dev to advanced artificial intelligence and indigenous ethics.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page Copy & Settings" };
    },
  },
});
