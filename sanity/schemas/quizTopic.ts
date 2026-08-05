import { defineField, defineType } from "sanity";
import { FolderIcon } from "@sanity/icons";

export default defineType({
  name: "quizTopic",
  title: "Quiz Topics & Domains",
  type: "document",
  icon: FolderIcon,
  fields: [
    defineField({
      name: "title",
      title: "Topic Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Topic Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "orderIndex",
      title: "Order Index",
      type: "number",
      initialValue: 1,
      description: "Sequential integer for ordering topics in live control deck.",
    }),
    defineField({
      name: "isActive",
      title: "Is Active Topic",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      order: "orderIndex",
      active: "isActive",
    },
    prepare({ title, order, active }) {
      return {
        title: title || "Untitled Topic",
        subtitle: `Order: ${order || 1} • Status: ${active ? "Active" : "Disabled"}`,
      };
    },
  },
});
