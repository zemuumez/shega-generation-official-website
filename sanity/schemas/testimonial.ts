import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Alumni Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "author", title: "Author Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", title: "Role / Current Position", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "track", title: "Track / Program", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "location", title: "Cohort Location", type: "string" }),
    defineField({
      name: "avatarImage",
      title: "Avatar Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "role", media: "avatarImage" },
  },
});
