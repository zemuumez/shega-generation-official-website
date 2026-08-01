import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export default defineType({
  name: "contactPageSettings",
  title: "Contact Page Copy & Settings",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "contactPageTitlePhrases",
      title: "Contact Page Title Phrases (Typewriter)",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "Get in touch, with Shega.",
        "ከሸጋ ጋር, ይገናኙ",
        "PARTNERSHIPS & INQUIRIES",
      ],
    }),
    defineField({
      name: "contactPageSubtitle",
      title: "Contact Page Subtitle",
      type: "text",
      rows: 3,
      initialValue:
        "Reach out to our leadership team for general inquiries, partnerships, sponsorships, media features, or donations.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page Copy & Settings" };
    },
  },
});
