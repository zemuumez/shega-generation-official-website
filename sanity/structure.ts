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
  AddCommentIcon,
  UsersIcon,
} from "@sanity/icons";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Studio Content")
    .items([
      // 1. HOME PAGE
      S.listItem()
        .title("Home Page")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Home Page Sections")
            .items([
              S.listItem()
                .title("Page Copy & Section Titles")
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Home Page Copy & Settings")
                ),
              S.divider(),
              S.listItem()
                .title("The Nearest Gathering / Upcoming Event")
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title("Upcoming Event (Nearest Gathering)")
                    .filter('_type == "event" && isUpcoming == true')
                ),
              S.listItem()
                .title("Curriculum Courses Section")
                .icon(BookIcon)
                .child(
                  S.documentTypeList("course")
                    .title("Curriculum Courses")
                    .defaultOrdering([{ field: "sequenceOrder", direction: "asc" }])
                ),
              S.listItem()
                .title("Student Journeys & Ventures Section")
                .icon(RocketIcon)
                .child(
                  S.documentTypeList("project")
                    .title("Student Projects & Ventures")
                ),
              S.listItem()
                .title("Alumni Testimonials Section")
                .icon(CommentIcon)
                .child(
                  S.documentTypeList("testimonial")
                    .title("Alumni Testimonials")
                ),
              S.listItem()
                .title("Strategic Partners Section")
                .icon(UsersIcon)
                .child(
                  S.documentTypeList("partner")
                    .title("Strategic Institutional Partners")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
            ])
        ),

      // 2. EVENTS PAGE
      S.listItem()
        .title("Events Page")
        .icon(CalendarIcon)
        .child(
          S.list()
            .title("Events Page Sections")
            .items([
              S.listItem()
                .title("Upcoming Events")
                .icon(SparklesIcon)
                .child(
                  S.documentList()
                    .title("Upcoming Events")
                    .filter('_type == "event" && isUpcoming == true')
                ),
              S.listItem()
                .title("Past Gatherings")
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title("Past Events")
                    .filter('_type == "event" && isUpcoming != true')
                ),
              S.divider(),
              S.listItem()
                .title("All Events Directory")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("event")
                    .title("All Events")
                ),
            ])
        ),

      // 3. GALLERY PAGE
      S.listItem()
        .title("Gallery Page")
        .icon(ImageIcon)
        .child(
          S.list()
            .title("Gallery Sections by Category")
            .items([
              S.listItem()
                .title("Expeditions Gallery")
                .child(
                  S.documentList()
                    .title("Expeditions Gallery")
                    .filter('_type == "gallery" && categoryTag == "Expeditions"')
                ),
              S.listItem()
                .title("Hackathons Gallery")
                .child(
                  S.documentList()
                    .title("Hackathons Gallery")
                    .filter('_type == "gallery" && categoryTag == "Hackathons"')
                ),
              S.listItem()
                .title("Classroom Gallery")
                .child(
                  S.documentList()
                    .title("Classroom Gallery")
                    .filter('_type == "gallery" && categoryTag == "Classroom"')
                ),
              S.listItem()
                .title("Volunteer Work Gallery")
                .child(
                  S.documentList()
                    .title("Volunteer Work Gallery")
                    .filter('_type == "gallery" && categoryTag == "Volunteer-Work"')
                ),
              S.divider(),
              S.listItem()
                .title("All Media Items")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("gallery")
                    .title("All Gallery Items")
                ),
            ])
        ),

      // 4. STUDENT APPLICATIONS
      S.listItem()
        .title("Student Applications")
        .icon(UserIcon)
        .child(
          S.list()
            .title("Applications by Status")
            .items([
              S.listItem()
                .title("Pending Review")
                .child(
                  S.documentList()
                    .title("Pending Applications")
                    .filter('_type == "studentApplication" && assessmentStatus == "Pending"')
                ),
              S.listItem()
                .title("Diagnostic Sent")
                .child(
                  S.documentList()
                    .title("Diagnostic Sent")
                    .filter('_type == "studentApplication" && assessmentStatus == "Diagnostic Sent"')
                ),
              S.listItem()
                .title("Approved")
                .child(
                  S.documentList()
                    .title("Approved Applications")
                    .filter('_type == "studentApplication" && assessmentStatus == "Approved"')
                ),
              S.divider(),
              S.listItem()
                .title("All Applications")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("studentApplication")
                    .title("All Applications")
                ),
            ])
        ),

      // 5. CONTACT INQUIRIES & MESSAGES
      S.listItem()
        .title("Contact Messages")
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title("Messages by Status")
            .items([
              S.listItem()
                .title("New Messages")
                .child(
                  S.documentList()
                    .title("New Contact Messages")
                    .filter('_type == "contactMessage" && status == "New"')
                ),
              S.listItem()
                .title("In Progress")
                .child(
                  S.documentList()
                    .title("In Progress Messages")
                    .filter('_type == "contactMessage" && status == "In Progress"')
                ),
              S.listItem()
                .title("Resolved / Replied")
                .child(
                  S.documentList()
                    .title("Resolved Messages")
                    .filter('_type == "contactMessage" && status == "Resolved"')
                ),
              S.divider(),
              S.listItem()
                .title("All Contact Messages")
                .icon(FolderIcon)
                .child(
                  S.documentTypeList("contactMessage")
                    .title("All Messages")
                ),
            ])
        ),

      S.divider(),

      // 6. ALL CONTENT COLLECTIONS
      S.listItem()
        .title("All Content Collections")
        .icon(FolderIcon)
        .child(
          S.list()
            .title("Content Types")
            .items([
              S.documentTypeListItem("course").title("Courses").icon(BookIcon),
              S.documentTypeListItem("event").title("Events").icon(CalendarIcon),
              S.documentTypeListItem("gallery").title("Gallery Items").icon(ImageIcon),
              S.documentTypeListItem("project").title("Student Projects").icon(RocketIcon),
              S.documentTypeListItem("testimonial").title("Alumni Testimonials").icon(CommentIcon),
              S.documentTypeListItem("partner").title("Strategic Partners").icon(UsersIcon),
              S.documentTypeListItem("studentApplication").title("Student Applications").icon(UserIcon),
              S.documentTypeListItem("contactMessage").title("Contact Messages").icon(EnvelopeIcon),
            ])
        ),

      // 7. GLOBAL SITE SETTINGS
      S.listItem()
        .title("Global Site Settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Global Site Settings")
        ),
    ]);
