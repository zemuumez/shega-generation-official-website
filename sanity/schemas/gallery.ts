import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  name: "gallery",
  title: "Gallery Item",
  icon: ImageIcon,
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text", validation: (Rule) => Rule.required() }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "categoryTag",
      title: "Category tag",
      type: "string",
      options: {
        list: ["Expeditions", "Hackathons", "Classroom", "Volunteer-Work"],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "categoryTag", media: "image" },
  },
});
