import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "aboutPageSettings",
  title: "About Us Page Copy & Settings",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "aboutHeroKicker",
      title: "About Hero Kicker / Badge Notice",
      type: "string",
      initialValue: "OUR MISSION & ORIGIN STORY",
    }),
    defineField({
      name: "aboutPageTitlePhrases",
      title: "About Hero Title Phrases (Typewriter)",
      description: "Phrases typed out in a loop at the top of the About Us page hero section.",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "እኛ ማን ነን",
        "ABOUT SHEGA GENERATIONS",
        "OUR ORIGIN STORY",
        "OUR MISSION & VISION",
      ],
    }),
    defineField({
      name: "aboutPageSubtitle",
      title: "About Hero Subtitle / Mission Statement",
      type: "text",
      rows: 4,
      initialValue:
        "Shega Generations (ሸጋ ትውልድ) is a pioneering non-profit educational movement dedicated to providing free, high-tier software engineering, AI technology, indigenous Ethiopian history, and hospitality character training to talented youth across Ethiopia.",
    }),
    defineField({
      name: "aboutHeroStats",
      title: "About Hero Key Impact Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Stat Value (e.g. 500+)", type: "string" },
            { name: "label", title: "Stat Label", type: "string" },
          ],
        },
      ],
      initialValue: [
        { value: "500+", label: "Talented Geniuses Trained" },
        { value: "100% Free", label: "Tuition Cost to Students" },
        { value: "12+", label: "Summer & Annual Cohorts" },
        { value: "15+", label: "Institutional Partners" },
      ],
    }),
    defineField({
      name: "aboutCampusVisionTitle",
      title: "Shega Campus Vision Section Title",
      type: "string",
      initialValue: "Building the Permanent Shega Innovation Campus",
    }),
    defineField({
      name: "aboutCampusVisionText",
      title: "Shega Campus Vision Section Description",
      type: "text",
      rows: 4,
      initialValue:
        "Our ultimate goal is building our own dedicated 24/7 innovation campus in Addis Ababa—equipped with overnight coding laboratories, hardware workshops, incubation spaces, rest facilities, and multi-tier cohort capacity reachable from every corner of Ethiopia.",
    }),
    defineField({
      name: "orgStructureTitle",
      title: "Organization Structure Section Title",
      type: "string",
      initialValue: "Role & Responsibilities Breakdown",
    }),
    defineField({
      name: "orgStructureSubtitle",
      title: "Organization Structure Section Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Organizational breakdown & governance framework for Shega Generation.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Us Page Copy & Settings" };
    },
  },
});
