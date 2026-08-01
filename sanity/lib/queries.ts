export const SITE_SETTINGS_QUERY = `
{
  "themePreset": *[_type == "siteSettings"][0].themePreset,
  "customPrimaryColor": *[_type == "siteSettings"][0].customPrimaryColor,
  "customPrimaryLightColor": *[_type == "siteSettings"][0].customPrimaryLightColor,
  "customPrimaryDarkColor": *[_type == "siteSettings"][0].customPrimaryDarkColor,
  "customSecondaryColor": *[_type == "siteSettings"][0].customSecondaryColor,
  "customSecondaryLightColor": *[_type == "siteSettings"][0].customSecondaryLightColor,
  "customBgColor": *[_type == "siteSettings"][0].customBgColor,
  "customTextColor": *[_type == "siteSettings"][0].customTextColor,
  "socialFacebookHandle": *[_type == "siteSettings"][0].socialFacebookHandle,
  "socialFacebookUrl": *[_type == "siteSettings"][0].socialFacebookUrl,
  "socialTelegramHandle": *[_type == "siteSettings"][0].socialTelegramHandle,
  "socialTelegramUrl": *[_type == "siteSettings"][0].socialTelegramUrl,
  "socialTikTokHandle": *[_type == "siteSettings"][0].socialTikTokHandle,
  "socialTikTokUrl": *[_type == "siteSettings"][0].socialTikTokUrl,

  // Home Page Settings (falls back to siteSettings if not set)
  "heroTitle": coalesce(*[_type == "homePageSettings"][0].heroTitle, *[_type == "siteSettings"][0].heroTitle),
  "heroCaption": coalesce(*[_type == "homePageSettings"][0].heroCaption, *[_type == "siteSettings"][0].heroCaption),
  "heroCtaPrimary": coalesce(*[_type == "homePageSettings"][0].heroCtaPrimary, *[_type == "siteSettings"][0].heroCtaPrimary),
  "heroCtaSecondary": coalesce(*[_type == "homePageSettings"][0].heroCtaSecondary, *[_type == "siteSettings"][0].heroCtaSecondary),
  "heroTitleBgImage": coalesce(*[_type == "homePageSettings"][0].heroTitleBgImage, *[_type == "siteSettings"][0].heroTitleBgImage),
  "statementBannerTitle1": coalesce(*[_type == "homePageSettings"][0].statementBannerTitle1, *[_type == "siteSettings"][0].statementBannerTitle1),
  "statementBannerTitle2": coalesce(*[_type == "homePageSettings"][0].statementBannerTitle2, *[_type == "siteSettings"][0].statementBannerTitle2),
  "statementBannerTitle3": coalesce(*[_type == "homePageSettings"][0].statementBannerTitle3, *[_type == "siteSettings"][0].statementBannerTitle3),
  "statementBannerImage": coalesce(*[_type == "homePageSettings"][0].statementBannerImage, *[_type == "siteSettings"][0].statementBannerImage),
  "culturalAnchoringSubtitle": coalesce(*[_type == "homePageSettings"][0].culturalAnchoringSubtitle, *[_type == "siteSettings"][0].culturalAnchoringSubtitle),
  "culturalAnchoringDescription": coalesce(*[_type == "homePageSettings"][0].culturalAnchoringDescription, *[_type == "siteSettings"][0].culturalAnchoringDescription),
  "culturalAnchoringImage": coalesce(*[_type == "homePageSettings"][0].culturalAnchoringImage, *[_type == "siteSettings"][0].culturalAnchoringImage),
  "pedagogicalTitle": coalesce(*[_type == "homePageSettings"][0].pedagogicalTitle, *[_type == "siteSettings"][0].pedagogicalTitle),
  "pedagogicalDescription": coalesce(*[_type == "homePageSettings"][0].pedagogicalDescription, *[_type == "siteSettings"][0].pedagogicalDescription),
  "curriculumTitle": coalesce(*[_type == "homePageSettings"][0].curriculumTitle, *[_type == "siteSettings"][0].curriculumTitle),
  "curriculumDescription": coalesce(*[_type == "homePageSettings"][0].curriculumDescription, *[_type == "siteSettings"][0].curriculumDescription),

  // About Page Settings (falls back to siteSettings if not set)
  "aboutHeroKicker": coalesce(*[_type == "aboutPageSettings"][0].aboutHeroKicker, *[_type == "siteSettings"][0].aboutHeroKicker),
  "aboutPageTitlePhrases": coalesce(*[_type == "aboutPageSettings"][0].aboutPageTitlePhrases, *[_type == "siteSettings"][0].aboutPageTitlePhrases),
  "aboutPageSubtitle": coalesce(*[_type == "aboutPageSettings"][0].aboutPageSubtitle, *[_type == "siteSettings"][0].aboutPageSubtitle),
  "aboutHeroStats": coalesce(*[_type == "aboutPageSettings"][0].aboutHeroStats, *[_type == "siteSettings"][0].aboutHeroStats),
  "aboutPillarsTitle": coalesce(*[_type == "aboutPageSettings"][0].aboutPillarsTitle, *[_type == "siteSettings"][0].aboutPillarsTitle),
  "aboutPillarsSubtitle": coalesce(*[_type == "aboutPageSettings"][0].aboutPillarsSubtitle, *[_type == "siteSettings"][0].aboutPillarsSubtitle),
  "aboutCampusVisionText": coalesce(*[_type == "aboutPageSettings"][0].aboutCampusVisionText, *[_type == "siteSettings"][0].aboutCampusVisionText),
  "orgStructureTitle": coalesce(*[_type == "aboutPageSettings"][0].orgStructureTitle, *[_type == "siteSettings"][0].orgStructureTitle),
  "orgStructureSubtitle": coalesce(*[_type == "aboutPageSettings"][0].orgStructureSubtitle, *[_type == "siteSettings"][0].orgStructureSubtitle),

  // Gallery Page Settings
  "galleryPageTitlePhrases": coalesce(*[_type == "galleryPageSettings"][0].galleryPageTitlePhrases, *[_type == "siteSettings"][0].galleryPageTitlePhrases),
  "galleryPageSubtitle": coalesce(*[_type == "galleryPageSettings"][0].galleryPageSubtitle, *[_type == "siteSettings"][0].galleryPageSubtitle),
  "galleryCategories": coalesce(*[_type == "galleryPageSettings"][0].galleryCategories, *[_type == "siteSettings"][0].galleryCategories)
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

export const TEAM_MEMBERS_QUERY = `
*[_type == "teamMember"] | order(order asc, _createdAt asc) {
  _id, name, englishName, amharicName, role, department, departments, isBoardMember, isExecutiveLeader, isTeacher, teachingSubject, teachingPeriod, responsibilities, bio, quote, avatar, organizationAffiliations, socialLinks, order
}`;

export const STORY_MILESTONES_QUERY = `
*[_type == "storyMilestone"] | order(stepNumber asc) {
  _id, stepNumber, year, title, location, description, quote, image, highlights
}`;

export const EDUCATIONAL_PILLARS_QUERY = `
*[_type == "educationalPillar"] | order(pillarNumber asc) {
  _id, pillarNumber, title, titleAmharic, description, tags, iconType
}`;

