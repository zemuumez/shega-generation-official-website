import { defineArrayMember, defineField, defineType } from "sanity";
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
      title: "About Page Title Phrases (Typewriter)",
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
      title: "About Page Subtitle / Mission Statement",
      type: "text",
      rows: 3,
      initialValue:
        "Shega Generations (ሸጋ ትውልድ) is a pioneering non-profit educational movement dedicated to providing free, high-tier software engineering, AI technology, indigenous Ethiopian history, and hospitality character training to talented youth across Ethiopia.",
    }),
    defineField({
      name: "aboutHeroStats",
      title: "About Hero Key Impact Statistics (4 Hero Boxes)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroStatItem",
          title: "Impact Stat Box",
          fields: [
            defineField({ name: "value", title: "Stat Value (e.g. 500+)", type: "string" }),
            defineField({ name: "label", title: "Stat Label (e.g. Talented Geniuses Trained)", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
      initialValue: [
        { _key: "stat1", value: "500+", label: "Talented Geniuses Trained" },
        { _key: "stat2", value: "100% Free", label: "Tuition Cost to Students" },
        { _key: "stat3", value: "12+", label: "Summer & Annual Cohorts" },
        { _key: "stat4", value: "15+", label: "Institutional Partners" },
      ],
    }),
    defineField({
      name: "aboutPillarsTitle",
      title: "Holistic Education Section Title",
      type: "string",
      initialValue: "Our 4 Pillars of Holistic Education",
    }),
    defineField({
      name: "aboutPillarsSubtitle",
      title: "Holistic Education Section Subtitle",
      type: "text",
      rows: 2,
      initialValue:
        "Combining elite computational software engineering with indigenous Ethiopian heritage, dining etiquette, and youth peer mentorship.",
    }),
    defineField({
      name: "aboutCampusVisionTitle",
      title: "Shega Innovation Campus Vision Title",
      type: "string",
      initialValue: "Building the Permanent Shega Innovation Campus",
    }),
    defineField({
      name: "aboutCampusVisionText",
      title: "Shega Innovation Campus Vision Text",
      type: "text",
      rows: 4,
      initialValue:
        "Our ultimate goal is building our own dedicated 24/7 innovation campus in Addis Ababa—equipped with overnight coding laboratories, hardware workshops, incubation spaces, rest facilities, and multi-tier cohort capacity reachable from every corner of Ethiopia.",
    }),
    defineField({
      name: "orgStructureTitle",
      title: "Org Structure Section Title",
      type: "string",
      initialValue: "Role & Responsibilities Breakdown",
    }),
    defineField({
      name: "orgStructureSubtitle",
      title: "Org Structure Section Subtitle",
      type: "string",
      initialValue: "Draft organizational breakdown & governance framework for Shega Generation.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Us Page Copy & Settings" };
    },
  },
});
