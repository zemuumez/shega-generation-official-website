import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

export default defineType({
  name: "project",
  title: "Student Media & Achievement",
  icon: RocketIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Coverage / Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "creatorName",
      title: "Student / Interviewee Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cohortLocation",
      title: "Cohort Location (e.g. Addis Ababa Cohort, Hawassa Hub)",
      type: "string",
    }),
    defineField({
      name: "mediaOutlet",
      title: "Media Outlet / Channel (e.g. Fana FM 98.1, Sheger FM, EBC Radio, Facebook Live)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Summary / Interview Highlights",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "impactMetric",
      title: "Key Highlight / Metric (e.g. Fana FM Radio Feature • 50K Listeners)",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category / Coverage Type",
      type: "string",
      options: {
        list: [
          "Radio Interview",
          "Podcast Feature",
          "Facebook Spotlight",
          "TV Broadcast",
          "Student Build & Venture",
          "Creative Kids (Ages 7–10)",
          "Astute Teens (Ages 11–13)",
          "Leader Youth (Ages 14–18)",
          "Student Project Lab",
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectUrl",
      title: "Media Link / Audio / Video / Post URL",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Cover Image / Studio Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "quote",
      title: "Student / Interviewee Quote",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "techStack",
      title: "Topics / Tags (e.g. Radio Feature, Python, AI, Scratch, Heritage)",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "creatorName", media: "image" },
  },
});
