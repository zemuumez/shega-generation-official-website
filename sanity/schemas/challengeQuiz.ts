import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export default defineType({
  name: "challengeQuiz",
  title: "Quizzes & Challenges",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "title",
      title: "Quiz / Challenge Title",
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
      name: "topic",
      title: "Associated Topic",
      type: "reference",
      to: [{ type: "quizTopic" }],
      description: "Filterable topic domain for live broadcast sessions.",
    }),
    defineField({
      name: "category",
      title: "Challenge Category",
      type: "string",
      initialValue: "Timed Q&A",
      options: {
        list: [
          { title: "Timed Q&A (Quiz)", value: "Timed Q&A" },
          { title: "Modern Challenges", value: "Modern Challenges" },
          { title: "Take-Home Assignment", value: "Take-Home Assignment" },
          { title: "Mini CTF", value: "Mini CTF" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Overall Difficulty Level",
      type: "string",
      initialValue: "MEDIUM",
      options: {
        list: [
          { title: "Easy (100 pts)", value: "EASY" },
          { title: "Medium (200 pts)", value: "MEDIUM" },
          { title: "Hard (400 pts)", value: "HARD" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "timePerQuestion",
      title: "Default Time Limit per Question (seconds)",
      type: "number",
      initialValue: 45,
      description: "Default countdown time in seconds (pre-populated to 45s). Editable prior to live broadcast.",
      validation: (Rule) => Rule.min(5).max(300),
    }),
    defineField({
      name: "isPublished",
      title: "Published & Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "questions",
      title: "Quiz Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quizQuestion",
          title: "Question Item",
          fields: [
            defineField({
              name: "questionText",
              title: "Question Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "orderIndex",
              title: "Sequential Order Index",
              type: "number",
              initialValue: 1,
              description: "1, 2, 3... used for sequence ordering and auto-push loops.",
            }),
            defineField({
              name: "questionType",
              title: "Question Type",
              type: "string",
              initialValue: "MULTIPLE_CHOICE",
              options: {
                list: [
                  { title: "Multiple Choice", value: "MULTIPLE_CHOICE" },
                  { title: "True / False", value: "TRUE_FALSE" },
                ],
              },
            }),
            defineField({
              name: "difficulty",
              title: "Question Difficulty",
              type: "string",
              initialValue: "MEDIUM",
              options: {
                list: [
                  { title: "EASY (100 pts)", value: "EASY" },
                  { title: "MEDIUM (200 pts)", value: "MEDIUM" },
                  { title: "HARD (400 pts)", value: "HARD" },
                ],
              },
            }),
            defineField({
              name: "codeSnippet",
              title: "Code Snippet / Context (Optional)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "options",
              title: "Multiple Choice Options",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.min(2).max(6).required(),
            }),
            defineField({
              name: "correctOptionIndex",
              title: "Correct Option Index (0-based)",
              type: "number",
              initialValue: 0,
              validation: (Rule) => Rule.min(0).max(5).required(),
            }),
            defineField({
              name: "explanation",
              title: "Explanation (Optional)",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "points",
              title: "Custom Base Points (Optional)",
              type: "number",
              description: "Leave empty to use difficulty level points (EASY: 100, MEDIUM: 200, HARD: 400).",
            }),
          ],
          preview: {
            select: {
              title: "questionText",
              order: "orderIndex",
              difficulty: "difficulty",
            },
            prepare({ title, order, difficulty }) {
              return {
                title: `#${order || 1} - ${title || "Untitled Question"}`,
                subtitle: `Difficulty: ${difficulty || "MEDIUM"}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      difficulty: "difficulty",
      published: "isPublished",
    },
    prepare({ title, category, difficulty, published }) {
      return {
        title: title || "Untitled Quiz",
        subtitle: `${category || "Quiz"} • ${difficulty || "MEDIUM"} • ${published ? "Active" : "Draft"}`,
      };
    },
  },
});
