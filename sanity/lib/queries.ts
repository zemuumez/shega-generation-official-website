export const SITE_SETTINGS_QUERY = `
*[_id == "siteSettings" || _type == "siteSettings"][0] {
  ...,
  heroTitleBgImage { asset-> },
  statementBannerImage { asset-> },
  culturalAnchoringImage { asset-> }
}`;

export const ABOUT_PAGE_SETTINGS_QUERY = `
*[_id == "siteSettings" || _type == "siteSettings"][0] {
  aboutHeroKicker,
  aboutPageTitlePhrases,
  aboutPageSubtitle,
  aboutHeroStats,
  aboutPillarsTitle,
  aboutPillarsSubtitle,
  aboutPillarsList,
  aboutCampusVisionTitle,
  aboutCampusVisionText,
  orgStructureTitle,
  orgStructureSubtitle
}`;

export const HOME_PAGE_SETTINGS_QUERY = `
*[_id == "siteSettings" || _type == "siteSettings"][0] {
  ...,
  heroTitleBgImage { asset-> },
  statementBannerImage { asset-> },
  culturalAnchoringImage { asset-> }
}`;

export const EVENTS_PAGE_SETTINGS_QUERY = `
*[_id == "siteSettings" || _type == "siteSettings"][0] {
  eventsSectionKicker,
  eventsSectionTitle,
  eventsPageTitlePhrases,
  eventsPageSubtitle,
  eventsCategories
}`;

export const GALLERY_PAGE_SETTINGS_QUERY = `
*[_id == "siteSettings" || _type == "siteSettings"][0] {
  galleryPageTitlePhrases,
  galleryPageSubtitle,
  galleryCategories
}`;

export const CONTACT_PAGE_SETTINGS_QUERY = `
*[_id == "siteSettings" || _type == "siteSettings"][0] {
  contactPageTitlePhrases,
  contactPageSubtitle,
  socialFacebookHandle,
  socialFacebookUrl,
  socialTelegramHandle,
  socialTelegramUrl,
  socialTikTokHandle,
  socialTikTokUrl
}`;

export const UPCOMING_EVENT_QUERY = `
*[_type == "event" && isUpcoming == true] | order(eventDate asc) [0] {
  _id, title, type, slug, description, coverImage { asset-> }, eventDate, location, isUpcoming, registrationLink
}`;

export const ALL_EVENTS_QUERY = `
*[_type == "event"] | order(eventDate desc) {
  _id, title, type, slug, description, coverImage { asset-> }, eventDate, location, isUpcoming, registrationLink
}`;

export const FEATURED_COURSES_QUERY = `
*[_type == "course"] | order(sequenceOrder asc) {
  _id, title, instructor, badgeCategory, level, snippet, bannerImage { asset-> }, externalLmsUrl, sequenceOrder, rating, enrolledCount, tags
}`;

export const PROJECTS_QUERY = `
*[_type == "project"] | order(_createdAt desc) {
  _id, title, subtitle, kicker, category, description, mainImage { asset-> }, link, tags, isFeatured, date
}`;

export const TESTIMONIALS_QUERY = `
*[_type == "testimonial"] | order(order asc) {
  _id, name, role, cohortYear, quote, avatarImage { asset-> }, isFeatured, order
}`;

export const PARTNERS_QUERY = `
*[_type == "partner"] | order(order asc) {
  _id, name, logo { asset-> }, websiteUrl, order
}`;

export const TEAM_MEMBERS_QUERY = `
*[_type == "teamMember"] | order(order asc) {
  _id, englishName, amharicName, name, role, department, departments, isBoardMember, isExecutiveLeader, isTeacher, teachingSubject, teachingPeriod, avatar { asset-> }, responsibilities, bio, quote, organizationAffiliations, socialLinks, order
}`;

export const STORY_MILESTONES_QUERY = `
*[_type == "storyMilestone"] | order(stepNumber asc) {
  _id, stepNumber, year, title, location, description, quote, image { asset-> }, highlights
}`;

export const EDUCATIONAL_PILLARS_QUERY = `
*[_type == "educationalPillar"] | order(pillarNumber asc) {
  _id, pillarNumber, title, titleAmharic, description, tags, iconType
}`;

export const GALLERY_QUERY = `
*[_type == "gallery"] | order(_createdAt desc) {
  _id, title, categoryTag, aspect, mediaType, image { asset-> }, externalVideoUrl, caption, location, date
}`;
