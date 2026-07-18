import { defineField, defineType } from "sanity";

export default defineType({
  name: "course",
  title: "Course",
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
    defineField({ name: "snippet", title: "Snippet", type: "string", validation: (Rule) => Rule.max(140) }),
    defineField({
      name: "bannerImage",
      title: "Banner image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text", validation: (Rule) => Rule.required() }],
    }),
    defineField({
      name: "externalLmsUrl",
      title: "External LMS URL",
      type: "url",
      description: "Direct deep link into the LMS module. Card clicks redirect here.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "sequenceOrder", title: "Sequence order", type: "number" }),
  ],
  orderings: [{ title: "Sequence order", name: "sequenceOrderAsc", by: [{ field: "sequenceOrder", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "badgeCategory", media: "bannerImage" },
  },
});
