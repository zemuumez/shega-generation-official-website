import { defineArrayMember, defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  name: "gallery",
  title: "Gallery Collection / Album",
  icon: ImageIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Album / Group Title",
      type: "string",
      description: "Title for this photo collection (e.g. 'INSA & AI Institute Tour', 'Hawassa Expedition 2024')",
      validation: (Rule) => Rule.warning("Title is recommended for album grouping."),
    }),
    defineField({
      name: "categoryTag",
      title: "Category Filter",
      type: "string",
      description: "Filter tag matching category filters defined in site settings (e.g., Expeditions, Hackathons, Classroom, Volunteer-Work, or custom ones).",
      validation: (Rule) => Rule.warning("Category filter is recommended for filtering."),
    }),

    defineField({
      name: "description",
      title: "Group Overview / Description",
      type: "text",
      rows: 2,
      description: "Optional overview text for this photo collection",
    }),
    defineField({
      name: "images",
      title: "Photos (Bulk Uploadable)",
      type: "array",
      description: "Upload multiple photos at once into this collection. Drag & drop images here.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              type: "string",
              title: "Photo Caption (Optional)",
            }),
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text (Optional)",
            }),
          ],
        }),
        defineArrayMember({
          type: "image",
          name: "galleryImage",
          title: "Gallery Photo",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              type: "string",
              title: "Photo Caption (Optional)",
            }),
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text (Optional)",
            }),
          ],
        }),
        defineArrayMember({
          type: "object",
          name: "galleryPhoto",
          title: "Photo Item",
          fields: [
            defineField({
              name: "image",
              title: "Photo Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "caption",
              title: "Photo Caption (Optional)",
              type: "string",
            }),
            defineField({
              name: "alt",
              title: "Alt text (Optional)",
              type: "string",
            }),
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "image",
      title: "Single Photo (Legacy / Fallback)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({
      name: "caption",
      title: "Single Photo Caption (Legacy)",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date / Period",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "categoryTag",
      media0: "images.0",
      media0Image: "images.0.image",
      legacyMedia: "image",
    },
    prepare({ title, subtitle, media0, media0Image, legacyMedia }) {
      return {
        title: title || "Untitled Album",
        subtitle: subtitle ? `Tag: ${subtitle}` : "No Category",
        media: media0 || media0Image || legacyMedia,
      };
    },
  },
});




