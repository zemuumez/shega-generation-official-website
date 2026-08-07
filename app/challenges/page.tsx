import { Metadata } from "next";
import ChallengeDirectory from "@/components/ChallengeDirectory";
import ThemeProvider from "@/components/ThemeProvider";
import { sanityClient } from "@/sanity/lib/client";
import { CHALLENGES_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
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

export const revalidate = 0; // Dynamic route

export default async function ChallengesPage() {
  let pageData: any = null;
  let siteSettings: any = null;

  try {
    const [pData, sSettings] = await Promise.all([
      sanityClient.fetch(CHALLENGES_PAGE_QUERY),
      sanityClient.fetch(SITE_SETTINGS_QUERY),
    ]);
    pageData = pData;
    siteSettings = sSettings;
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

  const activeSiteSettings = siteSettings || pageData?.siteSettings || {};

  return (
    <main className="min-h-screen bg-ivory text-ink relative">
      <ThemeProvider siteSettings={activeSiteSettings} />
      <ChallengeDirectory
        quizzes={quizzes}
        leaderboard={leaderboard}
        customTitle={activeSiteSettings.challengesHeroTitle}
        customSubtitle={activeSiteSettings.challengesHeroSubtitle}
      />
    </main>
  );
}
