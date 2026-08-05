import { Metadata } from "next";
import AdminQuizControlDeck from "@/components/AdminQuizControlDeck";
import { sanityClient } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Admin Live Quiz Control Deck | Shega Generation",
  description: "Live operator control deck for real-time quiz broadcasts and automated session pushing.",
};

export const revalidate = 0; // Dynamic route

export default async function AdminQuizControlPage() {
  let topics: any[] = [];
  let quizzes: any[] = [];

  try {
    topics = await sanityClient.fetch(
      `*[_type == "quizTopic" && isActive == true] | order(orderIndex asc) {
        _id, title, slug, orderIndex
      }`
    );
  } catch (err) {
    console.error("Failed to fetch topics:", err);
  }

  try {
    quizzes = await sanityClient.fetch(
      `*[_type == "challengeQuiz" && isPublished == true] | order(_createdAt desc) {
        _id,
        title,
        topic,
        timePerQuestion,
        questions[] {
          _key,
          questionText,
          orderIndex,
          questionType,
          difficulty,
          codeSnippet,
          options,
          correctOptionIndex,
          explanation
        }
      }`
    );
  } catch (err) {
    console.error("Failed to fetch quizzes for admin deck:", err);
  }

  return <AdminQuizControlDeck topics={topics} quizzes={quizzes} />;
}
