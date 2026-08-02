import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

export default defineType({
  name: "course",
  title: "Course",
  icon: BookIcon,
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "instructor", title: "Instructor", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "badgeCategory",
      title: "Badge category",
      type: "string",
      options: {
        list: ["Tech Orientation", "Life Skills", "Indigenous Knowledge"],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "level", title: "Difficulty / Duration Level", type: "string" }),
    defineField({ name: "snippet", title: "Snippet Description", type: "text", rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({
      name: "bannerImage",
      title: "Banner image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),

    defineField({
      name: "externalLmsUrl",
      title: "External LMS URL",
      type: "url",
      description: "Direct deep link into the LMS module.",
    }),
    defineField({ name: "sequenceOrder", title: "Sequence order", type: "number" }),
    defineField({ name: "rating", title: "Rating (e.g. 4.9)", type: "string" }),
    defineField({ name: "enrolledCount", title: "Enrolled Students Count", type: "number" }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  orderings: [{ title: "Sequence order", name: "sequenceOrderAsc", by: [{ field: "sequenceOrder", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "badgeCategory", media: "bannerImage" },
  },
});
