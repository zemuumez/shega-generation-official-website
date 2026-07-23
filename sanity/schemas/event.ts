import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export default defineType({
  name: "event",
  title: "Event",
  icon: CalendarIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "type",
      title: "Event type",
      type: "string",
      options: {
        list: ["CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity", "Advertisements"],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text", validation: (Rule) => Rule.required() }],
    }),
    defineField({
      name: "eventDate",
      title: "Event date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isUpcoming",
      title: "Is upcoming",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "registrationLink",
      title: "Registration link",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type", media: "coverImage" },
  },
});
