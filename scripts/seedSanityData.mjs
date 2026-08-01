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
};

const aboutPageSettingsObj = {
  _id: "aboutPageSettings",
  _type: "aboutPageSettings",
  aboutHeroKicker: "OUR MISSION & ORIGIN STORY",
  aboutPageTitlePhrases: [
    "እኛ ማን ነን",
    "ABOUT SHEGA GENERATIONS",
    "OUR ORIGIN STORY",
    "OUR MISSION & VISION",
  ],
  aboutPageSubtitle:
    "Shega Generations (ሸጋ ትውልድ) is a pioneering non-profit educational movement dedicated to providing free, high-tier software engineering, AI technology, indigenous Ethiopian history, and hospitality character training to talented youth across Ethiopia.",
  aboutHeroStats: [
    { value: "500+", label: "Talented Geniuses Trained" },
    { value: "100% Free", label: "Tuition Cost to Students" },
    { value: "12+", label: "Summer & Annual Cohorts" },
    { value: "15+", label: "Institutional Partners" },
  ],
  aboutCampusVisionTitle: "Building the Permanent Shega Innovation Campus",
  aboutCampusVisionText:
    "Our ultimate goal is building our own dedicated 24/7 innovation campus in Addis Ababa—equipped with overnight coding laboratories, hardware workshops, incubation spaces, rest facilities, and multi-tier cohort capacity reachable from every corner of Ethiopia.",
  orgStructureTitle: "Role & Responsibilities Breakdown",
  orgStructureSubtitle: "Organizational breakdown & governance framework for Shega Generation.",
};

const homePageSettingsObj = {
  _id: "homePageSettings",
  _type: "homePageSettings",
  heroTitle: "Shega Generation",
  heroCaption: "Sharing knowledge in kindness across generations — fusing software engineering and AI with Ethiopian heritage to empower future leaders.",
  heroCtaPrimary: "Apply for Summer Camp",
  heroCtaSecondary: "Partner & Sponsor",
  statementBannerTitle1: "Software & AI Labs",
  statementBannerTitle2: "Indigenous Wisdom & Erq",
  statementBannerTitle3: "Youth Leadership",
  culturalAnchoringSubtitle: "Rooted in Ethiopian Heritage & Character",
  culturalAnchoringDescription: "From ancient Ge'ez fundamentals and Ethiopian history to traditional dining etiquette (የማዕድ ስነ-ስርዓት) and positive communication (ፈገግታና አዎንታዊ ተግባቦት), we nurture technically elite, culturally grounded leaders.",
  pedagogicalTitle: "Peer Mentorship & Hands-On Engineering",
  pedagogicalDescription: "Students learn full-stack development, AI model integration, hardware tinkering, and project management in real commercial client software labs.",
  curriculumTitle: "Complete Engineering & Leadership Curriculum",
  curriculumDescription: "From foundational computer science and web dev to advanced artificial intelligence and indigenous ethics.",
  journeysKicker: "Student Media Coverage & Achievements",
  journeysTitle: "Student Interviews & Media Features",
  journeysDescription: "Radio interviews, podcast features, Facebook broadcasts, and software projects executed by Shega Generation students.",
  testimonialsTitle: "Voices of the Generation",
  testimonialsDescription: "Hear from our students, alumni, and community mentors about their transformational journey at Shega Generations.",
  partnersKicker: "Our clients / partners",
  partnersHeadline: "Pleasure to work with",
  partnersDescription: "Shega Generation collaborates with Ethiopia's premier educational academies, hospitality centers, media houses, and venue operators across Addis Ababa.",
  communityKicker: "Community",
  communityTitle: "Follow the day to day",
  communityDescription: "Stay connected with our daily student builds, summer camp moments, and community updates.",
  socialFacebookHandle: "Shega Community Group",
  socialFacebookUrl: "https://web.facebook.com/share/g/18foDKzcBS/",
  socialTelegramHandle: "t.me/shegagenerations",
  socialTelegramUrl: "https://t.me/shegagenerations",
  socialTikTokHandle: "@samuelgeremew_21",
  socialTikTokUrl: "https://www.tiktok.com/@samuelgeremew_21",
};

const eventsPageSettingsObj = {
  _id: "eventsPageSettings",
  _type: "eventsPageSettings",
  eventsSectionKicker: "The nearest gathering",
  eventsSectionTitle: "Upcoming Gathering & Workshops",
  eventsPageTitlePhrases: [
    "Where the generation gathers.",
    "የትውልዱ መገናኛ",
    "UPCOMING CTFs & WORKSHOPS",
  ],
  eventsPageSubtitle: "Active, incoming and historic meetups from CTFs in Addis to Simien treks.",
  eventsCategories: ["CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity"],
};

const galleryPageSettingsObj = {
  _id: "galleryPageSettings",
  _type: "galleryPageSettings",
  galleryPageTitlePhrases: [
    "The weave, in pictures.",
    "በስዕሎች የተሸመነው",
    "STUDENT COHORTS & EXPEDITIONS",
  ],
  galleryPageSubtitle: "Expeditions, hackathons, classrooms, and volunteer work across Ethiopia.",
  galleryCategories: ["Expeditions", "Hackathons", "Classroom", "Volunteer-Work"],
};

const contactPageSettingsObj = {
  _id: "contactPageSettings",
  _type: "contactPageSettings",
  contactPageTitlePhrases: [
    "Get in touch, with Shega.",
    "ከሸጋ ጋር, ይገናኙ",
    "PARTNERSHIPS & INQUIRIES",
  ],
  contactPageSubtitle: "Reach out to our leadership team for general inquiries, partnerships, sponsorships, media features, or donations.",
};

const themeSettingsObj = {
  _id: "themeSettings",
  _type: "themeSettings",
  siteName: "Shega Generations",
  siteTagline: "Nurturing Tech Geniuses & Indigenous Leadership in Ethiopia",
  themePreset: "orange-navy",
  primaryColor: "#EA580C",
  secondaryColor: "#0A192F",
  accentColor: "#EA580C",
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
  // 1. Board of Directors / Council Governance
  {
    _id: "team-member-sahret",
    _type: "teamMember",
    englishName: "Sahret Sefa",
    amharicName: "ወ/ሮ ሳህረት ሰፋ",
    name: "Sahret Sefa (ወ/ሮ ሳህረት ሰፋ)",
    role: "Board Council President",
    department: "board",
    departments: ["board"],
    isBoardMember: true,
    isExecutiveLeader: false,
    isFeatured: true,
    responsibilities: "Provides strategic vision, high-level governance, and institutional oversight for the organization.",
    bio: "Provides strategic vision, high-level governance, and institutional oversight for Shega Generation across all organizational initiatives.",
    quote: "Guiding the strategic vision and institutional governance to build sustainable impact for Ethiopian youth.",
    organizationAffiliations: ["Board Council President", "Institutional Governance"],
    socialLinks: { email: "sahret@shegagenerations.org" },
    order: 1,
  },
  {
    _id: "team-member-selamawit-prof",
    _type: "teamMember",
    englishName: "Prof. Selamawit Mekonnen",
    amharicName: "ፕሮፌሰር ሰላማዊት መኮንን",
    name: "Prof. Selamawit Mekonnen (ፕሮፌሰር ሰላማዊት መኮንን)",
    role: "Board Secretary",
    department: "board",
    departments: ["board"],
    isBoardMember: true,
    isExecutiveLeader: false,
    isFeatured: true,
    responsibilities: "Manages board communications, governance documentation, and official policy compliance.",
    bio: "Manages board communications, governance documentation, and official policy compliance for Shega Generation.",
    quote: "Ensuring rigorous documentation, transparent governance, and institutional policy compliance.",
    organizationAffiliations: ["Board Secretary", "Policy Compliance Lead"],
    socialLinks: { email: "selamawit.m@shegagenerations.org" },
    order: 2,
  },
  {
    _id: "team-member-henok",
    _type: "teamMember",
    englishName: "Dr. Henok Mulugeta",
    amharicName: "ዶክተር ሄኖክ ሙሉጌታ",
    name: "Dr. Henok Mulugeta (ዶክተር ሄኖክ ሙሉጌታ)",
    role: "Board Member",
    department: "board",
    departments: ["board", "tech", "advisory"],
    isBoardMember: true,
    isExecutiveLeader: false,
    isFeatured: true,
    responsibilities: "Provides advisory support, strategic direction, and institutional oversight across organizational initiatives.",
    bio: "Dr. Henock Mulugeta is an experienced academician and researcher, currently serving as an Associate Professor of Electrical and Computer Engineering and Head of the School of Information Technology and Engineering (SiTE) at AAU. He holds a PhD in Computer Engineering from AAU's SECE. Throughout his 20-year career, he has authored over 22 research articles in networking, cybersecurity, AI, and Cyber-intelligence. Dr. Henock actively collaborates with IGAD's Security Sector Program providing cybersecurity and AI trainings across Ethiopia, Uganda, and Kenya, and serves as a consultant for institutions including the Ethiopian Artificial Intelligence Institute (EAII).",
    quote: "Promoting institutional excellence, cybersecurity research, and AI innovation for Ethiopian youth and regional stability.",
    organizationAffiliations: ["Board Member", "Head of SiTE (AAU)", "PhD Computer Engineering", "EAII Consultant", "Cybersecurity & AI Researcher"],
    socialLinks: { email: "henok@shegagenerations.org" },
    order: 3,
  },
  {
    _id: "team-member-tibebu",
    _type: "teamMember",
    englishName: "Tibebu Belete",
    amharicName: "ጥበቡ በለጠ",
    name: "Tibebu Belete (ጥበቡ በለጠ)",
    role: "Board Member",
    department: "board",
    departments: ["board"],
    isBoardMember: true,
    isExecutiveLeader: false,
    isFeatured: true,
    responsibilities: "Provides advisory support, strategic direction, and institutional oversight across organizational initiatives.",
    bio: "Provides advisory support, strategic direction, and institutional oversight across organizational initiatives.",
    quote: "Supporting organizational growth and institutional development across Ethiopia.",
    organizationAffiliations: ["Board Member", "Institutional Support"],
    socialLinks: { email: "tibebu@shegagenerations.org" },
    order: 4,
  },

  // 2. Executive & Operational Leadership
  {
    _id: "team-member-samuel",
    _type: "teamMember",
    englishName: "Samuel Geremew",
    amharicName: "ሳሙኤል ገረመው",
    name: "Samuel Geremew (ሳሙኤል ገረመው)",
    role: "Founder, Executive Director & Board Member",
    department: "executive",
    departments: ["board", "executive", "tech", "media"],
    isBoardMember: true,
    isExecutiveLeader: true,
    isTeacher: true,
    teachingSubject: "Computer Science & Cybersecurity Fundamentals",
    teachingPeriod: "2021 – Present",
    isFeatured: true,
    responsibilities: "Drives the core vision, strategic partnerships, and overall operations of Shega Generation.",
    bio: "Samuel Geremew is a computer science researcher, cybersecurity specialist, educator, and media entrepreneur with expertise in digital security, technology education, and youth development. Holding a Master's degree in Computer Science with a specialization in Cybersecurity, he serves as a higher education lecturer and researcher. Samuel is the Founder and Executive Director of Shega Generation (የሸጋ ትውልድ), General Manager of Samelos Media & Communication, and host of the popular 'Shaga Chewata' (የሸጋ ጨዋታ) radio and TV program. He also serves as an Honorary Ambassador for Mary Joy Ethiopia.",
    quote: "Share our knowledge in kindness. When you empower a child with technology and character, you transform an entire generation.",
    organizationAffiliations: [
      "Founder & Executive Director",
      "MSc Computer Science (Cybersecurity)",
      "Higher Ed Lecturer & Researcher",
      "Host 'Shaga Chewata' Radio & TV",
      "MaryJoy Ethiopia Ambassador",
      "GM Samelos Media",
    ],
    socialLinks: {
      tiktok: "https://www.tiktok.com/@samuelgeremew_21",
      facebook: "https://web.facebook.com/share/g/18foDKzcBS/",
      email: "samuel@shegagenerations.org",
    },
    order: 5,
  },
  {
    _id: "team-member-zemichael",
    _type: "teamMember",
    englishName: "Zemichael Tefera",
    amharicName: "አቶ ዘሚካኤል ተፈራ",
    name: "Zemichael Tefera (አቶ ዘሚካኤል ተፈራ)",
    role: "Board Member & Talent Head (Chief Coordinator)",
    department: "executive",
    departments: ["board", "executive", "tech", "operations"],
    isBoardMember: true,
    isExecutiveLeader: true,
    isTeacher: true,
    teachingSubject: "Full-Stack Web Dev & Technical Mentorship",
    teachingPeriod: "2021 – Present",
    isFeatured: true,
    responsibilities: "Oversees talent development, student mentorship frameworks, cohort placements, and technical instruction.",
    bio: "Chief Coordinator overseeing talent development, student mentorship frameworks, cohort placements, and technical instruction across summer camps and software labs.",
    quote: "Empowering every student with high-level technical mastery and individual mentorship.",
    organizationAffiliations: [
      "Board Member",
      "Talent Head",
      "Chief Coordinator",
      "Senior Technical Lead",
    ],
    socialLinks: {
      email: "zemichael@shegagenerations.org",
    },
    order: 6,
  },
  {
    _id: "team-member-tedros",
    _type: "teamMember",
    englishName: "Tedros Molla",
    amharicName: "አቶ ቴድሮስ ሞላ",
    name: "Tedros Molla (አቶ ቴድሮስ ሞላ)",
    role: "Public Relations (PR)",
    department: "executive",
    departments: ["executive", "media"],
    isBoardMember: false,
    isExecutiveLeader: true,
    isFeatured: true,
    responsibilities: "Manages media relations, public engagement, and organizational communications.",
    bio: "Manages media relations, public engagement, press releases, and organizational communications across national channels.",
    quote: "Amplifying the stories and achievements of Ethiopian youth coders across national media.",
    organizationAffiliations: ["Public Relations Lead", "Media Relations"],
    socialLinks: {
      email: "tedros@shegagenerations.org",
    },
    order: 7,
  },
  {
    _id: "team-member-thomas",
    _type: "teamMember",
    englishName: "Thomas Hailu",
    amharicName: "አቶ ቶማስ ሃይሉ",
    name: "Thomas Hailu (አቶ ቶማስ ሃይሉ)",
    role: "Training Coordinator",
    department: "executive",
    departments: ["executive", "tech", "operations"],
    isBoardMember: false,
    isExecutiveLeader: true,
    isTeacher: true,
    teachingSubject: "Training Logistics & Practical Coding Execution",
    teachingPeriod: "2023 – Present",
    isFeatured: true,
    responsibilities: "Directs day-to-day training logistics, curriculum execution, and instructor management across cohorts.",
    bio: "Directs day-to-day training logistics, curriculum execution, class schedules, and instructor management across all cohorts.",
    quote: "Delivering seamless daily instruction and curriculum execution for every cohort.",
    organizationAffiliations: ["Training Coordinator", "Curriculum Logistics Lead"],
    socialLinks: {
      email: "thomas@shegagenerations.org",
    },
    order: 8,
  },
];

const educationalPillars = [
  {
    _id: "pillar-1",
    _type: "educationalPillar",
    pillarNumber: 1,
    title: "Computational Supremacy",
    titleAmharic: "የኮምፒውተርና አይ-ኦቲ ትምህርት",
    description: "From Scratch & Python to AI Command Engineering, Full-Stack web development, cybersecurity, and robotics.",
    tags: ["Python", "AI Engineering", "Web Dev", "Robotics"],
    iconType: "code",
  },
  {
    _id: "pillar-2",
    _type: "educationalPillar",
    pillarNumber: 2,
    title: "Indigenous Heritage & Ge'ez",
    titleAmharic: "ሀገር በቀል እውቀትና ግዕዝ",
    description: "Unlocking ancient Ge'ez numeral systems, traditional architectural secrets, Ethiopian history, and Erq conflict resolution.",
    tags: ["Ge'ez", "Ethiopian History", "Architecture Secrets", "Erq"],
    iconType: "heritage",
  },
  {
    _id: "pillar-3",
    _type: "educationalPillar",
    pillarNumber: 3,
    title: "Etiquette & Hospitality",
    titleAmharic: "የማዕድ ስነ-ስርዓትና ስነ-ምግባር",
    description: "Practical instruction in የማዕድ ስነ-ስርዓት (Dining Etiquette), ፈገግታና አዎንታዊ ተግባቦት (Positive Communication) in partnership with TTI.",
    tags: ["የማዕድ ስነ-ስርዓት", "Hospitality", "Public Speaking", "Character"],
    iconType: "hospitality",
  },
  {
    _id: "pillar-4",
    _type: "educationalPillar",
    pillarNumber: 4,
    title: "Youth Mentorship & Software Lab",
    titleAmharic: "የተማሪዎች ሶፍትዌር ላብ",
    description: "Senior students mentor junior cohorts and execute commercial client software contracts—gaining real industry experience.",
    tags: ["Peer Mentorship", "Commercial Lab", "Client Projects", "Incubation"],
    iconType: "mentorship",
  },
];

async function seed() {
  console.log("🚀 Starting Sanity CMS Data Seeding...");
  console.log(`Project ID: ${projectId}, Dataset: ${dataset}`);

  try {
    // 1. Site Settings
    console.log("Seeding Global Site Settings & Dedicated Page Settings...");
    await client.createOrReplace(siteSettings);
    await client.createOrReplace(aboutPageSettingsObj);
    await client.createOrReplace(homePageSettingsObj);
    await client.createOrReplace(eventsPageSettingsObj);
    await client.createOrReplace(galleryPageSettingsObj);
    await client.createOrReplace(contactPageSettingsObj);
    await client.createOrReplace(themeSettingsObj);

    // 2. Story Milestones
    console.log("Seeding Story Milestones...");
    for (const milestone of storyMilestones) {
      await client.createIfNotExists(milestone);
      console.log(`  ✓ Milestone: ${milestone.year} - ${milestone.title}`);
    }

    // 3. Educational Pillars
    console.log("Seeding Educational Pillars...");
    for (const pillar of educationalPillars) {
      await client.createIfNotExists(pillar);
      console.log(`  ✓ Educational Pillar 0${pillar.pillarNumber}: ${pillar.title}`);
    }

    // 4. Team Members
    console.log("Seeding Team Members...");
    for (const member of teamMembers) {
      await client.createIfNotExists(member);
      console.log(`  ✓ Team Member: ${member.name}`);
    }

    console.log("✅ Sanity CMS Data Seeding Completed Successfully!");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}

seed();
