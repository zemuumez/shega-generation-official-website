// Placeholder content only. Every field here mirrors a real Sanity schema
// field 1:1, so swapping this out for live CMS data later is a delete,
// not a rewrite.

export const demoUpcomingEvent = {
  _id: "demo-event-1",
  title: "Regional CTF: Bahir Dar Circuit",
  type: "CTF",
  slug: { current: "bahir-dar-ctf" },
  eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
  location: "Bahir Dar, Amhara Region",
  coverImage: null,
  registrationLink: "#",
};

export const demoEvents = [
  demoUpcomingEvent,
  {
    _id: "demo-event-2",
    title: "Simien Mountains Expedition",
    type: "Hiking",
    slug: { current: "simien-expedition" },
    eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    location: "Simien Mountains, Amhara Region",
    coverImage: null,
    isUpcoming: false,
    registrationLink: "#",
  },
  {
    _id: "demo-event-3",
    title: "National Hackathon: Build for Home",
    type: "Hackathon",
    slug: { current: "build-for-home" },
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 55).toISOString(),
    location: "Addis Ababa",
    coverImage: null,
    isUpcoming: true,
    registrationLink: "#",
  },
];

export const demoCourses = [
  {
    _id: "demo-course-1",
    title: "Foundations of Web Development",
    instructor: "Zemichael T.",
    badgeCategory: "Tech Orientation",
    snippet: "HTML, CSS and the logic underneath every page you've ever opened.",
    bannerImage: null,
    externalLmsUrl: "#",
    sequenceOrder: 1,
  },
  {
    _id: "demo-course-2",
    title: "Machine Learning, First Principles",
    instructor: "Guest Instructor",
    badgeCategory: "Tech Orientation",
    snippet: "Vectors, gradients, and why a model learns anything at all.",
    bannerImage: null,
    externalLmsUrl: "#",
    sequenceOrder: 2,
  },
  {
    _id: "demo-course-3",
    title: "Negotiation & Self-Advocacy",
    instructor: "Shega Mentors",
    badgeCategory: "Life Skills",
    snippet: "How to ask for what you're worth, in Amharic or English.",
    bannerImage: null,
    externalLmsUrl: "#",
    sequenceOrder: 3,
  },
  {
    _id: "demo-course-4",
    title: "Oral Tradition as Design Pattern",
    instructor: "Community Elders",
    badgeCategory: "Indigenous Knowledge",
    snippet: "What centuries-old storytelling structures teach about UX.",
    bannerImage: null,
    externalLmsUrl: "#",
    sequenceOrder: 4,
  },
];

export const demoProjects = [
  {
    _id: "demo-project-1",
    title: "Adera",
    creatorName: "Sara M.",
    description: "A logistics tracker for small delivery cooperatives.",
    category: "Venture-Backed Startup",
    projectUrl: "#",
    image: null,
  },
  {
    _id: "demo-project-2",
    title: "Ge'ez OCR",
    creatorName: "Dawit K.",
    description: "Open-source text recognition for historical Ge'ez manuscripts.",
    category: "Open-Source Tool",
    projectUrl: "#",
    image: null,
  },
  {
    _id: "demo-project-3",
    title: "Farm Signal",
    creatorName: "Hana A.",
    description: "SMS-based crop advisory for offline-first regions.",
    category: "Project",
    projectUrl: "#",
    image: null,
  },
];

export const demoGallery = [
  { _id: "demo-g1", image: null, caption: "Diagnostic day, Addis cohort", categoryTag: "Classroom" },
  { _id: "demo-g2", image: null, caption: "Simien ridge, sunrise briefing", categoryTag: "Expeditions" },
  { _id: "demo-g3", image: null, caption: "48-hour build, final hour", categoryTag: "Hackathons" },
  { _id: "demo-g4", image: null, caption: "Rebuilding a school lab", categoryTag: "Volunteer-Work" },
  { _id: "demo-g5", image: null, caption: "First CTF flag, live", categoryTag: "Hackathons" },
  { _id: "demo-g6", image: null, caption: "Regional orientation, Bahir Dar", categoryTag: "Classroom" },
];
