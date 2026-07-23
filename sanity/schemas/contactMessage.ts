import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export default defineType({
  name: "contactMessage",
  title: "Contact Message",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Sender Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Sender Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subject",
      title: "Subject / Category",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message Body",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "New" },
          { title: "In Progress", value: "In Progress" },
          { title: "Resolved / Replied", value: "Resolved" },
        ],
        layout: "radio",
      },
      initialValue: "New",
    }),
    defineField({
      name: "submittedAt",
      title: "Submission Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "subject",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Anonymous Contact",
        subtitle: subtitle || "General Inquiry",
      };
    },
  },
});
