import { safeFetch } from "@/sanity/lib/client";
import { ALL_EVENTS_QUERY } from "@/sanity/lib/queries";
import { demoEvents } from "@/lib/demoData";
import EventsDirectory from "@/components/EventsDirectory";

export const metadata = { title: "Events | Shega Generations" };
export const revalidate = 0;

export default async function EventsPage() {
  const events = await safeFetch(ALL_EVENTS_QUERY, {}, demoEvents);

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <EventsDirectory events={events} />
    </main>
  );
}
