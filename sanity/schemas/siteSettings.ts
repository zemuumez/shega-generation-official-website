import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export default defineType({
  name: "siteSettings",
  title: "Site Settings & Page Copy",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "theme", title: "Theme & Brand Colors", default: true },
    { name: "hero", title: "Hero Section" },
    { name: "statement", title: "Statement Banner" },
    { name: "cultural", title: "Cultural Anchoring" },
    { name: "pedagogical", title: "Pedagogical Section" },
    { name: "curriculum", title: "Curriculum Section" },
    { name: "journeys", title: "Journeys Section" },
    { name: "testimonials", title: "Testimonials Section" },
    { name: "events", title: "Nearest Gathering Section" },
    { name: "gallery", title: "Gallery Page" },
    { name: "contact", title: "Contact Page" },
    // About Us Page Group
    { name: "about", title: "About Us Page" },
    { name: "partners", title: "Partners Section" },
    { name: "community", title: "Community Section" },
  ],
  fields: [
    // Theme & Brand Colors
    defineField({
      name: "themePreset",
      title: "Color Theme Preset",
      description: "Select a curated color palette preset, or choose 'Custom Colors' to define custom hex codes below.",
      type: "string",
      group: "theme",
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
      name: "customPrimaryColor",
      title: "Custom Main / Accent Color (Hex)",
      description: "e.g. #EA580C - Used for main buttons, highlights, brand logo mark",
      type: "string",
      group: "theme",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
    defineField({
      name: "customPrimaryLightColor",
      title: "Custom Light Accent Color (Hex)",
      description: "e.g. #F97316 - Used for active rings, hover states",
      type: "string",
      group: "theme",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
    defineField({
      name: "customPrimaryDarkColor",
      title: "Custom Dark Accent Color (Hex)",
      description: "e.g. #C2410C - Used for button hover states",
      type: "string",
      group: "theme",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
    defineField({
      name: "customSecondaryColor",
      title: "Custom Secondary / Navy Color (Hex)",
      description: "e.g. #0A192F - Used for secondary logo text, deep contrast elements",
      type: "string",
      group: "theme",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
    defineField({
      name: "customSecondaryLightColor",
      title: "Custom Secondary Light Color (Hex)",
      description: "e.g. #1E293B",
      type: "string",
      group: "theme",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
    defineField({
      name: "customBgColor",
      title: "Custom Page Background Color (Hex)",
      description: "e.g. #F4F3EE",
      type: "string",
      group: "theme",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
    defineField({
      name: "customTextColor",
      title: "Custom Text Color (Hex)",
      description: "e.g. #1C1E1B",
      type: "string",
      group: "theme",
      hidden: ({ parent }) => parent?.themePreset !== "custom",
    }),
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
    // Journeys / Media Coverage Section
    defineField({
      name: "journeysKicker",
      title: "Media Coverage & Projects Section Kicker Tag",
      type: "string",
      initialValue: "Student Media Coverage & Achievements",
      group: "journeys",
    }),
    defineField({
      name: "journeysTitle",
      title: "Media Coverage Section Title",
      type: "string",
      initialValue: "Student Interviews & Media Features",
      group: "journeys",
    }),
    defineField({
      name: "journeysDescription",
      title: "Media Coverage Section Description",
      type: "text",
      rows: 3,
      initialValue: "Radio interviews, podcast features, Facebook broadcasts, and software projects executed by Shega Generation students.",
      group: "journeys",
    }),
    defineField({
      name: "journeysCategories",
      title: "Media Filter Categories",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Podcasts", "Radio Programs", "Programs", "Interviews"],
      description: "Custom categories for media section filter pills (e.g. Podcasts, Radio Programs, Programs, Interviews)",
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

    // Nearest Gathering / Events Directory Section
    defineField({
      name: "eventsSectionKicker",
      title: "Nearest Gathering Section Kicker Tag",
      type: "string",
      initialValue: "The nearest gathering",
      group: "events",
    }),
    defineField({
      name: "eventsSectionTitle",
      title: "Nearest Gathering Section Title",
      type: "string",
      initialValue: "Upcoming Gathering & Workshops",
      group: "events",
    }),
    defineField({
      name: "eventsPageTitlePhrases",
      title: "Events Page Typewriter Title Phrases",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Where the generation gathers.", "የትውልዱ መገናኛ"],
      group: "events",
    }),
    defineField({
      name: "eventsPageSubtitle",
      title: "Events Page Subtitle Description",
      type: "text",
      rows: 2,
      initialValue: "Active, incoming and historic meetups from CTFs in Addis to Simien treks.",
      group: "events",
    }),
    defineField({
      name: "eventsCategories",
      title: "Events Filter Categories",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity"],
      group: "events",
    }),

    // Gallery Page Settings
    defineField({
      name: "galleryPageTitlePhrases",
      title: "Gallery Page Typewriter Title Phrases",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["The weave, in pictures.", "በስዕሎች የተሸመነው"],
      group: "gallery",
    }),
    defineField({
      name: "galleryPageSubtitle",
      title: "Gallery Page Subtitle Description",
      type: "text",
      rows: 2,
      initialValue: "Expeditions, hackathons, classrooms, and volunteer work across Ethiopia.",
      group: "gallery",
    }),
    defineField({
      name: "galleryCategories",
      title: "Gallery Filter Categories",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Expeditions", "Hackathons", "Classroom", "Volunteer-Work"],
      group: "gallery",
    }),

    // Contact Page Settings
    defineField({
      name: "contactPageTitlePhrases",
      title: "Contact Page Typewriter Title Phrases",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Get in touch, with Shega.", "ከሸጋ ጋር, ይገናኙ"],
      group: "contact",
    }),
    defineField({
      name: "contactPageSubtitle",
      title: "Contact Page Subtitle Description",
      type: "text",
      rows: 2,
      initialValue: "Reach out to our leadership team for general inquiries, partnerships, sponsorships, media features, or donations.",
      group: "contact",
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
      name: "communityKicker",
      title: "Community Section Kicker Tag",
      type: "string",
      initialValue: "Community",
      group: "community",
    }),
    defineField({
      name: "communityTitle",
      title: "Community Section Title",
      type: "string",
      initialValue: "Follow the day to day",
      group: "community",
    }),
    defineField({
      name: "communityDescription",
      title: "Community Section Description",
      type: "text",
      rows: 2,
      initialValue: "Stay connected with our daily student builds, summer camp moments, and community updates.",
      group: "community",
    }),
    defineField({
      name: "socialFacebookHandle",
      title: "Facebook Handle / Name",
      type: "string",
      initialValue: "Shega Community Group",
      group: "community",
    }),
    defineField({
      name: "socialFacebookUrl",
      title: "Facebook Link URL",
      type: "url",
      initialValue: "https://web.facebook.com/share/g/18foDKzcBS/",
      group: "community",
    }),
    defineField({
      name: "socialTelegramHandle",
      title: "Telegram Handle / Link",
      type: "string",
      initialValue: "t.me/shegagenerations",
      group: "community",
    }),
    defineField({
      name: "socialTelegramUrl",
      title: "Telegram Link URL",
      type: "url",
      initialValue: "https://t.me/shegagenerations",
      group: "community",
    }),
    defineField({
      name: "socialTikTokHandle",
      title: "TikTok Handle / Link",
      type: "string",
      initialValue: "@samuelgeremew_21",
      group: "community",
    }),
    defineField({
      name: "socialTikTokUrl",
      title: "TikTok Link URL",
      type: "url",
      initialValue: "https://www.tiktok.com/@samuelgeremew_21",
      group: "community",
    }),

    // About Us Page Copy
    defineField({
      name: "aboutPageTitlePhrases",
      title: "About Page Title Phrases (Typewriter)",
      type: "array",
      of: [{ type: "string" }],
      group: "about",
    }),
    defineField({
      name: "aboutPageSubtitle",
      title: "About Page Subtitle",
      type: "text",
      rows: 3,
      group: "about",
    }),
    defineField({
      name: "aboutCampusVisionText",
      title: "Shega Innovation Campus Vision Text",
      type: "text",
      rows: 4,
      group: "about",
    }),
  ],
  preview: {
    select: { title: "heroTitle" },
    prepare({ title }) {
      return { title: title || "Site Settings & Page Copy" };
    },
  },
});
