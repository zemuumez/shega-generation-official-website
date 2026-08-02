import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "challengeSubmission",
  title: "Leaderboard Submissions",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "participantName",
      title: "Participant Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "participantHandle",
      title: "Handle / Username",
      type: "string",
      description: "Display handle (e.g., @shega_coder)",
    }),
    defineField({
      name: "participantEmail",
      title: "Email Address (Optional)",
      type: "string",
    }),
    defineField({
      name: "quiz",
      title: "Associated Quiz / Challenge",
      type: "reference",
      to: [{ type: "challengeQuiz" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "score",
      title: "Final Score",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "totalQuestions",
      title: "Total Questions",
      type: "number",
    }),
    defineField({
      name: "correctCount",
      title: "Correct Answers Count",
      type: "number",
    }),
    defineField({
      name: "timeSpentSeconds",
      title: "Total Time Spent (seconds)",
      type: "number",
    }),
    defineField({
      name: "completedAt",
      title: "Completed At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "participantName",
      handle: "participantHandle",
      score: "score",
      quizTitle: "quiz.title",
    },
    prepare({ title, handle, score, quizTitle }) {
      return {
        title: `${title}${handle ? ` (${handle})` : ""}`,
        subtitle: `Score: ${score} pts • Quiz: ${quizTitle || "Quiz"}`,
      };
    },
  },
});
