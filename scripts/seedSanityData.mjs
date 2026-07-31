import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// Simple .env parser using Node fs
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

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Shega Generations",
  siteTagline: "Nurturing Tech Geniuses & Indigenous Leadership in Ethiopia",
  themePreset: "orange-navy",
  primaryColor: "#EA580C",
  secondaryColor: "#0A192F",
  accentColor: "#EA580C",
  colorPreset: "orange-navy",

  // Hero Section
  heroTitle: "Shega Generations",
  heroCaption: "Free high-tier software engineering, AI, indigenous Ethiopian history, and character training for talented youth.",
  heroCtaPrimary: "Join the Generation",
  heroCtaSecondary: "Support the Mission",

  // Statement Banner Section
  statementBannerTitle1: "NURTURING TECH GENIUSES",
  statementBannerTitle2: "FOR ETHIOPIA & AFRICA",
  statementBannerTitle3: "FREE COHORT TRAINING & MENTORSHIP",

  // Cultural Anchoring Section
  culturalAnchoringSubtitle: "Rooted in Indigenous Excellence",
  culturalAnchoringDescription: "We combine modern computer science with Ge'ez linguistic logic, Ethiopian history, and hospitality character development.",

  // Pedagogical Section
  pedagogicalTitle: "Peer Mentorship & Hands-On Engineering",
  pedagogicalDescription: "Students learn full-stack development, AI model integration, hardware tinkering, and project management in real commercial client software labs.",

  // Curriculum Section
  curriculumTitle: "Complete Engineering & Leadership Curriculum",
  curriculumDescription: "From foundational computer science and web dev to advanced artificial intelligence and indigenous ethics.",

  // Journeys Section
  journeysKicker: "Student Media Coverage & Achievements",
  journeysTitle: "Student Interviews & Media Features",
  journeysDescription: "Radio interviews, podcast features, Facebook broadcasts, and software projects executed by Shega Generation students.",
  journeysCategories: ["Podcasts", "Radio Programs", "Programs", "Interviews"],

  // Testimonials Section
  testimonialsTitle: "Voices of the Generation",
  testimonialsDescription: "Hear from our students, alumni, and community mentors about their transformational journey at Shega Generations.",

  // Events Section
  eventsSectionKicker: "The nearest gathering",
  eventsSectionTitle: "Upcoming Gathering & Workshops",
  eventsPageTitlePhrases: [
    "Where the generation gathers.",
    "የትውልዱ መገናኛ",
    "UPCOMING CTFs & WORKSHOPS",
  ],
  eventsPageSubtitle: "Active, incoming and historic meetups from CTFs in Addis to Simien treks.",
  eventsCategories: ["CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity"],

  // Gallery Section
  galleryPageTitlePhrases: [
    "The weave, in pictures.",
    "በስዕሎች የተሸመነው",
    "STUDENT COHORTS & EXPEDITIONS",
  ],
  galleryPageSubtitle: "Expeditions, hackathons, classrooms, and volunteer work across Ethiopia.",
  galleryCategories: ["Expeditions", "Hackathons", "Classroom", "Volunteer-Work"],

  // Contact Section
  contactPageTitlePhrases: [
    "Get in touch, with Shega.",
    "ከሸጋ ጋር, ይገናኙ",
    "PARTNERSHIPS & INQUIRIES",
  ],
  contactPageSubtitle: "Reach out to our leadership team for general inquiries, partnerships, sponsorships, media features, or donations.",

  // Partners Section
  partnersKicker: "Our clients / partners",
  partnersHeadline: "Pleasure to work with",
  partnersDescription: "Shega Generation collaborates with Ethiopia's premier educational academies, hospitality centers, media houses, and venue operators across Addis Ababa.",

  // Community Section
  communityKicker: "Community",
  communityTitle: "Follow the day to day",
  communityDescription: "Stay connected with our daily student builds, summer camp moments, and community updates.",
  socialFacebookHandle: "Shega Community Group",
  socialFacebookUrl: "https://web.facebook.com/share/g/18foDKzcBS/",
  socialTelegramHandle: "t.me/shegagenerations",
  socialTelegramUrl: "https://t.me/shegagenerations",
  socialTikTokHandle: "@samuelgeremew_21",
  socialTikTokUrl: "https://www.tiktok.com/@samuelgeremew_21",

  // About Us Page Section
  aboutPageTitlePhrases: [
    "እኛ ማን ነን",
    "ABOUT SHEGA GENERATIONS",
    "OUR ORIGIN STORY",
    "OUR MISSION & VISION",
  ],
  aboutPageSubtitle:
    "Shega Generations (ሽጋ ትውልድ) is a pioneering non-profit educational movement dedicated to providing free, high-tier software engineering, AI technology, indigenous Ethiopian history, and hospitality character training to talented youth across Ethiopia.",
  aboutCampusVisionText:
    "Our ultimate goal is building our own dedicated 24/7 innovation campus in Addis Ababa—equipped with overnight coding laboratories, hardware workshops, incubation spaces, rest facilities, and multi-tier cohort capacity reachable from every corner of Ethiopia.",
};

const storyMilestones = [
  {
    _id: "story-milestone-1",
    _type: "storyMilestone",
    stepNumber: 1,
    year: "2021",
    title: "The Coffee House Genesis (Weyn Coffee)",
    location: "Weyn Coffee House, Addis Ababa",
    description:
      "Founder Samuel Geremew—higher education university lecturer, Ambassador for MaryJoy NGO, and CEO of Samilos Media—launched Shega Generation under the motto 'Share our knowledge in kindness.' Gathering a few bright children from different neighborhoods, he began teaching university-level computer science concepts inside his sister Weyn's traditional coffee house on small wooden stools on Sunday mornings.",
    quote:
      "We started on small wooden stools in my sister Weyn's coffee shop. We had no fancy labs, but we had unlimited curiosity and a spirit of kindness.",
    highlights: [
      "Sister Weyn's Traditional Coffee House",
      "Sunday Morning Sessions",
      "University-Level Concepts for Kids",
      "Small Wooden Stools",
    ],
  },
  {
    _id: "story-milestone-2",
    _type: "storyMilestone",
    stepNumber: 2,
    year: "2022",
    title: "Peer Mentorship & Organic Expansion",
    location: "Weyn Coffee House, Addis Ababa",
    description:
      "Word spread quickly across the community. The young kids caught on so fast that early cohort members naturally transformed into mentors for new joiners. Sunday morning sessions expanded to full capacity as students began building basic web pages and solving mathematical logic puzzles.",
    quote:
      "The magic happened when 10-year-olds who learned Scratch and Ge'ez counting the year before started teaching the new 7-year-olds.",
    highlights: [
      "Peer-to-Peer Mentorship Model",
      "Expanding Sunday Cohorts",
      "Logic & Web Fundamentals",
    ],
  },
  {
    _id: "story-milestone-3",
    _type: "storyMilestone",
    stepNumber: 3,
    year: "2023",
    title: "1st Summer Camp at Guenet Hotel",
    location: "Guenet Hotel Mexico, Addis Ababa",
    description:
      "Due to personal circumstances, Weyn Coffee House was forced to close. Refusing to let the movement end, Samuel initiated strategic discussions with the Tourism Training Institute (TTI). Gracious leadership at TTI offered venue space at Guenet Hotel, launching the historic 1st Shega Generation Summer Camp.",
    quote:
      "When the coffee house closed, I refused to let our kids' dreams stop. TTI stepped up and opened the doors of Guenet Hotel.",
    highlights: [
      "1st Official Summer Camp",
      "Strategic TTI Partnership",
      "Guenet Hotel Venue",
      "Overcoming Adversity",
    ],
  },
  {
    _id: "story-milestone-4",
    _type: "storyMilestone",
    stepNumber: 4,
    year: "2024",
    title: "2nd Summer Camp (Guenet Hotel & TTI Campus)",
    location: "TTI Main Campus & Guenet Hotel",
    description:
      "The 2nd Summer Camp scaled significantly across both Guenet Hotel and the main TTI institute campus. TTI leadership and staff enrolled their own children into Shega Generation, forging a deep institutional bond and adding structured hospitality etiquette into the curriculum.",
    quote:
      "When staff at TTI enrolled their own children into our classes, we knew we were building something truly special.",
    highlights: [
      "2nd Summer Camp",
      "Dual Campus Expansion",
      "TTI Staff Children Enrolled",
      "Hospitality Etiquette Introduced",
    ],
  },
  {
    _id: "story-milestone-5",
    _type: "storyMilestone",
    stepNumber: 5,
    year: "2025",
    title: "3rd Summer Camp at TTI (Computer Labs Unlocked)",
    location: "TTI Computer Laboratories",
    description:
      "TTI officially unlocked state-of-the-art computer laboratories for Shega Generation students. Kids practiced Python programming, AI command engineering, and full-stack web development hands-on on high-performance desktop workstations.",
    quote:
      "Moving from wooden stools to full-fledged computer laboratories gave our students the exact tools needed to build real-world software.",
    highlights: [
      "3rd Summer Camp",
      "Dedicated TTI Computer Labs",
      "Hands-on Python & AI Engineering",
      "TTI Institutional Commitment",
    ],
  },
  {
    _id: "story-milestone-6",
    _type: "storyMilestone",
    stepNumber: 6,
    year: "2026",
    title: "Smart Classrooms & Commercial Student Software Lab",
    location: "TTI Smart Classrooms & National Media Outlets",
    description:
      "Today, Shega Generation operates active cohorts inside TTI smart classrooms and computer labs. Senior students run a Commercial Software Lab executing paid client software builds, while national broadcasts on Fana FM and Samilos Media showcase youth innovations.",
    quote:
      "Our students aren't just learning—they are executing commercial client contracts and broadcasting their projects nationally.",
    highlights: [
      "Active TTI Smart Classrooms",
      "Commercial Student Software Lab",
      "National Radio & TV Broadcasts",
      "500+ Alumni Network",
    ],
  },
  {
    _id: "story-milestone-7",
    _type: "storyMilestone",
    stepNumber: 7,
    year: "The Horizon",
    title: "The Shega Innovation Campus & Nationwide Reach",
    location: "Permanent 24/7 Innovation Campus, Ethiopia",
    description:
      "The ultimate vision: Building a dedicated, permanent 24/7 Shega Innovation Campus in Addis Ababa—equipped with overnight coding labs, startup incubation facilities, rest spaces, hardware workshops, and multi-tier cohort capacity reachable from every corner of Ethiopia.",
    quote:
      "A safe, fear-free sanctuary where Ethiopia's brightest minds can practice overnight, build startups, and solve real-world problems.",
    highlights: [
      "24/7 Dedicated Innovation Campus",
      "Overnight Practice Labs & Rest Facilities",
      "Startup Incubation Center",
      "Nationwide Regional Cohorts",
    ],
  },
];

const teamMembers = [
  {
    _id: "team-member-1",
    _type: "teamMember",
    name: "Samuel Geremew",
    role: "Founder & Executive Director",
    department: "leadership",
    bio: "Higher education university lecturer, Ambassador for MaryJoy NGO, and Founder & CEO of Samilos Media and Communication. Samuel founded Shega Generation in 2021 inside his sister Weyn's coffee house to provide free university-level software engineering, AI, and indigenous character education to talented youth.",
    quote:
      "Share our knowledge in kindness. When you empower a child with technology and character, you transform an entire generation.",
    organizationAffiliations: [
      "Higher Education Lecturer",
      "MaryJoy NGO Ambassador",
      "CEO Samilos Media",
      "Media Host & Producer",
    ],
    socialLinks: {
      tiktok: "https://www.tiktok.com/@samuelgeremew_21",
      facebook: "https://web.facebook.com/share/g/18foDKzcBS/",
      email: "samuel@shegagenerations.org",
    },
    order: 1,
  },
  {
    _id: "team-member-2",
    _type: "teamMember",
    name: "Dawit Kassaye",
    role: "Senior AI & Full-Stack Mentor",
    department: "tech",
    bio: "Senior software engineer specializing in Next.js, Python, and AI prompt engineering. Leads the Leader Youth (Ages 14-18) tracks and manages the Commercial Student Software Lab.",
    quote:
      "Our students don't just write code—they build commercial software that businesses rely on.",
    organizationAffiliations: ["Full-Stack Engineer", "Commercial Lab Lead"],
    socialLinks: {
      email: "dawit@shegagenerations.org",
    },
    order: 2,
  },
  {
    _id: "team-member-3",
    _type: "teamMember",
    name: "Bethlehem Tadesse",
    role: "Director of Hospitality & Character Etiquette",
    department: "cultural",
    bio: "Tourism Training Institute (TTI) partner liaison leading the የማዕድ ስነ-ስርዓት (Dining Etiquette) and ፈገግታና አዎንታዊ ተግባቦት (Positive Communication) modules across summer camps.",
    quote:
      "Etiquette and warmth are the bedrock of Ethiopian culture. Tech skills paired with character create true leaders.",
    organizationAffiliations: ["TTI Hospitality Consultant", "Character Advisor"],
    socialLinks: {
      email: "bethlehem@shegagenerations.org",
    },
    order: 3,
  },
  {
    _id: "team-member-4",
    _type: "teamMember",
    name: "Yonas Bekele",
    role: "Robotics & Hardware Lab Instructor",
    department: "tech",
    bio: "Sofor Code Academy robotics lead specializing in Arduino, Raspberry Pi, and interactive physics labs for Astute Teens.",
    quote:
      "Watching kids wire their first autonomous robot and explain the physics behind it is priceless.",
    organizationAffiliations: ["Sofor Code Academy Partner", "Robotics Lead"],
    socialLinks: {
      email: "yonas@shegagenerations.org",
    },
    order: 4,
  },
  {
    _id: "team-member-5",
    _type: "teamMember",
    name: "Selamawit Abrha",
    role: "Indigenous History & Ge'ez Studies Advisor",
    department: "cultural",
    bio: "Ethiopian history scholar guiding Ge'ez numeral systems, traditional architectural engineering secrets, and Erq conflict resolution.",
    quote:
      "When students realize Ethiopia's rich mathematical and engineering legacy, their confidence skyrockets.",
    organizationAffiliations: ["Heritage Scholar", "Ge'ez Specialist"],
    socialLinks: {
      email: "selamawit@shegagenerations.org",
    },
    order: 5,
  },
  {
    _id: "team-member-6",
    _type: "teamMember",
    name: "Kaleb Tesfaye",
    role: "Senior Peer Mentor & Student Council Lead",
    department: "student-mentors",
    bio: "One of the original student cohort members from 2021 who started at Weyn Coffee Shop. Now a university computer science student and lead peer mentor for Creative Kids.",
    quote:
      "I started on a wooden stool at Weyn Coffee. Now I mentor 60+ younger kids every summer.",
    organizationAffiliations: ["Alumni Class of 2021", "Student Council Lead"],
    socialLinks: {
      email: "kaleb@shegagenerations.org",
    },
    order: 6,
  },
];

async function seed() {
  console.log("🚀 Starting Sanity CMS Data Seeding...");
  console.log(`Project ID: ${projectId}, Dataset: ${dataset}`);

  try {
    // 1. Site Settings
    console.log("Seeding Global Site Settings...");
    await client.createOrReplace(siteSettings);

    // 2. Story Milestones
    console.log("Seeding Story Milestones...");
    for (const milestone of storyMilestones) {
      await client.createOrReplace(milestone);
      console.log(`  ✓ Milestone: ${milestone.year} - ${milestone.title}`);
    }

    // 3. Team Members
    console.log("Seeding Team Members...");
    for (const member of teamMembers) {
      await client.createOrReplace(member);
      console.log(`  ✓ Team Member: ${member.name}`);
    }

    console.log("✅ Sanity CMS Data Seeding Completed Successfully!");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}

seed();
