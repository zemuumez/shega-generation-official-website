import { safeFetch } from "@/sanity/lib/client";
import { ALL_EVENTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { demoEvents } from "@/lib/demoData";
import EventsDirectory from "@/components/EventsDirectory";
import SideFramingPatterns from "@/components/SideFramingPatterns";

import ThemeProvider from "@/components/ThemeProvider";

export const metadata = { title: "Events | Shega Generations" };
export const revalidate = 0;

export default async function EventsPage() {
  const [events, siteSettings] = await Promise.all([
    safeFetch(ALL_EVENTS_QUERY, {}, demoEvents),
    safeFetch<any>(SITE_SETTINGS_QUERY, {}, null),
  ]);

  return (
    <main className="min-h-screen bg-[#F4F3EE] relative overflow-hidden">
      <ThemeProvider siteSettings={siteSettings} />
      <SideFramingPatterns />
      <div className="relative z-10">
        <EventsDirectory
          events={events}
          customPhrases={siteSettings?.eventsPageTitlePhrases}
          customSubtitle={siteSettings?.eventsPageSubtitle}
          customCategories={siteSettings?.eventsCategories}
        />
      </div>
    </main>
  );
}
