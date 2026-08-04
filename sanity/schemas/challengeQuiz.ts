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
      title: "Difficulty Level",
      type: "string",
      initialValue: "Medium",
      options: {
        list: [
          { title: "Easy", value: "Easy" },
          { title: "Medium", value: "Medium" },
          { title: "Hard", value: "Hard" },
          { title: "Genius", value: "Genius" },
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
      title: "Time Limit per Question (seconds)",
      type: "number",
      initialValue: 20,
      description: "Default countdown time in seconds for each question in this quiz.",
      validation: (Rule) => Rule.min(5).max(300),
    }),
    defineField({
      name: "isPublished",
      title: "Published & Active",
      type: "boolean",
      initialValue: true,
      description: "Allow players to take this quiz on the frontend.",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Challenge",
      type: "boolean",
      initialValue: false,
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
              name: "codeSnippet",
              title: "Code Snippet / Context (Optional)",
              type: "text",
              rows: 4,
              description: "Optional code block or formatted text block for this question.",
            }),
            defineField({
              name: "options",
              title: "Multiple Choice Options",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.min(2).max(6).required(),
              description: "List choices (e.g. Option A, Option B, Option C, Option D).",
            }),
            defineField({
              name: "correctOptionIndex",
              title: "Correct Option Index (0-based)",
              type: "number",
              initialValue: 0,
              description: "Index of the correct answer in the options list (0 for 1st, 1 for 2nd, 2 for 3rd, 3 for 4th).",
              validation: (Rule) => Rule.min(0).max(5).required(),
            }),
            defineField({
              name: "explanation",
              title: "Explanation (Optional)",
              type: "text",
              rows: 2,
              description: "Brief explanation shown after answering or in the results breakdown.",
            }),
            defineField({
              name: "points",
              title: "Base Points for Question",
              type: "number",
              initialValue: 100,
            }),
          ],
          preview: {
            select: {
              title: "questionText",
              options: "options",
            },
            prepare({ title, options }) {
              const count = options?.length || 0;
              return {
                title: title || "Untitled Question",
                subtitle: `${count} options available`,
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
        subtitle: `${category || "Quiz"} • ${difficulty || "Medium"} • ${published ? "Active" : "Draft"}`,
      };
    },
  },
});
