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
      <section className="relative overflow-hidden px-6 pb-24 pt-24 sm:px-10 sm:pb-32 sm:pt-32">
        {/* Soft warmth ambient bubbles */}
        <div className="glow-bubble top-[10%] left-[20%] w-[35vw] h-[35vw] bg-ochre/5" />
        <div className="glow-bubble top-[25%] right-[10%] w-[30vw] h-[30vw] bg-indigo/5" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
          <TibebPattern variant="watermark" tone="ochre" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center sm:text-left z-20">
          <span className="inline-block px-3 py-1 rounded-full font-mono text-xs uppercase tracking-[0.2em] bg-ochre/10 text-ochre border border-ochre/20">
            ሽጋ ትውልድ &middot; Shega Generations
          </span>
          <h1 className="mt-8 font-display text-display-xl font-bold tracking-tight text-ink leading-[0.95]">
            Free tech orientation for Ethiopia&rsquo;s
            <span className="italic text-ochre block sm:inline"> underprivileged geniuses.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-ink-soft leading-relaxed">
            AI/ML, web and mobile development, and DevOps, woven together with life skills
            and indigenous knowledge. Built by the generation it teaches, in every region of the country.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-4 justify-center sm:justify-start">
            <a
              href="/events"
              className="bg-ochre px-8 py-4 rounded-xl text-sm font-mono uppercase tracking-widest text-white transition-all duration-300 hover:bg-ochre-dark hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Join the Generation
            </a>
            <a
              href="/donate"
              className="border border-zinc-200 bg-white text-ink-soft hover:text-ink hover:border-ochre/45 px-8 py-4 rounded-xl text-sm font-mono uppercase tracking-widest transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Support the Mission
            </a>
          </div>
        </div>
      </section>

      <TibebPattern variant="border" tone="brick" className="opacity-60" />

      {/* UPCOMING EVENT ACCENT HERO */}
      {upcomingEvent && (
        <section className="px-6 py-24 sm:px-10 relative">
          <div className="glow-bubble top-[30%] left-[10%] w-[25vw] h-[25vw] bg-brick/5" />
          <h2 className="mx-auto mb-8 max-w-5xl font-mono text-xs uppercase tracking-[0.25em] text-brick font-bold">
            &bull; The nearest gathering
          </h2>
          <UpcomingEventCard event={upcomingEvent} />
        </section>
      )}

      {/* LMS FEATURED COURSE CAROUSEL */}
      <section className="py-24 relative">
        <div className="glow-bubble bottom-[10%] right-[15%] w-[30vw] h-[30vw] bg-ochre/5" />
        <div className="mx-auto mb-10 max-w-5xl px-6 sm:px-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre font-bold">&bull; Learn Tech</span>
          <h2 className="mt-2 font-display text-display-md font-bold text-ink">Where to start learning</h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            Every card opens directly in the learning module it belongs to.
          </p>
        </div>
        <HorizontalRail ariaLabel="Featured courses">
          {courses.map((course: any) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </HorizontalRail>
      </section>

      <TibebPattern variant="border" tone="indigo" className="opacity-60" />

      {/* VENTURE SHOWCASE ROW */}
      <section className="py-24 relative">
        <div className="glow-bubble top-[20%] left-[5%] w-[35vw] h-[35vw] bg-indigo/5" />
        <div className="mx-auto mb-10 max-w-5xl px-6 sm:px-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-indigo font-bold">&bull; Showcase</span>
          <h2 className="mt-2 font-display text-display-md font-bold text-ink">What the generation has built</h2>
          <p className="mt-3 max-w-xl text-ink-soft">
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
      <section className="px-6 py-24 sm:px-10 relative">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft/60 font-bold">&bull; Community</span>
          <h2 className="mt-2 font-display text-display-md font-bold text-ink">Follow the day to day</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { name: "X", handle: "@shegagenerations", tone: "ochre" },
              { name: "Telegram", handle: "t.me/shegagenerations", tone: "indigo" },
              { name: "YouTube", handle: "Shega Generations", tone: "brick" },
            ].map((channel) => (
              <div
                key={channel.name}
                className="rounded-2xl border border-zinc-200/60 bg-white p-6 group hover:border-ochre/30 transition-all duration-300 shadow-md"
              >
                <p className={`font-mono text-[10px] uppercase tracking-widest text-${channel.tone} font-bold`}>{channel.name}</p>
                <p className="mt-3 font-display text-lg font-bold text-ink group-hover:text-ochre transition-colors duration-300">{channel.handle}</p>
                <div className="mt-5 aspect-video w-full bg-zinc-50 border border-zinc-100 rounded-xl transition-all duration-300 group-hover:bg-zinc-100/50" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
