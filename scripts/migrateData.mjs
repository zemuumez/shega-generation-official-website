import { createClient } from "@sanity/client";

// Read credentials from environment variables or defaults
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN || "skJlc6RR7eFu5k9mD6VvedBDyf1ylGUpnxCq6bFNgYmZ9h1OnHOg5bE7BnozVhm7W56ope4NoyMv04xoDSGA3CTflJwx78ZIwEuH7Ruvjj1NJjcbIOSR3sIw2cy9jk7xEXldJbv5bnVGg8OSGURXfAqdkgPFF2zHtCylTmArysdD5FHPvfnf";

if (!token) {
  console.error("❌ Error: SANITY_WRITE_TOKEN is required for migration.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: "2024-06-01",
});

// Hardcoded initial contents from lib/demoData.ts
const INITIAL_SITE_SETTINGS = {
  _id: "siteSettings",
  _type: "siteSettings",
  heroTitle: "Shega Generations",
  heroCaption:
    "Dedicated to sharing knowledge kindly across generations, weaving rich indigenous wisdom with modern technology to anchor, empower, and shape future leaders in every region.",
  heroCtaPrimary: "Join the Generation",
  heroCtaSecondary: "Support the Mission",
  statementBannerTitle1: "Tech Orientation",
  statementBannerTitle2: "Life Skills",
  statementBannerTitle3: "Indigenous Weaving",
  culturalAnchoringSubtitle: "Our Cultural Anchoring",
  culturalAnchoringDescription:
    "By grounding tech instruction in traditional craft and community cooperation, we build leaders who build for their homeland.",
  pedagogicalTitle: "Pedagogical Architecture",
  pedagogicalDescription:
    "Our three-pillared methodology weaves digital literacy, life wisdom, and indigenous heritage into one holistic trajectory.",
  curriculumTitle: "Dynamic Curriculum & Tracks",
  curriculumDescription:
    "Explore open courses across three core tracks: Tech Orientation, Life Skills, and Indigenous Knowledge.",
  journeysTitle: "Student Journeys & Ventures",
  journeysDescription:
    "Alumni startups, open-source AI models, and regional logistics tools that started as a Shega assignment.",
  testimonialsTitle: "Voices of Shega",
  testimonialsDescription:
    "Graduate stories from regional cohorts across Ethiopia — building localized software and launching real ventures.",
  communityTitle: "Follow the day to day",
};

const INITIAL_COURSES = [
  {
    _id: "course-1",
    _type: "course",
    title: "Full-Stack Web & Mobile Architecture",
    instructor: "Zemichael Tefera • Lead Engineer",
    badgeCategory: "Tech Orientation",
    level: "Intermediate • 12 Weeks",
    snippet:
      "Master modern TypeScript, Next.js App Router, React Native, and PostgreSQL to craft resilient web and mobile platforms built for local commerce.",
    externalLmsUrl: "#",
    sequenceOrder: 1,
    rating: "4.9",
    enrolledCount: 140,
    tags: ["Next.js", "TypeScript", "React Native", "PostgreSQL"],
  },
  {
    _id: "course-2",
    _type: "course",
    title: "Applied AI & Low-Resource Language Models",
    instructor: "Dr. Abera B. • AI Research Lead",
    badgeCategory: "Tech Orientation",
    level: "Advanced • 10 Weeks",
    snippet:
      "Train custom neural networks, fine-tune open-weights models (Llama 3, Mistral) on Amharic/Afan Oromo corpora, and build OCR pipelines for Ge'ez script.",
    externalLmsUrl: "#",
    sequenceOrder: 2,
    rating: "5.0",
    enrolledCount: 95,
    tags: ["PyTorch", "HuggingFace", "Ge'ez OCR", "Llama 3"],
  },
  {
    _id: "course-3",
    _type: "course",
    title: "DevOps, Containerization & Offline Edge Nodes",
    instructor: "Kidus Y. • Systems Architect",
    badgeCategory: "Tech Orientation",
    level: "Intermediate • 8 Weeks",
    snippet:
      "Construct GitOps CI/CD pipelines, Docker containers, and resilient Kubernetes clusters tailored for low-bandwidth, offline-first regional deployments.",
    externalLmsUrl: "#",
    sequenceOrder: 3,
    rating: "4.8",
    enrolledCount: 110,
    tags: ["Docker", "Kubernetes", "GitOps", "Terraform"],
  },
  {
    _id: "course-4",
    _type: "course",
    title: "Ethnomathematics & Tibeb Weaving Geometry",
    instructor: "Master Weaver Wolete & Shega Tech Team",
    badgeCategory: "Indigenous Knowledge",
    level: "All Levels • 6 Weeks",
    snippet:
      "Decode structural geometry patterns in traditional Ethiopian Tibeb textiles. Translate organic weaving matrices into responsive CSS grids and SVG graphic algorithms.",
    externalLmsUrl: "#",
    sequenceOrder: 4,
    rating: "5.0",
    enrolledCount: 210,
    tags: ["Ethnomathematics", "SVG Grids", "Tibeb Geometry", "CSS Math"],
  },
  {
    _id: "course-5",
    _type: "course",
    title: "Negotiation, Pitching & Venture Leadership",
    instructor: "Bethlehem T. & Shega Founders Network",
    badgeCategory: "Life Skills",
    level: "All Levels • 6 Weeks",
    snippet:
      "Master technical storytelling, contract negotiation, financial literacy, and community ethics. Prepare to pitch, launch, and sustain independent engineering ventures.",
    externalLmsUrl: "#",
    sequenceOrder: 5,
    rating: "4.9",
    enrolledCount: 180,
    tags: ["Venture Pitching", "Financial Literacy", "Leadership", "Ethics"],
  },
  {
    _id: "course-6",
    _type: "course",
    title: "Geospatial Data & Agricultural Logistics",
    instructor: "Tewodros A. • GIS Specialist",
    badgeCategory: "Tech Orientation",
    level: "Intermediate • 8 Weeks",
    snippet:
      "Build spatial data pipelines mapping regional supply chains, local crop micro-climates, and transport networks across Ethiopian secondary cities.",
    externalLmsUrl: "#",
    sequenceOrder: 6,
    rating: "4.9",
    enrolledCount: 85,
    tags: ["QGIS", "GeoJSON", "Python Data", "Logistics"],
  },
];

const INITIAL_PROJECTS = [
  {
    _id: "project-1",
    _type: "project",
    title: "Adera Logistics Platform",
    creatorName: "Sara Mohammed",
    cohortLocation: "Hawassa Cohort",
    description:
      "Decentralized dispatch & inventory tracker for regional agricultural cooperatives. Connected 14 rural farming unions in Sidama, processing over $120k in regional grain trades.",
    impactMetric: "14 Unions Connected • $120k Processed",
    category: "Venture Startup",
    projectUrl: "#",
    quote: "Shega showed me how to turn local logistics challenges into production-grade software.",
    techStack: ["Next.js", "PostgreSQL", "Twilio SMS", "TailwindCSS"],
  },
  {
    _id: "project-2",
    _type: "project",
    title: "Ge'ez Vision OCR",
    creatorName: "Dawit Kassaye",
    cohortLocation: "Bahir Dar Cohort",
    description:
      "Deep-learning optical character recognition model fine-tuned for historic Ge'ez and Amharic manuscripts. Digitized over 400 ancient texts for public archives.",
    impactMetric: "400+ Manuscripts Digitized • 98.4% Accuracy",
    category: "Open-Source AI",
    projectUrl: "#",
    quote: "We combined our AI lab training with local manuscript preservation.",
    techStack: ["PyTorch", "OpenCV", "Tesseract", "FastAPI"],
  },
  {
    _id: "project-3",
    _type: "project",
    title: "AgriSignal SMS",
    creatorName: "Hana Assefa",
    cohortLocation: "Adama Cohort",
    description:
      "USSD & SMS weather advisory delivering micro-climate frost alerts and market prices to smallholder farmers without smartphone or internet connectivity.",
    impactMetric: "12,500 Active Farmers • 4 Languages",
    category: "Offline Agritech",
    projectUrl: "#",
    quote: "Building offline-first tools meant our software actually reached local farm hands.",
    techStack: ["Node.js", "Africa's Talking API", "Redis", "USSD"],
  },
  {
    _id: "project-4",
    _type: "project",
    title: "Tibeb Design System",
    creatorName: "Yonas & Samrawit",
    cohortLocation: "Mekelle Cohort",
    description:
      "An open-source generative CSS/SVG grid generator that converts traditional Ethiopian weaving math into production Web component design tokens.",
    impactMetric: "1,200+ GitHub Stars • Used in 15 Apps",
    category: "UI Framework",
    projectUrl: "#",
    quote: "Ethnomathematics became our superpower for creating authentic digital interfaces.",
    techStack: ["TypeScript", "SVG Engine", "Tailwind Plugin", "Web Components"],
  },
  {
    _id: "project-5",
    _type: "project",
    title: "HealthReach Telemetry",
    creatorName: "Abdi Tolosa",
    cohortLocation: "Jima Cohort",
    description:
      "Low-bandwidth patient diagnostic sync tool operating over intermittent 2G networks, connecting remote rural health posts with referral hospitals.",
    impactMetric: "32 Clinics Deployed • 8,000 Patient Logs",
    category: "HealthTech",
    projectUrl: "#",
    quote: "Our DevOps training helped us design software that never crashes when the network drops.",
    techStack: ["React Native", "SQLite", "Docker", "Go"],
  },
];

const INITIAL_EVENTS = [
  {
    _id: "event-1",
    _type: "event",
    title: "Regional CTF: Bahir Dar Circuit",
    type: "CTF",
    slug: { _type: "slug", current: "bahir-dar-ctf" },
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    location: "Bahir Dar, Amhara Region",
    isUpcoming: true,
    registrationLink: "#",
  },
  {
    _id: "event-2",
    _type: "event",
    title: "Simien Mountains Expedition",
    type: "Hiking",
    slug: { _type: "slug", current: "simien-expedition" },
    eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    location: "Simien Mountains, Amhara Region",
    isUpcoming: false,
    registrationLink: "#",
  },
  {
    _id: "event-3",
    _type: "event",
    title: "National Hackathon: Build for Home",
    type: "Hackathon",
    slug: { _type: "slug", current: "build-for-home" },
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 55).toISOString(),
    location: "Addis Ababa",
    isUpcoming: true,
    registrationLink: "#",
  },
];

const INITIAL_TESTIMONIALS = [
  {
    _id: "testimonial-1",
    _type: "testimonial",
    quote:
      "Shega gave me the space to write my first line of code. Today, I'm training low-resource NLP models translating educational textbooks into our regional languages.",
    author: "Tsion Kebede",
    role: "AI Researcher @ Lesan AI",
    track: "AI Laboratory Graduate",
    location: "Bahir Dar Cohort",
  },
  {
    _id: "testimonial-2",
    _type: "testimonial",
    quote:
      "The ethnomathematics module opened my eyes. We don't have to copy Silicon Valley — we can build tools rooted in our own culture, ethics, and economic needs.",
    author: "Elias Worku",
    role: "Founding Engineer @ Adera",
    track: "Web & Mobile Cohort",
    location: "Hawassa Cohort",
  },
  {
    _id: "testimonial-3",
    _type: "testimonial",
    quote:
      "The life skills and negotiation track was just as critical as the coding labs. It gave me the confidence to pitch our agritech startup to regional trade bodies.",
    author: "Bethlehem Hailu",
    role: "Co-Founder @ AgriSignal",
    track: "Venture Leadership Cohort",
    location: "Adama Cohort",
  },
];

async function runMigration() {
  console.log("🚀 Starting Shega Generations Sanity CMS Migration...\n");

  try {
    // 1. Site Settings
    console.log("📝 Upserting Site Settings...");
    await client.createOrReplace(INITIAL_SITE_SETTINGS);
    console.log("✅ Site Settings created successfully!");

    // 2. Courses
    console.log("\n📚 Upserting Courses...");
    for (const course of INITIAL_COURSES) {
      await client.createOrReplace(course);
      console.log(`  - Course: ${course.title}`);
    }
    console.log("✅ All Courses created successfully!");

    // 3. Projects (Student Journeys)
    console.log("\n🚀 Upserting Student Journeys / Projects...");
    for (const project of INITIAL_PROJECTS) {
      await client.createOrReplace(project);
      console.log(`  - Project: ${project.title}`);
    }
    console.log("✅ All Student Journeys created successfully!");

    // 4. Events
    console.log("\n📅 Upserting Events...");
    for (const event of INITIAL_EVENTS) {
      await client.createOrReplace(event);
      console.log(`  - Event: ${event.title}`);
    }
    console.log("✅ All Events created successfully!");

    // 5. Testimonials
    console.log("\n💬 Upserting Alumni Testimonials...");
    for (const testimonial of INITIAL_TESTIMONIALS) {
      await client.createOrReplace(testimonial);
      console.log(`  - Testimonial: ${testimonial.author}`);
    }
    console.log("✅ All Testimonials created successfully!");

    console.log("\n🎉 CMS Migration Completed Successfully!");
    console.log("Visit /studio in your browser to inspect and manage all contents!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

runMigration();
