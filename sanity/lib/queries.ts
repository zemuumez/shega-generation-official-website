export const SITE_SETTINGS_QUERY = `
*[_type == "siteSettings"][0] {
  heroTitle,
  heroCaption,
  heroCtaPrimary,
  heroCtaSecondary,
  heroTitleBgImage,
  statementBannerTitle1,
  statementBannerTitle2,
  statementBannerTitle3,
  statementBannerImage,
  culturalAnchoringSubtitle,
  culturalAnchoringDescription,
  culturalAnchoringImage,
  pedagogicalTitle,
  pedagogicalDescription,
  curriculumTitle,
  curriculumDescription,
  journeysKicker,
  journeysTitle,
  journeysDescription,
  journeysCategories,
  testimonialsTitle,
  testimonialsDescription,
  eventsSectionKicker,
  eventsSectionTitle,
  eventsPageTitlePhrases,
  eventsPageSubtitle,
  eventsCategories,
  galleryPageTitlePhrases,
  galleryPageSubtitle,
  galleryCategories,
  partnersKicker,
  partnersHeadline,
  partnersDescription,
  communityKicker,
  communityTitle,
  communityDescription,
  socialFacebookHandle,
  socialFacebookUrl,
  socialTelegramHandle,
  socialTelegramUrl,
  socialTikTokHandle,
  socialTikTokUrl
}`;

export const UPCOMING_EVENT_QUERY = `
*[_type == "event" && isUpcoming == true] | order(eventDate asc) [0] {
  _id, title, type, slug, description, coverImage, eventDate, location, isUpcoming, registrationLink
}`;

export const ALL_EVENTS_QUERY = `
*[_type == "event"] | order(eventDate desc) {
  _id, title, type, slug, description, coverImage, eventDate, location, isUpcoming, registrationLink
}`;

export const FEATURED_COURSES_QUERY = `
*[_type == "course"] | order(sequenceOrder asc) {
  _id, title, instructor, badgeCategory, level, snippet, bannerImage, externalLmsUrl, sequenceOrder, rating, enrolledCount, tags
}`;

export const PROJECTS_QUERY = `
*[_type == "project"] | order(_createdAt desc) {
  _id, title, creatorName, cohortLocation, mediaOutlet, description, impactMetric, category, projectUrl, image, quote, techStack
}`;

export const TESTIMONIALS_QUERY = `
*[_type == "testimonial"] | order(_createdAt asc) {
  _id, quote, author, role, track, location, avatarImage
}`;

export const GALLERY_QUERY = `
*[_type == "gallery"] | order(_createdAt desc) {
  _id, image, caption, categoryTag
}`;

export const PARTNERS_QUERY = `
*[_type == "partner"] | order(order asc, _createdAt asc) {
  _id, name, role, description, logo, websiteUrl, order
}`;
