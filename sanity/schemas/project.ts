import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Student Journey",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "creatorName", title: "Creator name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Student Project", "Alumni Startup", "Employment Placement", "Social Venture"],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "projectUrl", title: "Project URL", type: "url" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text", validation: (Rule) => Rule.required() }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "creatorName", media: "image" },
  },
});
