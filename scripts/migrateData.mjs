import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("❌ Error: SANITY_WRITE_TOKEN is required for migration script.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: "2024-06-01",
});

// AUTHENTIC SHEGA GENERATION (ሸጋ ትውልድ) DATA payload
const SHEGA_SITE_SETTINGS = {
  _id: "siteSettings",
  _type: "siteSettings",
  heroTitle: "Shega Generation",
  heroCaption:
    "Sharing knowledge in kindness across generations — fusing software engineering and AI with Ethiopian heritage to empower future leaders.",
  heroCtaPrimary: "Apply for Summer Camp",
  heroCtaSecondary: "Partner & Sponsor",

  statementBannerTitle1: "Software & AI Labs",
  statementBannerTitle2: "Indigenous Wisdom & Erq",
  statementBannerTitle3: "Youth Leadership",

  culturalAnchoringSubtitle: "Rooted in Ethiopian Heritage & Character",
  culturalAnchoringDescription:
    "From ancient Ge'ez fundamentals and Ethiopian history to traditional dining etiquette (የማዕድ ስነ-ስርዓት) and positive communication (ፈገግታና አዎንታዊ ተግባቦት), we nurture technically elite, culturally grounded leaders.",

  pedagogicalTitle: "The Shega Summer Camp & Key Pillars",
  pedagogicalDescription:
    "A structured two-month seasonal program hosting up to 200 youth per batch, segmented into Creative Kids (Ages 7–10), Astute Teens (Ages 11–13), and Leader Youth (Ages 14–18).",

  curriculumTitle: "Core Flagship Curriculum & Age Cohorts",
  curriculumDescription:
    "Combining Scratch, HTML/CSS, Python, cybersecurity, and AI command engineering with Ge'ez, mineralogy, self-defense, Gebeta, and national field trips to INSA and the AI Institute.",

  journeysTitle: "Real-World Student Project Lab",
  journeysDescription:
    "Senior student developers execute commercial software contracts for external businesses—building production portfolio experience while earning money for their contributions.",

  testimonialsTitle: "Team Leadership & Student Voices",
  testimonialsDescription:
    "Founded by Samuel Geremew and led by Chief Coordinator Zemichael Tefera, alongside mentors Thomas Hailu, Hizkeal, Gebriel Kassahun, and our student developers.",

  communityTitle: "Strategic Institutional Partners",
};

const SHEGA_COURSES = [
  {
    _id: "course-1",
    _type: "course",
    title: "Creative Kids: Block Coding & Logic (Ages 7–10)",
    instructor: "Shega Generation",
    badgeCategory: "Tech Orientation",
    level: "Beginner • 8 Weeks (Summer Camp)",
    snippet:
      "Learning through play, basic computer science concepts, Scratch block coding, Minecraft logic, cooking games, and tales of kindness.",
    externalLmsUrl: "https://shegagenerations.org/contact",
    sequenceOrder: 1,
    rating: "5.0",
    enrolledCount: 200,
    tags: ["Scratch", "Minecraft", "Block Coding", "Tales of Kindness"],
  },
  {
    _id: "course-2",
    _type: "course",
    title: "Astute Teens: Web Development & Heritage (Ages 11–13)",
    instructor: "Shega Generation & Sophor Code Academy",
    badgeCategory: "Tech Orientation",
    level: "Intermediate • 8 Weeks (Summer Camp)",
    snippet:
      "Logical reasoning, HTML/CSS web coding, life skills, and constructing real web portals showcasing Ethiopian tourism and heritage sites.",
    externalLmsUrl: "https://shegagenerations.org/contact",
    sequenceOrder: 2,
    rating: "4.9",
    enrolledCount: 180,
    tags: ["HTML5", "CSS3", "Tourism Web Portals", "Life Skills"],
  },
  {
    _id: "course-3",
    _type: "course",
    title: "Leader Youth: Python, AI & Cybersecurity (Ages 14–18)",
    instructor: "Sophor Code Academy",
    badgeCategory: "Tech Orientation",
    level: "Advanced • 8 Weeks (Summer Camp)",
    snippet:
      "Advanced Python programming, web development, cybersecurity fundamentals, AI command engineering, entrepreneurship, and leadership.",
    externalLmsUrl: "https://shegagenerations.org/contact",
    sequenceOrder: 3,
    rating: "5.0",
    enrolledCount: 150,
    tags: ["Python", "AI Engineering", "Cybersecurity", "Full-Stack"],
  },
  {
    _id: "course-4",
    _type: "course",
    title: "Indigenous Knowledge, Ge'ez & History Secrets",
    instructor: "Shega Generation",
    badgeCategory: "Indigenous Knowledge",
    level: "All Ages • 8 Weeks",
    snippet:
      "Ancient Ge'ez fundamentals, Ethiopian history, engineering secrets behind historic landmarks, and traditional conflict resolution (Erq).",
    externalLmsUrl: "https://shegagenerations.org/contact",
    sequenceOrder: 4,
    rating: "5.0",
    enrolledCount: 200,
    tags: ["Ge'ez", "Ethiopian History", "Landmark Engineering", "Erq"],
  },
  {
    _id: "course-5",
    _type: "course",
    title: "Etiquette, Hospitality & Life Skills (የማዕድ ስነ-ስርዓት)",
    instructor: "Shega Generation & TTI Hospitality",
    badgeCategory: "Life Skills",
    level: "All Ages • 8 Weeks",
    snippet:
      "Practical instruction in የማዕድ ስነ-ስርዓት (Dining Etiquette), ፈገግታና አዎንታዊ ተግባቦት (Positive Communication) through interactive games, mineralogy, and public speaking.",
    externalLmsUrl: "https://shegagenerations.org/contact",
    sequenceOrder: 5,
    rating: "4.9",
    enrolledCount: 190,
    tags: ["የማዕድ ስነ-ስርዓት", "Dining Etiquette", "Communication", "Life Skills"],
  },
  {
    _id: "course-6",
    _type: "course",
    title: "Real-World Student Development Lab",
    instructor: "Shega Generation",
    badgeCategory: "Tech Orientation",
    level: "Senior Level • Year-Round",
    snippet:
      "Senior students execute external software development contracts for businesses—gaining portfolio experience while earning money for their contributions.",
    externalLmsUrl: "https://shegagenerations.org/contact",
    sequenceOrder: 6,
    rating: "5.0",
    enrolledCount: 45,
    tags: ["Commercial Contracts", "Client Builds", "Earn While Learning", "Software Lab"],
  },
];

const SHEGA_EVENTS = [
  {
    _id: "event-1",
    _type: "event",
    title: "Shega Summer Camp 2026 Batch Intake & Assessment",
    type: "Tech Training",
    slug: { _type: "slug", current: "shega-summer-camp-2026" },
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    location: "Tourism Training Institute (TTI) & Guenet Hotel Mexico, Addis Ababa",
    isUpcoming: true,
    registrationLink: "https://shegagenerations.org/contact",
  },
  {
    _id: "event-2",
    _type: "event",
    title: "INSA & Ethiopian Artificial Intelligence Institute Excursion",
    type: "Tour",
    slug: { _type: "slug", current: "insa-ai-institute-tour" },
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).toISOString(),
    location: "National AI Institute & INSA Headquarters, Addis Ababa",
    isUpcoming: true,
    registrationLink: "https://shegagenerations.org/contact",
  },
  {
    _id: "event-3",
    _type: "event",
    title: "'Sofor's Got Talent' & Gebeta Cultural Championship",
    type: "Charity",
    slug: { _type: "slug", current: "sofors-got-talent-gebeta" },
    eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    location: "Guenet Hotel Mexico, Addis Ababa",
    isUpcoming: false,
    registrationLink: "https://shegagenerations.org/events",
  },
  {
    _id: "event-4",
    _type: "event",
    title: "Managed Corporate AI & Digital Literacy Workshop",
    type: "Tech Training",
    slug: { _type: "slug", current: "corporate-ai-workshop" },
    eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    location: "Tourism Training Institute (TTI), Addis Ababa",
    isUpcoming: false,
    registrationLink: "https://shegagenerations.org/events",
  },
];

const SHEGA_PROJECTS = [
  {
    _id: "project-1",
    _type: "project",
    title: "Ethiopian Tourism Heritage Portal",
    creatorName: "Astute Teens Cohort (Led by Zemichael Tefera)",
    cohortLocation: "Addis Ababa Cohort",
    description:
      "Interactive web portal showcasing historic Ethiopian landmarks and cultural sites, built by 11-13 year old students during the Shega Summer Camp.",
    impactMetric: "25 Landmarks Featured • Built by Teens",
    category: "Astute Teens (Ages 11–13)",
    projectUrl: "https://shegagenerations.org/contact",
    quote: "Building real tourism portals gave our 12-year-old students confidence and pride in Ethiopian heritage.",
    techStack: ["HTML5", "CSS3", "JavaScript", "Tourism Data"],
  },
  {
    _id: "project-2",
    _type: "project",
    title: "Ge'ez AI Command & OCR Engine",
    creatorName: "Leader Youth AI Team (Led by Thomas Hailu & Samuel Geremew)",
    cohortLocation: "Addis Ababa Cohort",
    description:
      "Custom AI command engineering and optical character recognition model tailored for ancient Ge'ez manuscripts and Ethiopian linguistic datasets.",
    impactMetric: "AI Command Model • Ge'ez Script OCR",
    category: "Leader Youth (Ages 14–18)",
    projectUrl: "https://shegagenerations.org/contact",
    quote: "Our youth combined AI prompt engineering with Ethiopian indigenous script preservation.",
    techStack: ["Python", "PyTorch", "Ge'ez OCR", "AI Command"],
  },
  {
    _id: "project-3",
    _type: "project",
    title: "Commercial Client Build Contracts",
    creatorName: "Senior Student Developers",
    cohortLocation: "Shega Development Lab",
    description:
      "External software development contracts managed by Shega Generation for external businesses. Senior students execute commercial builds and earn money for their work.",
    impactMetric: "8 External Contracts • Student Paid Lab",
    category: "Student Project Lab",
    projectUrl: "https://shegagenerations.org/contact",
    quote: "Our student developers earn early financial independence while delivering quality software to client businesses.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL"],
  },
  {
    _id: "project-4",
    _type: "project",
    title: "Gebeta & Scratch Logic Engine",
    creatorName: "Creative Kids Cohort (Led by Hizkeal & Gebriel Kassahun)",
    cohortLocation: "TTI Hub, Addis Ababa",
    description:
      "Interactive block coding projects, Minecraft logic structures, and digital Gebeta matrix games created by 7 to 10 year old students.",
    impactMetric: "Traditional Gebeta • Block Coding Logic",
    category: "Creative Kids (Ages 7–10)",
    projectUrl: "https://shegagenerations.org/contact",
    quote: "Scratch logic and Gebeta patterns taught our youngest students that programming is creative play.",
    techStack: ["Scratch", "Block Coding", "Gebeta Math", "CSS Grids"],
  },
];

const SHEGA_TESTIMONIALS = [
  {
    _id: "testimonial-1",
    _type: "testimonial",
    quote:
      "Shega Generation was founded to shape a well-rounded Ethiopian youth demographic—combining cutting-edge software engineering and AI with deep cultural respect and character.",
    author: "Samuel Geremew",
    role: "Founder @ Shega Generation",
    track: "Leadership & Vision",
    location: "Addis Ababa",
  },
  {
    _id: "testimonial-2",
    _type: "testimonial",
    quote:
      "Our two-month summer camp hosts up to 200 students per batch. From Scratch block coding for 7-year-olds to Python, web dev, and AI for teens, every child has a structured pathway.",
    author: "Zemichael Tefera",
    role: "Chief Coordinator & Senior Instructor",
    track: "Summer Camp Operations & Web Architecture",
    location: "Addis Ababa",
  },
  {
    _id: "testimonial-3",
    _type: "testimonial",
    quote:
      "In Leader Youth (Ages 14–18), we dive into Python, web development, cybersecurity, and AI command engineering. Our students build real commercial software systems.",
    author: "Thomas Hailu",
    role: "Core Instructor & Mentor",
    track: "Leader Youth & Advanced Tech",
    location: "Addis Ababa",
  },
  {
    _id: "testimonial-4",
    _type: "testimonial",
    quote:
      "Teaching የማዕድ ስነ-ስርዓት (Dining Etiquette), positive communication (ፈገግታና አዎንታዊ ተግባቦት), and self-defense ensures our students grow into respectful, well-rounded leaders.",
    author: "Gebriel Kassahun",
    role: "Core Instructor & Life Skills Lead",
    track: "Hospitality & Life Skills",
    location: "Addis Ababa",
  },
  {
    _id: "testimonial-5",
    _type: "testimonial",
    quote:
      "Anchoring our youth in ancient Ge'ez fundamentals, Ethiopian history, and traditional conflict resolution (Erq) gives them deep pride in who they are as they master technology.",
    author: "Hizkeal",
    role: "Core Instructor & Mentor",
    track: "Indigenous Knowledge & Ge'ez",
    location: "Addis Ababa",
  },
];

const SHEGA_GALLERY = [
  {
    _id: "gallery-1",
    _type: "gallery",
    caption: "Field trip to INSA & Ethiopian Artificial Intelligence Institute",
    categoryTag: "Expeditions",
  },
  {
    _id: "gallery-2",
    _type: "gallery",
    caption: "Creative Kids (Ages 7–10) Scratch block coding session",
    categoryTag: "Classroom",
  },
  {
    _id: "gallery-3",
    _type: "gallery",
    caption: "Astute Teens (Ages 11–13) constructing Ethiopian tourism web portals",
    categoryTag: "Classroom",
  },
  {
    _id: "gallery-4",
    _type: "gallery",
    caption: "Leader Youth (Ages 14–18) AI command engineering & Python lab",
    categoryTag: "Hackathons",
  },
  {
    _id: "gallery-5",
    _type: "gallery",
    caption: "Hands-on የማዕድ ስነ-ስርዓት (Dining Etiquette) session at TTI",
    categoryTag: "Classroom",
  },
  {
    _id: "gallery-6",
    _type: "gallery",
    caption: "'Sofor's Got Talent' & Gebeta Championship at Guenet Hotel Mexico",
    categoryTag: "Volunteer-Work",
  },
];

async function migrate() {
  console.log("🚀 Starting Shega Generation dataset migration...");
  console.log(`Targeting project [${projectId}], dataset [${dataset}]...`);

  // Step 1: Clean out existing documents
  const targetTypes = ["siteSettings", "course", "event", "project", "testimonial", "gallery"];
  for (const type of targetTypes) {
    try {
      const existing = await client.fetch(`*[_type == "${type}"]._id`);
      if (existing.length > 0) {
        console.log(`🧹 Removing ${existing.length} existing document(s) of type [${type}]...`);
        for (const docId of existing) {
          await client.delete(docId);
        }
      }
    } catch (err) {
      console.warn(`Warning deleting ${type}:`, err.message);
    }
  }

  // Step 2: Create Site Settings
  console.log("📌 Creating Shega Generation Site Settings...");
  await client.createOrReplace(SHEGA_SITE_SETTINGS);

  // Step 3: Create Courses
  console.log("📌 Creating Courses...");
  for (const course of SHEGA_COURSES) {
    await client.createOrReplace(course);
  }

  // Step 4: Create Events
  console.log("📌 Creating Events...");
  for (const event of SHEGA_EVENTS) {
    await client.createOrReplace(event);
  }

  // Step 5: Create Projects
  console.log("📌 Creating Student Projects & Ventures...");
  for (const project of SHEGA_PROJECTS) {
    await client.createOrReplace(project);
  }

  // Step 6: Create Testimonials
  console.log("📌 Creating Testimonials & Team Quotes...");
  for (const testimonial of SHEGA_TESTIMONIALS) {
    await client.createOrReplace(testimonial);
  }

  // Step 7: Create Gallery Items
  console.log("📌 Creating Gallery Items...");
  for (const galleryItem of SHEGA_GALLERY) {
    await client.createOrReplace(galleryItem);
  }

  console.log("🎉 Shega Generation data migration completed successfully!");
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
