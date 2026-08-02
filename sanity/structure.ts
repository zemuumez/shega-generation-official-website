import { StructureResolver } from "sanity/desk";
import {
  HomeIcon,
  CalendarIcon,
  ImageIcon,
  BookIcon,
  RocketIcon,
  CommentIcon,
  UserIcon,
  CogIcon,
  FolderIcon,
  SparklesIcon,
  EnvelopeIcon,
  UsersIcon,
  CreditCardIcon,
  HelpCircleIcon,
} from "@sanity/icons";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .id("studioContent")
    .title("Studio Content")
    .items([
      // 1. HOME PAGE
      S.listItem()
        .id("homePageSection")
        .title("Home Page")
        .icon(HomeIcon)
        .child(
          S.list()
            .id("homePageList")
            .title("Home Page Sections")
            .items([
              S.listItem()
                .id("homePageCopySettings")
                .title("Page Copy & Section Titles")
                .icon(CogIcon)
                .child(
                  S.document()
                    .id("homeSiteSettingsDoc")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Home Page Copy & Settings")
                ),
              S.divider(),
              S.listItem()
                .id("homeUpcomingEventItem")
                .title("The Nearest Gathering / Upcoming Event")
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .id("homeUpcomingEventDocList")
                    .title("Upcoming Event (Nearest Gathering)")
                    .filter('_type == "event" && isUpcoming == true')
                ),
              S.listItem()
                .id("homeCoursesItem")
                .title("Curriculum Courses Section")
                .icon(BookIcon)
                .child(
                  S.documentTypeList("course")
                    .id("homeCourseTypeList")
                    .title("Curriculum Courses")
                    .defaultOrdering([{ field: "sequenceOrder", direction: "asc" }])
                ),
              S.listItem()
                .id("homeProjectsItem")
                .title("Student Journeys & Ventures Section")
                .icon(RocketIcon)
                .child(
                  S.documentTypeList("project")
                    .id("homeProjectTypeList")
                    .title("Student Projects & Ventures")
                ),
              S.listItem()
                .id("homeTestimonialsItem")
                .title("Alumni Testimonials Section")
                .icon(CommentIcon)
                .child(
                  S.documentTypeList("testimonial")
                    .id("homeTestimonialTypeList")
                    .title("Alumni Testimonials")
                ),
              S.listItem()
                .id("homePartnersItem")
                .title("Strategic Partners Section")
                .icon(UsersIcon)
                .child(
                  S.documentTypeList("partner")
                    .id("homePartnerTypeList")
                    .title("Strategic Institutional Partners")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
            ])
        ),

      // 2. EVENTS PAGE
      S.listItem()
        .id("eventsPageSection")
        .title("Events Page")
        .icon(CalendarIcon)
        .child(
          S.list()
            .id("eventsPageList")
            .title("Events Page Sections")
            .items([
              S.listItem()
                .id("eventsPageCopySettings")
                .title("Page Copy & Section Titles")
                .icon(CogIcon)
                .child(
                  S.document()
                    .id("eventsSiteSettingsDoc")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Events Page Copy & Settings")
                ),
              S.divider(),
              S.listItem()
                .id("upcomingEventsItem")
                .title("Upcoming Events")
                .icon(SparklesIcon)
                .child(
                  S.documentList()
                    .id("upcomingEventsDocList")
                    .title("Upcoming Events")
                    .filter('_type == "event" && isUpcoming == true')
                ),
              S.listItem()
                .id("pastEventsItem")
                .title("Past Gatherings")
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .id("pastEventsDocList")
                    .title("Past Events")
                    .filter('_type == "event" && isUpcoming != true')
                ),
              S.divider(),
              S.listItem()
                .id("allEventsItem")
                .title("All Events Directory")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("event")
                    .id("allEventsTypeList")
                    .title("All Events")
                ),
            ])
        ),

      // 3. ABOUT PAGE
      S.listItem()
        .id("aboutPageSection")
        .title("About Us Page")
        .icon(UserIcon)
        .child(
          S.list()
            .id("aboutPageList")
            .title("About Page Content")
            .items([
              S.listItem()
                .id("aboutHeroSectionItem")
                .title("Page Copy & Section Titles")
                .icon(CogIcon)
                .child(
                  S.document()
                    .id("aboutSiteSettingsDoc")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("About Us Page Copy & Settings")
                ),
              S.listItem()
                .id("storyMilestonesItem")
                .title("Journey & Story Milestones (2021-2026+)")
                .icon(RocketIcon)
                .child(
                  S.documentTypeList("storyMilestone")
                    .id("storyMilestonesTypeList")
                    .title("Journey Milestones")
                    .defaultOrdering([{ field: "stepNumber", direction: "asc" }])
                ),
              S.listItem()
                .id("educationalPillarsItem")
                .title("Holistic Education (4 Pillars)")
                .icon(BookIcon)
                .child(
                  S.documentTypeList("educationalPillar")
                    .id("educationalPillarsTypeList")
                    .title("Holistic Educational Pillars")
                    .defaultOrdering([{ field: "pillarNumber", direction: "asc" }])
                ),
              S.listItem()
                .id("teamMembersItem")
                .title("Organization & Governance Directory")
                .icon(UsersIcon)
                .child(
                  S.list()
                    .id("teamMembersListSub")
                    .title("Organization Directory Categories")
                    .items([
                      S.listItem()
                        .id("boardMembersItem")
                        .title("1. Board of Directors / Council Governance")
                        .icon(UserIcon)
                        .child(
                          S.documentList()
                            .id("boardMembersDocList")
                            .title("Board of Directors / Council Governance")
                            .filter('_type == "teamMember" && (isBoardMember == true || "board" in departments || department == "board")')
                            .defaultOrdering([{ field: "order", direction: "asc" }])
                        ),
                      S.listItem()
                        .id("execMembersItem")
                        .title("2. Executive & Operational Leadership")
                        .icon(UserIcon)
                        .child(
                          S.documentList()
                            .id("execMembersDocList")
                            .title("Executive & Operational Leadership")
                            .filter('_type == "teamMember" && (isExecutiveLeader == true || "executive" in departments || department == "executive")')
                            .defaultOrdering([{ field: "order", direction: "asc" }])
                        ),
                      S.listItem()
                        .id("teacherMembersItem")
                        .title("3. Instructors & Teachers")
                        .icon(BookIcon)
                        .child(
                          S.documentList()
                            .id("teacherMembersDocList")
                            .title("Instructors & Teachers")
                            .filter('_type == "teamMember" && (isTeacher == true || "tech" in departments || department == "tech")')
                            .defaultOrdering([{ field: "order", direction: "asc" }])
                        ),
                      S.divider(),
                      S.listItem()
                        .id("allTeamMembersItem")
                        .title("All Leadership, Instructors & Mentors")
                        .icon(FolderIcon)
                        .child(
                          S.documentTypeList("teamMember")
                            .id("teamMembersTypeList")
                            .title("All Team Members & Leadership")
                            .defaultOrdering([{ field: "order", direction: "asc" }])
                        ),
                    ])
                ),
            ])
        ),

      // 4. GALLERY PAGE
      S.listItem()
        .id("galleryPageSection")
        .title("Gallery Page")
        .icon(ImageIcon)
        .child(
          S.list()
            .id("galleryPageList")
            .title("Gallery Collections & Settings")
            .items([
              S.listItem()
                .id("galleryPageCopySettings")
                .title("Page Copy & Section Titles")
                .icon(CogIcon)
                .child(
                  S.document()
                    .id("gallerySiteSettingsDoc")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Gallery Page Copy & Settings")
                ),
              S.divider(),
              S.listItem()
                .id("allGalleryItemsSection")
                .title("All Gallery Collections / Albums")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("gallery")
                    .id("allGalleryTypeList")
                    .title("All Gallery Collections & Albums")
                ),
              S.divider(),
              S.listItem()
                .id("expeditionsGalleryItem")
                .title("Expeditions Collections")
                .child(
                  S.documentList()
                    .id("expeditionsGalleryDocList")
                    .title("Expeditions Collections")
                    .filter('_type == "gallery" && categoryTag == "Expeditions"')
                ),
              S.listItem()
                .id("hackathonsGalleryItem")
                .title("Hackathons Collections")
                .child(
                  S.documentList()
                    .id("hackathonsGalleryDocList")
                    .title("Hackathons Collections")
                    .filter('_type == "gallery" && categoryTag == "Hackathons"')
                ),
              S.listItem()
                .id("classroomGalleryItem")
                .title("Classroom Collections")
                .child(
                  S.documentList()
                    .id("classroomGalleryDocList")
                    .title("Classroom Collections")
                    .filter('_type == "gallery" && categoryTag == "Classroom"')
                ),
              S.listItem()
                .id("volunteerGalleryItem")
                .title("Volunteer Work Collections")
                .child(
                  S.documentList()
                    .id("volunteerGalleryDocList")
                    .title("Volunteer Work Collections")
                    .filter('_type == "gallery" && categoryTag == "Volunteer-Work"')
                ),
            ])
        ),


      // 5. STUDENT APPLICATIONS
      S.listItem()
        .id("studentApplicationsSection")
        .title("Student Applications")
        .icon(UserIcon)
        .child(
          S.list()
            .id("studentApplicationsList")
            .title("Applications by Status")
            .items([
              S.listItem()
                .id("pendingApplicationsItem")
                .title("Pending Review")
                .child(
                  S.documentList()
                    .id("pendingApplicationsDocList")
                    .title("Pending Applications")
                    .filter('_type == "studentApplication" && assessmentStatus == "Pending"')
                ),
              S.listItem()
                .id("diagnosticSentApplicationsItem")
                .title("Diagnostic Sent")
                .child(
                  S.documentList()
                    .id("diagnosticSentDocList")
                    .title("Diagnostic Sent")
                    .filter('_type == "studentApplication" && assessmentStatus == "Diagnostic Sent"')
                ),
              S.listItem()
                .id("approvedApplicationsItem")
                .title("Approved")
                .child(
                  S.documentList()
                    .id("approvedApplicationsDocList")
                    .title("Approved Applications")
                    .filter('_type == "studentApplication" && assessmentStatus == "Approved"')
                ),
              S.divider(),
              S.listItem()
                .id("allApplicationsItem")
                .title("All Applications")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("studentApplication")
                    .id("allApplicationsTypeList")
                    .title("All Applications")
                ),
            ])
        ),

      // 6. CONTACT INQUIRIES & MESSAGES
      S.listItem()
        .id("contactMessagesSection")
        .title("Contact Messages")
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .id("contactMessagesList")
            .title("Messages by Status")
            .items([
              S.listItem()
                .id("contactPageCopySettings")
                .title("Page Copy & Section Titles")
                .icon(CogIcon)
                .child(
                  S.document()
                    .id("contactSiteSettingsDoc")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Contact Page Copy & Settings")
                ),
              S.divider(),
              S.listItem()
                .id("newMessagesItem")
                .title("New Messages")
                .child(
                  S.documentList()
                    .id("newMessagesDocList")
                    .title("New Contact Messages")
                    .filter('_type == "contactMessage" && status == "New"')
                ),
              S.listItem()
                .id("inProgressMessagesItem")
                .title("In Progress")
                .child(
                  S.documentList()
                    .id("inProgressDocList")
                    .title("In Progress Messages")
                    .filter('_type == "contactMessage" && status == "In Progress"')
                ),
              S.listItem()
                .id("resolvedMessagesItem")
                .title("Resolved / Replied")
                .child(
                  S.documentList()
                    .id("resolvedDocList")
                    .title("Resolved Messages")
                    .filter('_type == "contactMessage" && status == "Resolved"')
                ),
              S.divider(),
              S.listItem()
                .id("allMessagesItem")
                .title("All Contact Messages")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("contactMessage")
                    .id("allContactMessagesTypeList")
                    .title("All Messages")
                ),
            ])
        ),

      // 7. DONATIONS & PAYMENTS
      S.listItem()
        .id("donationsSection")
        .title("Donation Records")
        .icon(CreditCardIcon)
        .child(
          S.list()
            .id("donationsList")
            .title("Donations by Status")
            .items([
              S.listItem()
                .id("successfulDonationsItem")
                .title("Successful / Completed")
                .child(
                  S.documentList()
                    .id("successfulDonationsDocList")
                    .title("Successful Donations")
                    .filter('_type == "donationRecord" && status == "success"')
                ),
              S.listItem()
                .id("pendingDonationsItem")
                .title("Pending")
                .child(
                  S.documentList()
                    .id("pendingDonationsDocList")
                    .title("Pending Donations")
                    .filter('_type == "donationRecord" && status == "pending"')
                ),
              S.listItem()
                .id("failedDonationsItem")
                .title("Failed")
                .child(
                  S.documentList()
                    .id("failedDonationsDocList")
                    .title("Failed Donations")
                    .filter('_type == "donationRecord" && status == "failed"')
                ),
              S.divider(),
              S.listItem()
                .id("allDonationsItem")
                .title("All Donation Records")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("donationRecord")
                    .id("allDonationsTypeList")
                    .title("All Donations")
                ),
            ])
        ),

      S.divider(),

      // 8. CHALLENGES & QUIZZES
      S.listItem()
        .id("challengesPageSection")
        .title("Challenges & Arena")
        .icon(HelpCircleIcon)
        .child(
          S.list()
            .id("challengesPageList")
            .title("Challenges & Arena Management")
            .items([
              S.listItem()
                .id("challengesNavSettings")
                .title("Challenges Page Copy & Nav Settings")
                .icon(CogIcon)
                .child(
                  S.document()
                    .id("challengesSiteSettingsDoc")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Challenges Copy & Nav Settings")
                ),
              S.divider(),
              S.listItem()
                .id("challengesQuizzesList")
                .title("Quizzes & Timered Q&A")
                .icon(HelpCircleIcon)
                .child(
                  S.documentTypeList("challengeQuiz")
                    .id("dtChallengeQuizList")
                    .title("All Quizzes & Challenges")
                ),
              S.listItem()
                .id("challengesSubmissionsList")
                .title("Leaderboard Submissions")
                .icon(UserIcon)
                .child(
                  S.documentTypeList("challengeSubmission")
                    .id("dtChallengeSubmissionList")
                    .title("Participant Leaderboard Entries")
                    .defaultOrdering([{ field: "score", direction: "desc" }])
                ),
            ])
        ),

      S.divider(),

      // 9. ALL CONTENT COLLECTIONS
      S.listItem()
        .id("allCollectionsSection")
        .title("All Content Collections")
        .icon(FolderIcon)
        .child(
          S.list()
            .id("allCollectionsList")
            .title("Content Types")
            .items([
              S.documentTypeListItem("course").id("dtCourse").title("Courses").icon(BookIcon),
              S.documentTypeListItem("event").id("dtEvent").title("Events").icon(CalendarIcon),
              S.documentTypeListItem("gallery").id("dtGallery").title("Gallery Items").icon(ImageIcon),
              S.documentTypeListItem("project").id("dtProject").title("Student Projects").icon(RocketIcon),
              S.documentTypeListItem("testimonial").id("dtTestimonial").title("Alumni Testimonials").icon(CommentIcon),
              S.documentTypeListItem("teamMember").id("dtTeamMember").title("Team Members & Leadership").icon(UsersIcon),
              S.documentTypeListItem("storyMilestone").id("dtStoryMilestone").title("Journey & Story Milestones").icon(RocketIcon),
              S.documentTypeListItem("educationalPillar").id("dtEducationalPillar").title("Educational Pillars").icon(BookIcon),
              S.documentTypeListItem("studentApplication").id("dtStudentApplication").title("Student Applications").icon(UserIcon),
              S.documentTypeListItem("contactMessage").id("dtContactMessage").title("Contact Messages").icon(EnvelopeIcon),
              S.documentTypeListItem("donationRecord").id("dtDonationRecord").title("Donation Records").icon(CreditCardIcon),
              S.documentTypeListItem("challengeQuiz").id("dtChallengeQuiz").title("Quizzes & Challenges").icon(HelpCircleIcon),
              S.documentTypeListItem("challengeSubmission").id("dtChallengeSubmission").title("Leaderboard Submissions").icon(UserIcon),
            ])
        ),

      // 9. GLOBAL SITE SETTINGS
      S.listItem()
        .id("globalSiteSettingsSection")
        .title("Global Theme & Brand Colors")
        .icon(CogIcon)
        .child(
          S.document()
            .id("globalThemeSettingsDoc")
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Global Theme & Brand Colors")
        ),
    ]);
