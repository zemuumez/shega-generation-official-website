import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

export default defineType({
  name: "educationalPillar",
  title: "Holistic Educational Pillar",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "pillarNumber",
      title: "Pillar Sequence Number (1 to 4)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(10),
      initialValue: 1,
    }),
    defineField({
      name: "title",
      title: "Pillar Title (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleAmharic",
      title: "Pillar Title (Amharic)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Pillar Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Key Subject Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "iconType",
      title: "Icon Style",
      type: "string",
      options: {
        list: [
          { title: "Code & Robotics", value: "code" },
          { title: "Ge'ez & Heritage", value: "heritage" },
          { title: "Hospitality & Etiquette", value: "hospitality" },
          { title: "Youth Mentorship & Software Lab", value: "mentorship" },
        ],
      },
      initialValue: "code",
    }),
  ],
  preview: {
    select: {
      title: "title",
      pillarNumber: "pillarNumber",
      titleAmharic: "titleAmharic",
    },
    prepare({ title, pillarNumber, titleAmharic }) {
      return {
        title: `Pillar 0${pillarNumber || 1}: ${title}`,
        subtitle: titleAmharic || "",
      };
    },
  },
});
