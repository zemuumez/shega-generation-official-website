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
    <div className="pb-28 pt-20 relative">
      <div className="glow-bubble top-[10%] right-[10%] w-[35vw] h-[35vw] bg-ochre/5" />
      <div className="glow-bubble bottom-[20%] left-[5%] w-[40vw] h-[40vw] bg-brick/5" />

      <div className="mx-auto max-w-5xl px-6 sm:px-10 relative z-20">
        <span className="inline-block px-3 py-1 rounded-full font-mono text-xs uppercase tracking-[0.2em] bg-ochre/10 text-ochre border border-ochre/20">
          Directory
        </span>
        <h1 className="mt-6 font-display text-display-lg font-bold text-ink leading-tight">Every meetup, drive, and expedition</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          CTFs, hackathons, hiking trips, tech trainings, and charity drives, across every region we operate in.
        </p>
      </div>

      <div className="mt-20 relative z-20">
        <div className="mx-auto mb-6 max-w-5xl px-6 sm:px-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre font-bold block mb-1">&bull; Live Schedule</span>
          <h2 className="font-display text-display-md font-bold text-ink">Upcoming Gathering</h2>
        </div>
        {upcoming.length > 0 ? (
          <HorizontalRail ariaLabel="Upcoming events">
            {upcoming.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </HorizontalRail>
        ) : (
          <p className="mx-auto max-w-5xl px-6 text-ink-soft sm:px-10">Nothing scheduled yet. Check back soon.</p>
        )}
      </div>

      <div className="mt-20 relative z-20">
        <div className="mx-auto mb-6 max-w-5xl px-6 sm:px-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-brick font-bold block mb-1">&bull; History</span>
          <h2 className="font-display text-display-md font-bold text-ink">Past Gatherings</h2>
        </div>
        <HorizontalRail ariaLabel="Past events">
          {past.map((event: any) => (
            <EventCard key={event._id} event={event} />
          ))}
        </HorizontalRail>
      </div>
    </div>
  );
}
