import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join("=").trim();
        }
      }
    });
  }
} catch (e) {
  console.warn("Could not load .env file manually:", e);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-06-01",
  useCdn: false,
});

async function populateFields() {
  console.log("🚀 Populating all CMS siteSettings fields with rich defaults...");

  const patchData = {
    siteName: "Shega Generations",
    siteTagline: "Nurturing Tech Geniuses & Indigenous Leadership in Ethiopia",
    themePreset: "orange-navy",
    primaryColor: "#EA580C",
    secondaryColor: "#0A192F",
    accentColor: "#EA580C",
    colorPreset: "orange-navy",

    // Hero Section
    heroTitle: "Shega Generation",
    heroCaption: "Free high-tier software engineering, AI, indigenous Ethiopian history, and character training for talented youth.",
    heroCtaPrimary: "Join the Generation",
    heroCtaSecondary: "Support the Mission",

    // Statement Banner
    statementBannerTitle1: "SOFTWARE & AI LABS",
    statementBannerTitle2: "INDIGENOUS WISDOM & ERQ",
    statementBannerTitle3: "YOUTH LEADERSHIP",

    // Cultural Anchoring
    culturalAnchoringSubtitle: "Rooted in Ethiopian Heritage & Character",
    culturalAnchoringDescription: "From ancient Ge'ez fundamentals and Ethiopian history to traditional dining etiquette (የማዕድ ስነ-ስርዓት) and positive communication (ፈገግታና አዎንታዊ ተግባቦት), we nurture technically elite, culturally grounded leaders.",

    // Pedagogical
    pedagogicalTitle: "Peer Mentorship & Hands-On Engineering",
    pedagogicalDescription: "Students learn full-stack development, AI model integration, hardware tinkering, and project management in real commercial client software labs.",

    // Curriculum
    curriculumTitle: "Complete Engineering & Leadership Curriculum",
    curriculumDescription: "From foundational computer science and web dev to advanced artificial intelligence and indigenous ethics.",

    // Journeys
    journeysKicker: "Student Media Coverage & Achievements",
    journeysTitle: "Student Interviews & Media Features",
    journeysDescription: "Radio interviews, podcast features, Facebook broadcasts, and software projects executed by Shega Generation students.",
    journeysCategories: ["Podcasts", "Radio Programs", "Programs", "Interviews"],

    // Testimonials
    testimonialsTitle: "Voices of the Generation",
    testimonialsDescription: "Hear from our students, alumni, and community mentors about their transformational journey at Shega Generations.",

    // Events Page & Gatherings
    eventsSectionKicker: "The nearest gathering",
    eventsSectionTitle: "Upcoming Gathering & Workshops",
    eventsPageTitlePhrases: ["Where the generation gathers.", "የትውልዱ መገናኛ", "UPCOMING CTFs & WORKSHOPS"],
    eventsPageSubtitle: "Active, incoming and historic meetups from CTFs in Addis to Simien treks.",
    eventsCategories: ["CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity"],

    // Gallery Page
    galleryPageTitlePhrases: ["The weave, in pictures.", "በስዕሎች የተሸመነው", "STUDENT COHORTS & EXPEDITIONS"],
    galleryPageSubtitle: "Expeditions, hackathons, classrooms, and volunteer work across Ethiopia.",
    galleryCategories: ["Expeditions", "Hackathons", "Classroom", "Volunteer-Work"],

    // Contact Page
    contactPageTitlePhrases: ["Get in touch, with Shega.", "ከሸጋ ጋር, ይገናኙ", "PARTNERSHIPS & INQUIRIES"],
    contactPageSubtitle: "Reach out to our leadership team for general inquiries, partnerships, sponsorships, media features, or donations.",

    // Partners
    partnersKicker: "Our clients / partners",
    partnersHeadline: "Pleasure to work with",
    partnersDescription: "Shega Generation collaborates with Ethiopia's premier educational academies, hospitality centers, media houses, and venue operators across Addis Ababa.",

    // Community
    communityKicker: "Community",
    communityTitle: "Follow the day to day",
    communityDescription: "Stay connected with our daily student builds, summer camp moments, and community updates.",
    socialFacebookHandle: "Shega Community Group",
    socialFacebookUrl: "https://web.facebook.com/share/g/18foDKzcBS/",
    socialTelegramHandle: "t.me/shegagenerations",
    socialTelegramUrl: "https://t.me/shegagenerations",
    socialTikTokHandle: "@samuelgeremew_21",
    socialTikTokUrl: "https://www.tiktok.com/@samuelgeremew_21",

    // About Us Page Copy
    aboutHeroKicker: "OUR MISSION & ORIGIN STORY",
    aboutPageTitlePhrases: [
      "እኛ ማን ነን",
      "ABOUT SHEGA GENERATIONS",
      "OUR ORIGIN STORY",
      "OUR MISSION & VISION",
    ],
    aboutPageSubtitle: "Shega Generations (ሸጋ ትውልድ) is a pioneering non-profit educational movement dedicated to providing free, high-tier software engineering, AI technology, indigenous Ethiopian history, and hospitality character training to talented youth across Ethiopia.",
    aboutHeroStats: [
      { _key: "stat_box_1", value: "500+", label: "Talented Geniuses Trained" },
      { _key: "stat_box_2", value: "100% Free", label: "Tuition Cost to Students" },
      { _key: "stat_box_3", value: "12+", label: "Summer & Annual Cohorts" },
      { _key: "stat_box_4", value: "15+", label: "Institutional Partners" },
    ],
    aboutPillarsTitle: "Our 4 Pillars of Holistic Education",
    aboutPillarsSubtitle: "Combining elite computational software engineering with indigenous Ethiopian heritage, dining etiquette, and youth peer mentorship.",
    aboutCampusVisionTitle: "Building the Permanent Shega Innovation Campus",
    aboutCampusVisionText: "Our ultimate goal is building our own dedicated 24/7 innovation campus in Addis Ababa—equipped with overnight coding laboratories, hardware workshops, incubation spaces, rest facilities, and multi-tier cohort capacity reachable from every corner of Ethiopia.",
    orgStructureTitle: "Role & Responsibilities Breakdown",
    orgStructureSubtitle: "Draft organizational breakdown & governance framework for Shega Generation.",
  };

  // Create or patch siteSettings document
  await client.createIfNotExists({ _id: "siteSettings", _type: "siteSettings" });
  await client.patch("siteSettings").set(patchData).commit();

  console.log("✅ CMS siteSettings document successfully populated with rich default content!");
}

populateFields().catch((err) => {
  console.error("❌ Error populating fields:", err);
  process.exit(1);
});
