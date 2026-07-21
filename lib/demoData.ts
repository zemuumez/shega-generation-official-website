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
  coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
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
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
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
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
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
    bannerImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    externalLmsUrl: "#",
    sequenceOrder: 1,
  },
  {
    _id: "demo-course-2",
    title: "Machine Learning, First Principles",
    instructor: "Guest Instructor",
    badgeCategory: "Tech Orientation",
    snippet: "Vectors, gradients, and why a model learns anything at all.",
    bannerImage: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800",
    externalLmsUrl: "#",
    sequenceOrder: 2,
  },
  {
    _id: "demo-course-3",
    title: "Negotiation & Self-Advocacy",
    instructor: "Shega Mentors",
    badgeCategory: "Life Skills",
    snippet: "How to ask for what you're worth, in Amharic or English.",
    bannerImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    externalLmsUrl: "#",
    sequenceOrder: 3,
  },
  {
    _id: "demo-course-4",
    title: "Oral Tradition as Design Pattern",
    instructor: "Community Elders",
    badgeCategory: "Indigenous Knowledge",
    snippet: "What centuries-old storytelling structures teach about UX.",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
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
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  },
  {
    _id: "demo-project-2",
    title: "Ge'ez OCR",
    creatorName: "Dawit K.",
    description: "Open-source text recognition for historical Ge'ez manuscripts.",
    category: "Open-Source Tool",
    projectUrl: "#",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
  },
  {
    _id: "demo-project-3",
    title: "Farm Signal",
    creatorName: "Hana A.",
    description: "SMS-based crop advisory for offline-first regions.",
    category: "Project",
    projectUrl: "#",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
  },
];

export const demoGallery = [
  {
    _id: "demo-g1",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    caption: "Diagnostic day, Addis cohort",
    categoryTag: "Classroom",
  },
  {
    _id: "demo-g2",
    image: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&q=80&w=800",
    caption: "Simien ridge, sunrise briefing",
    categoryTag: "Expeditions",
  },
  {
    _id: "demo-g3",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    caption: "48-hour build, final hour",
    categoryTag: "Hackathons",
  },
  {
    _id: "demo-g4",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800",
    caption: "Rebuilding a school lab",
    categoryTag: "Volunteer-Work",
  },
  {
    _id: "demo-g5",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    caption: "First CTF flag, live",
    categoryTag: "Hackathons",
  },
  {
    _id: "demo-g6",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    caption: "Regional orientation, Bahir Dar",
    categoryTag: "Classroom",
  },
];
