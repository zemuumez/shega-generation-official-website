import { defineField, defineType } from "sanity";

const ETHIOPIAN_REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "South West Ethiopia Peoples'",
  "Tigray",
  "Central Ethiopia",
];

export default defineType({
  name: "studentApplication",
  title: "Student Application",
  type: "document",
  // Applications are created only by the server-side onboarding API using a
  // scoped write token. This document type should never be editable through
  // a public-facing form that writes with a browser-exposed token.
  fields: [
    defineField({ name: "fullName", title: "Full name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "email" }),
    }),
    defineField({ name: "phoneNumber", title: "Phone number", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      options: { list: ETHIOPIAN_REGIONS, layout: "dropdown" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "primaryInterest",
      title: "Primary interest",
      type: "string",
      options: {
        list: ["AI/ML", "Web Development", "Mobile Development", "DevOps", "Life Skills", "Indigenous Knowledge"],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "preferredLocale",
      title: "Preferred locale",
      type: "string",
      description: "Language for the diagnostic assessment and follow-up email.",
      options: { list: ["am", "en", "om", "ti"], layout: "dropdown" },
      initialValue: "am",
    }),
    defineField({ name: "personalSummary", title: "Personal summary", type: "text", rows: 4 }),
    defineField({
      name: "assessmentStatus",
      title: "Assessment status",
      type: "string",
      options: { list: ["Pending", "Diagnostic Sent", "Approved"], layout: "radio" },
      initialValue: "Pending",
      readOnly: ({ currentUser }) =>
        !currentUser?.roles?.some((r) => r.name === "administrator" || r.name === "editor"),
    }),
  ],
  preview: {
    select: { title: "fullName", subtitle: "assessmentStatus" },
  },
});
