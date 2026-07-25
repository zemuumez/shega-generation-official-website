import { safeFetch } from "@/sanity/lib/client";
import { ALL_EVENTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { demoEvents } from "@/lib/demoData";
import EventsDirectory from "@/components/EventsDirectory";

export const metadata = { title: "Events | Shega Generations" };
export const revalidate = 0;

export default async function EventsPage() {
  const [events, siteSettings] = await Promise.all([
    safeFetch(ALL_EVENTS_QUERY, {}, demoEvents),
    safeFetch<any>(SITE_SETTINGS_QUERY, {}, null),
  ]);

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <EventsDirectory
        events={events}
        customPhrases={siteSettings?.eventsPageTitlePhrases}
        customSubtitle={siteSettings?.eventsPageSubtitle}
        customCategories={siteSettings?.eventsCategories}
      />
    </main>
  );
}
