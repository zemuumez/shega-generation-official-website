import { safeFetch } from "@/sanity/lib/client";
import { TEAM_MEMBERS_QUERY, STORY_MILESTONES_QUERY, SITE_SETTINGS_QUERY, ABOUT_PAGE_SETTINGS_QUERY, EDUCATIONAL_PILLARS_QUERY } from "@/sanity/lib/queries";
import { demoTeamMembers, demoStoryMilestones } from "@/lib/demoData";
import AboutDirectory from "@/components/AboutDirectory";
import SideFramingPatterns from "@/components/SideFramingPatterns";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "About Us | Shega Generations | ሽጋ ትውልድ",
  description:
    "Discover the origin, history, and mission of Shega Generations—from Weyn Coffee House to TTI computer labs and the future Shega Innovation Campus.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const [teamMembers, milestones, siteSettings, aboutSettings, pillars] = await Promise.all([
    safeFetch(TEAM_MEMBERS_QUERY, {}, demoTeamMembers),
    safeFetch(STORY_MILESTONES_QUERY, {}, demoStoryMilestones),
    safeFetch<any>(SITE_SETTINGS_QUERY, {}, null),
    safeFetch<any>(ABOUT_PAGE_SETTINGS_QUERY, {}, null),
    safeFetch<any[]>(EDUCATIONAL_PILLARS_QUERY, {}, []),
  ]);

  const activeAboutSettings = aboutSettings || siteSettings;

  return (
    <main className="min-h-screen bg-[#F4F3EE] relative overflow-hidden">
      <ThemeProvider siteSettings={siteSettings} />
      <SideFramingPatterns />
      <div className="relative z-10">
        <AboutDirectory
          teamMembers={teamMembers && teamMembers.length > 0 ? teamMembers : demoTeamMembers}
          milestones={milestones && milestones.length > 0 ? milestones : demoStoryMilestones}
          pillars={pillars}
          customPhrases={activeAboutSettings?.aboutPageTitlePhrases}
          customSubtitle={activeAboutSettings?.aboutPageSubtitle}
          customCampusVision={activeAboutSettings?.aboutCampusVisionText}
          siteSettings={activeAboutSettings}
        />
      </div>
    </main>
  );
}
