import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  name: "galleryPageSettings",
  title: "Gallery Page Copy & Settings",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "galleryPageTitlePhrases",
      title: "Gallery Page Title Phrases (Typewriter)",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "The weave, in pictures.",
        "በስዕሎች የተሸመነው",
        "STUDENT COHORTS & EXPEDITIONS",
      ],
    }),
    defineField({
      name: "galleryPageSubtitle",
      title: "Gallery Page Subtitle",
      type: "text",
      rows: 3,
      initialValue:
        "Expeditions, hackathons, classrooms, and volunteer work across Ethiopia.",
    }),
    defineField({
      name: "galleryCategories",
      title: "Gallery Category Tag Filters",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "Expeditions",
        "Hackathons",
        "Classroom",
        "Volunteer-Work",
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Gallery Page Copy & Settings" };
    },
  },
});
