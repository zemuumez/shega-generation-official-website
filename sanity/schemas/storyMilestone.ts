import { defineField, defineType } from "sanity";
import { OlistIcon } from "@sanity/icons";

export default defineType({
  name: "storyMilestone",
  title: "Journey & Story Milestones",
  type: "document",
  icon: OlistIcon,
  fields: [
    defineField({
      name: "stepNumber",
      title: "Step Number",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year / Period Label",
      type: "string",
      description: "e.g. 2021, 2022, 2023, 2024, 2025, 2026, Future Horizon",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Milestone Title",
      type: "string",
      description: "e.g. The Coffee House Genesis (Weyn Coffee), 1st Summer Camp at Guenet Hotel",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location / Venue",
      type: "string",
      description: "e.g. Weyn Coffee House, Addis Ababa / Guenet Hotel & TTI Campus",
    }),
    defineField({
      name: "description",
      title: "Full Story Description",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Key Memory / Quote",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Milestone Photo / Illustration",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "highlights",
      title: "Bullet Highlights / Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  orderings: [
    {
      title: "Step Number Ascending",
      name: "stepAsc",
      by: [{ field: "stepNumber", direction: "asc" }],
    },
  ],
});
