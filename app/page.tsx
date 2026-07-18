import TibebPattern from "@/components/TibebPattern";
import HorizontalRail from "@/components/HorizontalRail";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import { CourseCard, ProjectCard } from "@/components/Cards";
import { safeFetch } from "@/sanity/lib/client";
import { UPCOMING_EVENT_QUERY, FEATURED_COURSES_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";
import { demoUpcomingEvent, demoCourses, demoProjects } from "@/lib/demoData";

export default async function HomePage() {
  const upcomingEvent = await safeFetch(UPCOMING_EVENT_QUERY, {}, demoUpcomingEvent);
  const courses = await safeFetch(FEATURED_COURSES_QUERY, {}, demoCourses);
  const projects = await safeFetch(PROJECTS_QUERY, {}, demoProjects);

  return (
    <>
      {/* HERO PORTAL */}
      <section className="relative overflow-hidden px-6 pb-20 pt-20 sm:px-10 sm:pb-28 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
          <TibebPattern variant="watermark" tone="ochre" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ochre">ሽጋ ትውልድ &middot; Shega Generations</p>
          <h1 className="mt-5 font-display text-display-xl">
            Free tech orientation for Ethiopia&rsquo;s
            <span className="italic text-ochre-dark"> underprivileged geniuses.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            AI/ML, web and mobile development, and DevOps, woven together with life skills
            and indigenous knowledge. Built by the generation it teaches, in every region of the country.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/events"
              className="bg-ink px-7 py-3.5 text-sm font-mono uppercase tracking-wide text-ivory transition-opacity hover:opacity-85"
            >
              Join the Generation
            </a>
            <a
              href="/donate"
              className="border border-ink px-7 py-3.5 text-sm font-mono uppercase tracking-wide transition-colors hover:bg-ink hover:text-ivory"
            >
              Support the Mission
            </a>
          </div>
        </div>
      </section>

      <TibebPattern variant="border" tone="brick" />

      {/* UPCOMING EVENT ACCENT HERO */}
      {upcomingEvent && (
        <section className="px-6 py-20 sm:px-10">
          <h2 className="mx-auto mb-8 max-w-5xl font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            The nearest gathering
          </h2>
          <UpcomingEventCard event={upcomingEvent} />
        </section>
      )}

      {/* LMS FEATURED COURSE CAROUSEL */}
      <section className="py-20">
        <div className="mx-auto mb-8 max-w-5xl px-6 sm:px-10">
          <h2 className="font-display text-display-md">Where to start learning</h2>
          <p className="mt-2 max-w-xl text-ink-soft">
            Every card opens directly in the learning module it belongs to.
          </p>
        </div>
        <HorizontalRail ariaLabel="Featured courses">
          {courses.map((course: any) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </HorizontalRail>
      </section>

      <TibebPattern variant="border" tone="indigo" />

      {/* VENTURE SHOWCASE ROW */}
      <section className="py-20">
        <div className="mx-auto mb-8 max-w-5xl px-6 sm:px-10">
          <h2 className="font-display text-display-md">What the generation has built</h2>
          <p className="mt-2 max-w-xl text-ink-soft">
            Startups, tools, and side projects that started as a Shega assignment.
          </p>
        </div>
        <HorizontalRail ariaLabel="Member projects and ventures">
          {projects.map((project: any) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </HorizontalRail>
      </section>

      {/* SOCIAL MEDIA INTERACTION MODULE */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-display-md">Follow the day to day</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { name: "X", handle: "@shegagenerations", tone: "ink" },
              { name: "Telegram", handle: "t.me/shegagenerations", tone: "indigo" },
              { name: "YouTube", handle: "Shega Generations", tone: "brick" },
            ].map((channel) => (
              <div
                key={channel.name}
                className="rounded-sm border border-ink/10 bg-white p-6"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-ink-soft/70">{channel.name}</p>
                <p className="mt-2 font-display text-lg">{channel.handle}</p>
                <div className="mt-4 aspect-video w-full bg-ivory-dim" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
