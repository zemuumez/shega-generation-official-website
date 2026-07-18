import HorizontalRail from "@/components/HorizontalRail";
import { EventCard } from "@/components/Cards";
import { safeFetch } from "@/sanity/lib/client";
import { ALL_EVENTS_QUERY } from "@/sanity/lib/queries";
import { demoEvents } from "@/lib/demoData";

export const metadata = { title: "Events | Shega Generations" };

export default async function EventsPage() {
  const events = await safeFetch(ALL_EVENTS_QUERY, {}, demoEvents);
  const upcoming = events.filter((e: any) => e.isUpcoming !== false && new Date(e.eventDate) >= new Date());
  const past = events.filter((e: any) => !(e.isUpcoming !== false && new Date(e.eventDate) >= new Date()));

  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ochre">Directory</p>
        <h1 className="mt-3 font-display text-display-lg">Every meetup, drive, and expedition</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          CTFs, hackathons, hiking trips, tech trainings, and charity drives, across every region we operate in.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="mx-auto mb-6 max-w-5xl px-6 font-display text-display-md sm:px-10">Upcoming</h2>
        {upcoming.length > 0 ? (
          <HorizontalRail ariaLabel="Upcoming events">
            {upcoming.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </HorizontalRail>
        ) : (
          <p className="px-6 text-ink-soft sm:px-10">Nothing scheduled yet. Check back soon.</p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="mx-auto mb-6 max-w-5xl px-6 font-display text-display-md sm:px-10">Past</h2>
        <HorizontalRail ariaLabel="Past events">
          {past.map((event: any) => (
            <EventCard key={event._id} event={event} />
          ))}
        </HorizontalRail>
      </div>
    </div>
  );
}
