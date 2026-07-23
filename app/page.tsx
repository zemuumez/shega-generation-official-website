import HorizontalRail from "@/components/HorizontalRail";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import { CourseCard } from "@/components/Cards";
import ExpandingProjectCapsules from "@/components/ExpandingProjectCapsules";
import InteractiveProgramExplorer from "@/components/InteractiveProgramExplorer";
import TibebPattern from "@/components/TibebPattern";
import LeafPattern from "@/components/LeafPattern";
import TypewriterTitle from "@/components/TypewriterTitle";
import Image from "next/image";
import { safeFetch } from "@/sanity/lib/client";
import { UPCOMING_EVENT_QUERY, FEATURED_COURSES_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";
import { demoUpcomingEvent, demoCourses, demoProjects, demoTestimonials } from "@/lib/demoData";

export default async function HomePage() {
  const upcomingEvent = await safeFetch(UPCOMING_EVENT_QUERY, {}, demoUpcomingEvent);
  const fetchedCourses = await safeFetch(FEATURED_COURSES_QUERY, {}, demoCourses);
  const fetchedProjects = await safeFetch(PROJECTS_QUERY, {}, demoProjects);

  const courseList = (fetchedCourses && fetchedCourses.length >= 3) ? fetchedCourses : demoCourses;
  const projectList = (fetchedProjects && fetchedProjects.length >= 3) ? fetchedProjects : demoProjects;
  const testimonialList = demoTestimonials;

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

        <div className="relative mx-auto max-w-7xl z-20 flex flex-col items-center justify-center w-full">
          
          {/* Giant Typewriter Title - Types and Backspaces in a Loop */}
          <div className="flex flex-col items-center justify-center text-center mt-2 sm:mt-4 select-none w-full min-h-[1.1em]">
            <TypewriterTitle
              text="Shega Generations"
              className="font-display font-extrabold text-[clamp(3.8rem,16vw,7.5rem)] sm:text-[clamp(6.5rem,13vw,12.5rem)] leading-[0.95] tracking-[0.05em] sm:tracking-[0.07em] uppercase text-masked-bg text-center max-w-full"
            />
          </div>

          <div className="mt-8 sm:mt-12 mx-auto max-w-3xl text-center">
            <p className="text-lg sm:text-2xl text-ink-soft leading-relaxed font-sans font-medium px-4">
              Dedicated to sharing knowledge kindly across generations, weaving rich indigenous wisdom with modern technology to anchor, empower, and shape future leaders in every region.
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
      <section className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 py-24 relative border-b border-zinc-200">
        {/* Background Geometric Line Pattern - Bleeds slightly outward without breaking sticky scroll */}
        <div className="absolute inset-y-0 -left-8 md:-left-14 w-96 pointer-events-none opacity-60 z-0 hidden lg:block [mask-image:linear-gradient(to_right,white_50%,transparent_100%)]">
          <LeafPattern tone="gray" variant="mosaic" id="curriculum-leaf" opacity="0.3" />
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
      <section className="py-24 border-b border-zinc-200 relative">
        {/* Background Geometric Line Pattern - Bleeds outward without breaking section entrance scroll */}
        <div className="absolute inset-y-0 -right-8 md:-right-14 w-96 pointer-events-none opacity-60 z-0 hidden lg:block [mask-image:linear-gradient(to_left,white_50%,transparent_100%)]">
          <LeafPattern tone="gray" variant="arches" id="explorer-leaf" opacity="0.3" />
        </div>
        <div className="relative z-10">
          <InteractiveProgramExplorer />
        </div>
      </section>

      {/* UPCOMING EVENT ACCENT HERO */}
      {upcomingEvent && (
        <section className="px-4 py-24 sm:px-6 relative border-b border-zinc-200">
          <h2 className="mx-auto mb-10 w-full max-w-[90vw] font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">
            &bull; The nearest gathering
          </h2>
          <UpcomingEventCard event={upcomingEvent} />
        </section>
      )}

      {/* LMS FEATURED COURSE CAROUSEL */}
      <section className="py-24 relative border-b border-zinc-200 overflow-hidden">
        <div className="relative z-10">
          <div className="mx-auto mb-10 w-full max-w-[90vw] px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">&bull; Learn Tech</span>
                <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Where to start learning</h2>
                <p className="mt-3 max-w-xl text-ink-soft leading-relaxed">
                  Hands-on engineering tracks, AI laboratories, and indigenous math modules built by practitioners.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-ink-soft font-bold bg-white px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                <span>{courseList.length} Active Modules</span>
              </div>
            </div>
          </div>
          <HorizontalRail ariaLabel="Featured courses">
            {courseList.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </HorizontalRail>
        </div>
      </section>

      {/* VENTURE SHOWCASE / JOURNEYS (Expanding Capsules) */}
      <section className="py-24 relative border-b border-zinc-200">
        <div className="relative z-10">
          <div className="mx-auto mb-6 w-full max-w-[90vw] px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">&bull; Student Journeys</span>
                <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Student Journeys & Ventures</h2>
                <p className="mt-3 max-w-xl text-ink-soft leading-relaxed">
                  Alumni startups, open-source AI models, and regional logistics tools that started as a Shega assignment. Hover or click to explore each journey.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-ochre-dark font-bold bg-ochre/10 px-3.5 py-1.5 rounded-full border border-ochre/20">
                <span>✦ Real Ethiopian Impact</span>
              </div>
            </div>
          </div>
          <ExpandingProjectCapsules projects={projectList} />
        </div>
      </section>

      {/* TESTIMONIALS HORIZONTAL RAIL */}
      <section className="py-24 relative overflow-hidden bg-white/20 border-b border-zinc-200">
        <div className="mx-auto mb-10 w-full max-w-[90vw] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">&bull; Alumni Testimonials</span>
              <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Voices of Shega</h2>
              <p className="mt-2 max-w-xl text-ink-soft text-sm sm:text-base leading-relaxed">
                Graduate stories from regional cohorts across Ethiopia — building localized software and launching real ventures.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-ochre-dark font-bold bg-ochre/10 px-3.5 py-1.5 rounded-full border border-ochre/20">
              <span>✓ Verified Graduates</span>
            </div>
          </div>
        </div>

        <HorizontalRail ariaLabel="Alumni testimonials">
          {testimonialList.map((test: any, index: number) => (
            <div
              key={index}
              className="rail-item flex-shrink-0 w-84 sm:w-[420px] rounded-[36px] border border-zinc-200 bg-white p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-ochre/30 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl text-ochre/40 font-serif leading-none select-none">&ldquo;</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-ink-soft font-bold">
                      {test.region} Cohort
                    </span>
                    <span className="rounded-full bg-ochre/10 text-ochre-dark border border-ochre/20 px-2.5 py-1 text-[9px] font-mono font-bold">
                      {test.year}
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-ink-soft italic leading-relaxed text-zinc-700">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-200 shadow-sm flex-shrink-0">
                    <Image
                      src={test.avatar}
                      alt={test.author}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-ink uppercase tracking-wide leading-tight">
                      {test.author}
                    </h4>
                    <p className="text-[11px] font-mono text-ochre-dark font-medium mt-0.5">
                      {test.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HorizontalRail>
      </section>

      {/* SOCIAL MEDIA INTERACTION MODULE */}
      <section className="px-4 py-24 sm:px-6 relative bg-white/20 border-t border-zinc-200">
        <div className="mx-auto w-full max-w-[90vw]">
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
