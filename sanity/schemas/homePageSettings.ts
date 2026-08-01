import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export default defineType({
  name: "homePageSettings",
  title: "Home Page Copy & Settings",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero Portal", default: true },
    { name: "statement", title: "Statement Banner" },
    { name: "cultural", title: "Cultural Anchoring" },
    { name: "pedagogical", title: "Pedagogical Section" },
    { name: "curriculum", title: "Curriculum Overview" },
    { name: "journeys", title: "Student Media Journeys" },
    { name: "testimonials", title: "Alumni Testimonials" },
    { name: "partners", title: "Partners Section" },
    { name: "community", title: "Social Community" },
  ],
  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Main Title / Organization Name",
      type: "string",
      group: "hero",
      initialValue: "Shega Generation",
    }),
    defineField({
      name: "heroCaption",
      title: "Hero Subtitle Caption",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue: "Sharing knowledge in kindness across generations — fusing software engineering and AI with Ethiopian heritage to empower future leaders.",
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "Primary Button CTA Label",
      type: "string",
      group: "hero",
      initialValue: "Apply for Summer Camp",
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "Secondary Button CTA Label",
      type: "string",
      group: "hero",
      initialValue: "Partner & Sponsor",
    }),
    defineField({
      name: "heroTitleBgImage",
      title: "Hero Title Mask Background Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),

    // Statement Banner
    defineField({
      name: "statementBannerTitle1",
      title: "Statement Line 1",
      type: "string",
      group: "statement",
      initialValue: "Software & AI Labs",
    }),
    defineField({
      name: "statementBannerTitle2",
      title: "Statement Line 2 (Outlined Text)",
      type: "string",
      group: "statement",
      initialValue: "Indigenous Wisdom & Erq",
    }),
    defineField({
      name: "statementBannerTitle3",
      title: "Statement Line 3",
      type: "string",
      group: "statement",
      initialValue: "Youth Leadership",
    }),
    defineField({
      name: "statementBannerImage",
      title: "Statement Parallax Background Image",
      type: "image",
      group: "statement",
      options: { hotspot: true },
    }),

    // Cultural Anchoring
    defineField({
      name: "culturalAnchoringSubtitle",
      title: "Cultural Anchoring Subtitle",
      type: "string",
      group: "cultural",
      initialValue: "Rooted in Ethiopian Heritage & Character",
    }),
    defineField({
      name: "culturalAnchoringDescription",
      title: "Cultural Anchoring Description",
      type: "text",
      rows: 4,
      group: "cultural",
      initialValue: "From ancient Ge'ez fundamentals and Ethiopian history to traditional dining etiquette (የማዕድ ስነ-ስርዓት) and positive communication (ፈገግታና አዎንታዊ ተግባቦት), we nurture technically elite, culturally grounded leaders.",
    }),
    defineField({
      name: "culturalAnchoringImage",
      title: "Cultural Anchoring Parallax Background Image",
      type: "image",
      group: "cultural",
      options: { hotspot: true },
    }),

    // Pedagogical Section
    defineField({
      name: "pedagogicalTitle",
      title: "Pedagogical Section Title",
      type: "string",
      group: "pedagogical",
      initialValue: "Peer Mentorship & Hands-On Engineering",
    }),
    defineField({
      name: "pedagogicalDescription",
      title: "Pedagogical Description",
      type: "text",
      rows: 3,
      group: "pedagogical",
      initialValue: "Students learn full-stack development, AI model integration, hardware tinkering, and project management in real commercial client software labs.",
    }),

    // Curriculum Section
    defineField({
      name: "curriculumTitle",
      title: "Curriculum Title",
      type: "string",
      group: "curriculum",
      initialValue: "Complete Engineering & Leadership Curriculum",
    }),
    defineField({
      name: "curriculumDescription",
      title: "Curriculum Description",
      type: "text",
      rows: 3,
      group: "curriculum",
      initialValue: "From foundational computer science and web dev to advanced artificial intelligence and indigenous ethics.",
    }),

    // Journeys Section
    defineField({
      name: "journeysKicker",
      title: "Journeys Section Kicker Tag",
      type: "string",
      group: "journeys",
      initialValue: "Student Media Coverage & Achievements",
    }),
    defineField({
      name: "journeysTitle",
      title: "Journeys Section Title",
      type: "string",
      group: "journeys",
      initialValue: "Student Interviews & Media Features",
    }),
    defineField({
      name: "journeysDescription",
      title: "Journeys Section Description",
      type: "text",
      rows: 3,
      group: "journeys",
      initialValue: "Radio interviews, podcast features, Facebook broadcasts, and software projects executed by Shega Generation students.",
    }),

    // Testimonials Section
    defineField({
      name: "testimonialsTitle",
      title: "Testimonials Section Title",
      type: "string",
      group: "testimonials",
      initialValue: "Voices of the Generation",
    }),
    defineField({
      name: "testimonialsDescription",
      title: "Testimonials Section Description",
      type: "text",
      rows: 3,
      group: "testimonials",
      initialValue: "Hear from our students, alumni, and community mentors about their transformational journey at Shega Generations.",
    }),

    // Partners Section
    defineField({
      name: "partnersKicker",
      title: "Partners Section Kicker Tag",
      type: "string",
      group: "partners",
      initialValue: "Our clients / partners",
    }),
    defineField({
      name: "partnersHeadline",
      title: "Partners Section Title",
      type: "string",
      group: "partners",
      initialValue: "Pleasure to work with",
    }),
    defineField({
      name: "partnersDescription",
      title: "Partners Section Description",
      type: "text",
      rows: 3,
      group: "partners",
      initialValue: "Shega Generation collaborates with Ethiopia's premier educational academies, hospitality centers, media houses, and venue operators across Addis Ababa.",
    }),

    // Community Section
    defineField({
      name: "communityKicker",
      title: "Community Section Kicker Tag",
      type: "string",
      group: "community",
      initialValue: "Community",
    }),
    defineField({
      name: "communityTitle",
      title: "Community Section Title",
      type: "string",
      group: "community",
      initialValue: "Follow the day to day",
    }),
    defineField({
      name: "communityDescription",
      title: "Community Section Description",
      type: "text",
      rows: 2,
      group: "community",
      initialValue: "Stay connected with our daily student builds, summer camp moments, and community updates.",
    }),
    defineField({
      name: "socialFacebookHandle",
      title: "Facebook Handle / Name",
      type: "string",
      group: "community",
      initialValue: "Shega Community Group",
    }),
    defineField({
      name: "socialFacebookUrl",
      title: "Facebook Link URL",
      type: "url",
      group: "community",
      initialValue: "https://web.facebook.com/share/g/18foDKzcBS/",
    }),
    defineField({
      name: "socialTelegramHandle",
      title: "Telegram Handle / Link",
      type: "string",
      group: "community",
      initialValue: "t.me/shegagenerations",
    }),
    defineField({
      name: "socialTelegramUrl",
      title: "Telegram Link URL",
      type: "url",
      group: "community",
      initialValue: "https://t.me/shegagenerations",
    }),
    defineField({
      name: "socialTikTokHandle",
      title: "TikTok Handle / Link",
      type: "string",
      group: "community",
      initialValue: "@samuelgeremew_21",
    }),
    defineField({
      name: "socialTikTokUrl",
      title: "TikTok Link URL",
      type: "url",
      group: "community",
      initialValue: "https://www.tiktok.com/@samuelgeremew_21",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page Copy & Settings" };
    },
  },
});
