import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export default defineType({
  name: "eventsPageSettings",
  title: "Events Page Copy & Settings",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "eventsSectionKicker",
      title: "Events Section Kicker Tag",
      type: "string",
      initialValue: "The nearest gathering",
    }),
    defineField({
      name: "eventsSectionTitle",
      title: "Nearest Gathering Title",
      type: "string",
      initialValue: "Upcoming Gathering & Workshops",
    }),
    defineField({
      name: "eventsPageTitlePhrases",
      title: "Events Page Title Phrases (Typewriter)",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "Where the generation gathers.",
        "የትውልዱ መገናኛ",
        "UPCOMING CTFs & WORKSHOPS",
      ],
    }),
    defineField({
      name: "eventsPageSubtitle",
      title: "Events Page Subtitle",
      type: "text",
      rows: 3,
      initialValue: "Active, incoming and historic meetups from CTFs in Addis to Simien treks.",
    }),
    defineField({
      name: "eventsCategories",
      title: "Event Filter Categories",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["CTF", "Hackathon", "Hiking", "Tour", "Tech Training", "Charity"],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Events Page Copy & Settings" };
    },
  },
});
