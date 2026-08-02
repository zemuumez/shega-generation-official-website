import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export default defineType({
  name: "event",
  title: "Event / Directory Gathering",
  icon: CalendarIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "type",
      title: "Event Type / Category",
      type: "string",
      description: "Category for this event (e.g., CTF, Hackathon, Hiking, Tour, Tech Training, Charity, or type a custom category).",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Event Date & Time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location / Venue",
      type: "string",
      placeholder: "e.g. Addis Ababa Science Museum",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image (Rectangular & Oval Thumbnail)",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "description",
      title: "Full Event Description (Shows in Modal Popup)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "isUpcoming",
      title: "Is Upcoming Event?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "registrationLink",
      title: "Registration / External Link URL",
      type: "string",
      placeholder: "e.g. /contact or https://eventbrite.com/...",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type", media: "coverImage" },
  },
});
