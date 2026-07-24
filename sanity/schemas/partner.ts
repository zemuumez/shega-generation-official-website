import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export default defineType({
  name: "partner",
  title: "Strategic Partner",
  icon: UsersIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Partner Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Partnership Role / Tag",
      type: "string",
      description: "e.g. Advanced Coding & Robotics Partner, Facility & Venue Partner",
    }),
    defineField({
      name: "description",
      title: "Partnership Description / Caption",
      type: "text",
      rows: 3,
      description: "Caption shown when user hovers or focuses on this partner logo",
    }),
    defineField({
      name: "logo",
      title: "Partner Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "websiteUrl",
      title: "Partner Website / Profile URL",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "logo",
    },
  },
});
