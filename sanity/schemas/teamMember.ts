import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "teamMember",
  title: "Team Members & Leadership",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: "e.g. Founder & Executive Director, Senior AI Engineering Mentor, Cultural Advisor",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department / Category",
      type: "string",
      initialValue: "leadership",
      options: {
        list: [
          { title: "Executive Leadership & Founders", value: "leadership" },
          { title: "Technical & AI Instructors", value: "tech" },
          { title: "Cultural & Character Advisors", value: "cultural" },
          { title: "Student Council & Alumni Mentors", value: "student-mentors" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography / Background",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "quote",
      title: "Personal Motto / Quote",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "organizationAffiliations",
      title: "Organization Affiliations / Background Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. Higher Ed Lecturer, MaryJoy NGO Ambassador, CEO Samilos Media",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media & Profile Links",
      type: "object",
      fields: [
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "tiktok", title: "TikTok URL", type: "url" },
        { name: "email", title: "Email Address", type: "string" },
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 1,
    }),
  ],
});
