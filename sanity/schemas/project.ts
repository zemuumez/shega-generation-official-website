import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

export default defineType({
  name: "project",
  title: "Student Journey & Venture",
  icon: RocketIcon,
  type: "document",
  fields: [
    defineField({ name: "title", title: "Project Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "creatorName", title: "Creator Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "cohortLocation", title: "Cohort Location (e.g. Hawassa Cohort)", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "impactMetric", title: "Impact Metric (e.g. 14 Unions Connected)", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Venture Startup", "Open-Source AI", "Offline Agritech", "UI Framework", "HealthTech", "Student Project", "Alumni Startup", "Social Venture"],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "projectUrl", title: "Project URL", type: "url" }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "quote", title: "Creator Quote", type: "text", rows: 2 }),
    defineField({
      name: "techStack",
      title: "Tech Stack Technologies",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "creatorName", media: "image" },
  },
});
