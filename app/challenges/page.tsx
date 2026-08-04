import { Metadata } from "next";
import ChallengeDirectory from "@/components/ChallengeDirectory";
import { sanityClient } from "@/sanity/lib/client";
import { CHALLENGES_PAGE_QUERY } from "@/sanity/lib/queries";
import { demoQuizzes, demoLeaderboard } from "@/lib/demoData";

export const metadata: Metadata = {
  title: "Challenges & Quizzes | Shega Generation (ሸጋ ትውልድ)",
  description:
    "Test your speed and algorithmic problem solving with timed quizzes, modern challenges, and live leaderboards at Shega Generation.",
  openGraph: {
    title: "Challenges & Arena | Shega Generation",
    description:
      "Interactive coding quizzes, modern challenges, and live leaderboards powering Ethiopian tech geniuses.",
  },
};

export const revalidate = 10; // Revalidate every 10 seconds

export default async function ChallengesPage() {
  let pageData: any = null;

  try {
    pageData = await sanityClient.fetch(CHALLENGES_PAGE_QUERY);
  } catch (err) {
    console.error("Failed to fetch challenges page data from Sanity:", err);
  }

  const quizzes =
    pageData?.quizzes && pageData.quizzes.length > 0
      ? pageData.quizzes
      : demoQuizzes;

  const leaderboard =
    pageData?.leaderboard && pageData.leaderboard.length > 0
      ? pageData.leaderboard
      : demoLeaderboard;

  const siteSettings = pageData?.siteSettings || {};

  return (
    <ChallengeDirectory
      quizzes={quizzes}
      leaderboard={leaderboard}
      customTitle={siteSettings.challengesHeroTitle}
      customSubtitle={siteSettings.challengesHeroSubtitle}
    />
  );
}
