import HorizontalRail from "@/components/HorizontalRail";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import { CourseCard } from "@/components/Cards";
import ExpandingProjectCapsules from "@/components/ExpandingProjectCapsules";
import InteractiveProgramExplorer from "@/components/InteractiveProgramExplorer";
import TibebPattern from "@/components/TibebPattern";
import LeafPattern from "@/components/LeafPattern";
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
      <section className="relative min-h-[calc(100dvh-76px)] flex flex-col justify-center items-center overflow-hidden px-6 py-12 md:py-20 bg-[#F4F3EE]">
        {/* Left Side Framing border ribbon from custom SVG */}
        <div className="absolute left-0 top-0 bottom-0 w-[18%] max-w-[200px] z-0 pointer-events-none opacity-15 hidden lg:block scale-x-[-1]">
          <img
            src="/images/pattern1.svg"
            alt=""
            className="h-full w-full object-cover object-left"
          />
        </div>

        {/* Right Side Framing border ribbon from custom SVG */}
        <div className="absolute right-0 top-0 bottom-0 w-[18%] max-w-[200px] z-0 pointer-events-none opacity-15 hidden lg:block">
          <img
            src="/images/pattern1.svg"
            alt=""
            className="h-full w-full object-cover object-left"
          />
        </div>

        <div className="relative mx-auto max-w-5xl z-20 flex flex-col items-center justify-center w-full">
          
          {/* Giant Masked Text Title */}
          <div className="flex flex-col items-center justify-center text-center mt-4 sm:mt-6 select-none">
            <h1 className="font-display font-bold text-[clamp(3.5rem,14vw,6.5rem)] sm:text-[clamp(6.5rem,11vw,10.5rem)] leading-[0.92] tracking-tighter uppercase text-masked-bg">
              Shega
              <br className="sm:hidden" />
              <span className="sm:inline"> Generations</span>
            </h1>
          </div>

          <div className="mt-8 sm:mt-10 mx-auto max-w-2xl text-center">
            <p className="text-lg sm:text-xl text-ink-soft leading-relaxed">
              AI/ML, web and mobile development, and DevOps, woven together with life skills
              and indigenous knowledge. Built by the generation it teaches, in every region of the country.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/events"
                className="w-full sm:w-auto bg-ochre px-9 py-4 rounded-full text-xs font-mono uppercase tracking-widest text-white transition-all duration-300 hover:bg-ochre-dark hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center font-bold"
              >
                Join the Generation
              </a>
              <a
                href="/donate"
                className="w-full sm:w-auto border border-ink/40 text-ink hover:border-ochre hover:text-ochre px-9 py-4 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-center font-bold"
              >
                Support the Mission
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH PHOTO OVERLAY STATEMENT BANNER */}
      <section className="relative w-full h-[55vh] min-h-[420px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/35 z-10" />
        
        <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 select-none leading-[0.95]">
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-wider">
            Tech Orientation
          </h2>
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl stroke-text uppercase tracking-wider mt-3">
            Life Skills
          </h2>
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-wider mt-3">
            Indigenous Weaving
          </h2>
        </div>
      </section>

      {/* HALF-PAGE SPLIT SCROLL CURRICULUM SECTION */}
      <section className="mx-auto max-w-5xl px-6 sm:px-10 py-24 relative z-20 border-b border-zinc-200">
        {/* Background Leaf Pattern */}
        <div className="absolute inset-y-0 -left-10 w-96 pointer-events-none opacity-25 z-0 hidden lg:block">
          <LeafPattern tone="gold" id="curriculum-leaf" opacity="0.1" />
        </div>
        <div className="flex flex-col md:flex-row gap-12 relative z-10">
          {/* Left Column - Sticky Section Title */}
          <div className="md:w-1/2 md:sticky md:top-28 h-fit">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold block mb-1">
              &bull; Pedagogical Architecture
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink uppercase tracking-wide leading-tight">
              A curriculum designed for regional leaders
            </h2>
            <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-md">
              We do not just teach syntax. We build builders who are anchored in their heritage, prepared to lead local industries, and capable of constructing localized engineering solutions.
            </p>
            <div className="mt-8 hidden md:block">
              <a
                href="/donate"
                className="inline-flex border border-ink/40 text-ink rounded-full px-6 py-3 hover:bg-ochre hover:text-white hover:border-ochre text-[10px] tracking-widest transition-all uppercase font-mono font-bold"
              >
                Pledge a Scholarship
              </a>
            </div>
          </div>

          {/* Right Column - Scrollable Content Blocks */}
          <div className="md:w-1/2 space-y-12">
            {[
              {
                num: "01",
                title: "Artificial Intelligence Laboratory",
                desc: "Focusing on low-resource language processing (NLP), local dialects, optical character recognition (OCR) for Ge'ez, and agricultural diagnostic models.",
              },
              {
                num: "02",
                title: "Software Engineering Studio",
                desc: "Constructing robust backend layers, native cross-platform mobile portals, and database architectures to support commerce in secondary cities.",
              },
              {
                num: "03",
                title: "Cloud Infrastructure Pipeline",
                desc: "Continuous integration, GitOps deployment practices, local server administration, and offline-first container systems for rural deployments.",
              },
              {
                num: "04",
                title: "Traditional Craft & Ethnomathematics",
                desc: "Decoding structural geometry patterns in traditional Ethiopian weaving (Tibeb), translating organic matrices into scalable CSS grids and graphics code.",
              },
              {
                num: "05",
                title: "Life Skills & Local Leadership",
                desc: "Storytelling, critical thinking, negotiation, community support ethics, and financial literacy, preparing developers to run sustainable ventures.",
              },
            ].map((item) => (
              <div key={item.num} className="border-b border-zinc-200 pb-8 last:border-0 last:pb-0">
                <span className="font-mono text-2xl font-bold text-ink/30 block mb-2">{item.num}</span>
                <h3 className="font-display text-xl font-bold text-ink uppercase tracking-wide">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARALLAX PHILOSOPHY BANNER */}
      <section className="relative h-[65vh] min-h-[440px] w-full overflow-hidden flex items-center justify-center bg-fixed bg-cover bg-center select-none" style={{ backgroundImage: "url('/images/hero-bg.png')" }}>
        <div className="absolute inset-0 bg-black/65 z-10" />
        <div className="relative z-20 max-w-4xl text-center px-6">
          <span className="font-mono text-xs uppercase tracking-widest text-ink/65 font-bold">&bull; Our Cultural Anchoring</span>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-wider leading-tight">
            We weave modern technology with cultural roots
          </h2>
          <p className="mt-6 text-zinc-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            By grounding tech instruction in traditional craft and community cooperation, we build leaders who build for their homeland.
          </p>
        </div>
      </section>

      {/* INTERACTIVE TRACK EXPLORER */}
      <section className="py-24 border-b border-zinc-200 relative overflow-hidden">
        {/* Background Leaf Pattern */}
        <div className="absolute inset-y-0 -right-20 w-96 pointer-events-none opacity-25 z-0 hidden lg:block">
          <LeafPattern tone="gold" id="explorer-leaf" opacity="0.1" />
        </div>
        <div className="relative z-10">
          <div className="mx-auto mb-10 max-w-5xl px-6 sm:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">&bull; Dynamic Curriculum</span>
            <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Interactive Track Explorer</h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Explore our curriculum paths, tech stacks, cohort dates, and class size metrics below.
            </p>
          </div>
          <InteractiveProgramExplorer />
        </div>
      </section>

      {/* UPCOMING EVENT ACCENT HERO */}
      {upcomingEvent && (
        <section className="px-6 py-24 sm:px-10 relative border-b border-zinc-200">
          <h2 className="mx-auto mb-10 max-w-5xl font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">
            &bull; The nearest gathering
          </h2>
          <UpcomingEventCard event={upcomingEvent} />
        </section>
      )}

      {/* LMS FEATURED COURSE CAROUSEL */}
      <section className="py-24 relative border-b border-zinc-200 overflow-hidden">
        {/* Background Leaf Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <LeafPattern tone="gold" id="courses-leaf" opacity="0.08" />
        </div>
        <div className="relative z-10">
          <div className="mx-auto mb-10 max-w-5xl px-6 sm:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">&bull; Learn Tech</span>
            <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Where to start learning</h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Every card opens directly in the learning module it belongs to.
            </p>
          </div>
          <HorizontalRail ariaLabel="Featured courses">
            {courses.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </HorizontalRail>
        </div>
      </section>

      {/* VENTURE SHOWCASE / JOURNEYS (Expanding Capsules) */}
      <section className="py-24 relative border-b border-zinc-200 overflow-hidden">
        {/* Background Leaf Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
          <LeafPattern tone="gold" id="journeys-leaf" opacity="0.08" />
        </div>
        <div className="relative z-10">
          <div className="mx-auto mb-10 max-w-5xl px-6 sm:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">&bull; Student Journeys</span>
            <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Student Journeys</h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Alumni startups, projects, and employment stories that started as a Shega assignment. Hover or click to explore.
            </p>
          </div>
          <ExpandingProjectCapsules projects={projects} />
        </div>
      </section>

      {/* TESTIMONIALS HORIZONTAL RAIL */}
      <section className="py-24 relative overflow-hidden bg-white/10">
        <div className="mx-auto mb-10 max-w-5xl px-6 sm:px-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">&bull; Alumni Testimonials</span>
          <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Voices of Shega</h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            Here is what our graduates say about their journey through the regional cohorts.
          </p>
        </div>
        <HorizontalRail ariaLabel="Alumni testimonials">
          {[
            {
              quote: "Shega gave me the chance to write my first line of code. Today, I'm developing NLP tools to translate school books into our regional language.",
              author: "Tsion Kebede",
              track: "AI Laboratory Graduate",
              region: "Hawassa",
            },
            {
              quote: "The DevOps track was hard but it gave me practical skills. Building real tools alongside peers taught me more than any online course.",
              author: "Yonas Alemu",
              track: "DevOps Pipeline Graduate",
              region: "Bahir Dar",
            },
            {
              quote: "Ethnomathematics opened my eyes. Combining Tibeb weaving geometries with SVG grid coding helped me understand programming matrix models.",
              author: "Samrawit Birhan",
              track: "Craft & Software Graduate",
              region: "Mekelle",
            },
            {
              quote: "Our leadership cohort did more than teach programming. We built community projects together, which made us a real family.",
              author: "Abdi Tolosa",
              track: "Software Studio Graduate",
              region: "Adama",
            },
          ].map((test, index) => (
            <div
              key={index}
              className="rail-item flex-shrink-0 w-80 sm:w-96 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-zinc-300/40"
            >
              <div>
                <span className="text-4xl text-ink/10 font-serif leading-none select-none">&ldquo;</span>
                <p className="text-sm text-ink-soft italic leading-relaxed mt-2">{test.quote}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                <div>
                  <h4 className="font-display text-sm font-bold text-ink uppercase">{test.author}</h4>
                  <p className="text-[10px] font-mono text-ink-soft mt-0.5">{test.track}</p>
                </div>
                <span className="rounded-full bg-zinc-50 border border-zinc-200 px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-ink-soft font-bold">
                  {test.region}
                </span>
              </div>
            </div>
          ))}
        </HorizontalRail>
      </section>

      {/* SOCIAL MEDIA INTERACTION MODULE */}
      <section className="px-6 py-24 sm:px-10 relative bg-white/20 border-t border-zinc-200">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft/60 font-bold">&bull; Community</span>
          <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Follow the day to day</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { name: "X", handle: "@shegagenerations", tone: "ink-soft" },
              { name: "Telegram", handle: "t.me/shegagenerations", tone: "ink-soft" },
              { name: "YouTube", handle: "Shega Generations", tone: "ink-soft" },
            ].map((channel) => (
              <div
                key={channel.name}
                className="rounded-[32px] border border-zinc-200 bg-white p-6 group hover:border-zinc-300/40 transition-all duration-300 shadow-sm"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/60 font-bold">{channel.name}</p>
                <p className="mt-3 font-display text-lg font-bold text-ink group-hover:text-ink/75 transition-colors duration-300">{channel.handle}</p>
                <div className="mt-5 aspect-video w-full bg-zinc-50 border border-zinc-100 rounded-2xl transition-all duration-300 group-hover:bg-zinc-100/50" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
