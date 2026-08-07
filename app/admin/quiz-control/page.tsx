import { Metadata } from "next";
import AdminQuizControlDeck from "@/components/AdminQuizControlDeck";
import ThemeProvider from "@/components/ThemeProvider";
import { sanityClient } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Admin Live Quiz Control Deck | Shega Generation",
  description: "Live operator control deck for real-time quiz broadcasts and automated session pushing.",
};

export const revalidate = 0; // Dynamic route

export default async function AdminQuizControlPage() {
  let topics: any[] = [];
  let quizzes: any[] = [];
  let siteSettings: any = null;

  try {
    const [tDocs, qDocs, sSettings] = await Promise.all([
      sanityClient.fetch(
        `*[_type == "quizTopic" && isActive == true] | order(orderIndex asc) {
          _id, title, slug, orderIndex
        }`
      ),
      sanityClient.fetch(
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
      ),
      sanityClient.fetch(SITE_SETTINGS_QUERY),
    ]);

    topics = tDocs || [];
    quizzes = qDocs || [];
    siteSettings = sSettings || null;
  } catch (err) {
    console.error("Failed to fetch admin deck data:", err);
  }

  return (
    <main className="min-h-screen bg-ivory text-ink relative">
      <ThemeProvider siteSettings={siteSettings} />
      <AdminQuizControlDeck topics={topics} quizzes={quizzes} />
    </main>
  );
}
