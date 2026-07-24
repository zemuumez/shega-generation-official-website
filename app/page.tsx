import HorizontalRail from "@/components/HorizontalRail";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import { CourseCard } from "@/components/Cards";
import ExpandingProjectCapsules from "@/components/ExpandingProjectCapsules";
import InteractiveProgramExplorer from "@/components/InteractiveProgramExplorer";
import TibebPattern from "@/components/TibebPattern";
import LeafPattern from "@/components/LeafPattern";
import CurriculumSplitSection from "@/components/CurriculumSplitSection";
import TypewriterTitle from "@/components/TypewriterTitle";
import Image from "next/image";
import { safeFetch, safeImageUrl } from "@/sanity/lib/client";
import { UPCOMING_EVENT_QUERY, FEATURED_COURSES_QUERY, PROJECTS_QUERY, SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY } from "@/sanity/lib/queries";
import { demoUpcomingEvent, demoCourses, demoProjects, demoTestimonials } from "@/lib/demoData";

export const revalidate = 0;

export default async function HomePage() {
  const siteSettings = await safeFetch(SITE_SETTINGS_QUERY, {}, {} as any);
  const upcomingEvent = await safeFetch(UPCOMING_EVENT_QUERY, {}, demoUpcomingEvent);
  const fetchedCourses = await safeFetch(FEATURED_COURSES_QUERY, {}, demoCourses);
  const fetchedProjects = await safeFetch(PROJECTS_QUERY, {}, demoProjects);
  const fetchedTestimonials = await safeFetch(TESTIMONIALS_QUERY, {}, demoTestimonials);

  const courseList = (fetchedCourses && fetchedCourses.length > 0) ? fetchedCourses : demoCourses;
  const projectList = (fetchedProjects && fetchedProjects.length > 0) ? fetchedProjects : demoProjects;
  const testimonialList = (fetchedTestimonials && fetchedTestimonials.length > 0) ? fetchedTestimonials : demoTestimonials;

  const heroTitle = siteSettings?.heroTitle || "Shega Generation";
  const heroCaption = siteSettings?.heroCaption || "Shaping a well-rounded youth demographic in Addis Ababa and across Ethiopia by blending cutting-edge software engineering and AI with Ethiopian cultural values, indigenous knowledge, and hands-on personal development.";
  const heroCtaPrimary = siteSettings?.heroCtaPrimary || "Apply for Summer Camp";
  const heroCtaSecondary = siteSettings?.heroCtaSecondary || "Partner & Sponsor";

  const statement1 = siteSettings?.statementBannerTitle1 || "Software & AI Labs";
  const statement2 = siteSettings?.statementBannerTitle2 || "Indigenous Wisdom & Erq";
  const statement3 = siteSettings?.statementBannerTitle3 || "Youth Leadership";
  const statementBannerBg = siteSettings?.statementBannerImage ? safeImageUrl(siteSettings.statementBannerImage, 1600, "/images/hero-bg.png") : "/images/hero-bg.png";

  const culturalSubtitle = siteSettings?.culturalAnchoringSubtitle || "Rooted in Ethiopian Heritage & Character";
  const culturalDescription = siteSettings?.culturalAnchoringDescription || "From ancient Ge'ez fundamentals and Ethiopian history to traditional dining etiquette (የማዕድ ስነ-ስርዓት) and positive communication (ፈገግታና አዎንታዊ ተግባቦት), we nurture technically elite, culturally grounded leaders.";
  const culturalAnchoringBg = siteSettings?.culturalAnchoringImage ? safeImageUrl(siteSettings.culturalAnchoringImage, 1600, "/images/hero-bg.png") : "/images/hero-bg.png";

  return (
    <>
      {/* HERO PORTAL */}
      <section className="relative min-h-[calc(100dvh-76px)] flex flex-col justify-center items-center overflow-hidden px-6 py-12 md:py-20 bg-[#F4F3EE]">
        {/* Left Side Framing border ribbon */}
        <div className="absolute left-0 top-0 bottom-0 w-[42vw] max-w-2xl z-0 pointer-events-none opacity-20 hidden md:block [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] [-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)]">
          <img
            src="/images/pattern1.svg"
            alt=""
            className="h-full w-full object-cover object-left scale-x-[-1]"
          />
        </div>

        {/* Right Side Framing border ribbon */}
        <div className="absolute right-0 top-0 bottom-0 w-[42vw] max-w-2xl z-0 pointer-events-none opacity-20 hidden md:block [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] [-webkit-mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)]">
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
              text={heroTitle}
              className="font-display font-extrabold text-[clamp(2.5rem,9vw,4.5rem)] sm:text-[clamp(4.2rem,8.5vw,7.5rem)] leading-[1.05] tracking-[0.04em] sm:tracking-[0.06em] uppercase text-masked-bg text-center max-w-full"
            />
          </div>

          <div className="mt-8 sm:mt-12 mx-auto max-w-3xl text-center">
            <p className="text-lg sm:text-2xl text-ink-soft leading-relaxed font-sans font-medium px-4">
              {heroCaption}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/events"
                className="w-full sm:w-auto bg-ochre px-9 py-4 rounded-full text-xs font-mono uppercase tracking-widest text-white transition-all duration-300 hover:bg-ochre-dark hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center font-bold"
              >
                {heroCtaPrimary}
              </a>
              <a
                href="/donate"
                className="w-full sm:w-auto border border-ink/40 text-ink hover:border-ochre hover:text-ochre px-9 py-4 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 text-center font-bold"
              >
                {heroCtaSecondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH PHOTO OVERLAY STATEMENT BANNER WITH PARALLAX EFFECT */}
      <section className="relative w-full h-[55vh] min-h-[420px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url('${statementBannerBg}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/35 z-10" />
        
        <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 select-none leading-[0.95]">
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-wider">
            {statement1}
          </h2>
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl stroke-text uppercase tracking-wider mt-3">
            {statement2}
          </h2>
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-wider mt-3">
            {statement3}
          </h2>
        </div>
      </section>

      {/* HALF-PAGE SPLIT SCROLL CURRICULUM SECTION */}
      <CurriculumSplitSection />

      {/* PARALLAX PHILOSOPHY BANNER */}
      <section className="relative h-[65vh] min-h-[440px] w-full overflow-hidden flex items-center justify-center bg-fixed bg-cover bg-center select-none" style={{ backgroundImage: `url('${culturalAnchoringBg}')` }}>
        <div className="absolute inset-0 bg-black/65 z-10" />
        <div className="relative z-20 max-w-4xl text-center px-6">
          <span className="font-mono text-xs uppercase tracking-widest text-ink/65 font-bold">&bull; {culturalSubtitle}</span>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-wider leading-tight">
            We weave modern technology with cultural roots
          </h2>
          <p className="mt-6 text-zinc-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {culturalDescription}
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

      {/* STRATEGIC INSTITUTIONAL PARTNERS SHOWCASE */}
      <section className="px-4 py-24 sm:px-6 relative bg-white border-t border-zinc-200">
        <div className="mx-auto w-full max-w-[90vw]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre-dark font-bold">
            &bull; Institutional Credibility
          </span>
          <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">
            Key Strategic Partners
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft leading-relaxed">
            Shega Generation collaborates closely with leading educational, hospitality, media, and event institutions across Addis Ababa to deliver world-class programs.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sofor Code Academy",
                role: "Advanced Coding & Robotics Partner",
                desc: "Direct partner handling advanced programming languages, Python, AI command engineering, and robotics curriculum execution.",
                tag: "Curriculum & Tech",
              },
              {
                name: "Tourism Training Institute (TTI)",
                role: "Facility & Hospitality Partner",
                desc: "Facility partner providing computer laboratories, green spaces, and practical hospitality training environments.",
                tag: "Labs & Venue",
              },
              {
                name: "Guenet Hotel Mexico",
                role: "Hospitality & Venue Partner",
                desc: "Hospitality and official event venue partner hosting workshops, cohort showcases, and cultural gatherings.",
                tag: "Events Venue",
              },
              {
                name: "Samilos Media & Communications",
                role: "Media & Production Partner",
                desc: "Media production and coverage partner documenting cohort progress, student documentaries, and national broadcasts.",
                tag: "Media & Coverage",
              },
              {
                name: "Enqu Events",
                role: "Event Production & Logistics Partner",
                desc: "Event organizing and production partner coordinating national student showcases and community drives.",
                tag: "Event Production",
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="rounded-[32px] border border-zinc-200 bg-[#F4F3EE]/50 p-7 hover:border-ochre/40 transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest bg-white border border-zinc-200 text-ochre-dark font-bold mb-4">
                    {partner.tag}
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink uppercase tracking-wide">
                    {partner.name}
                  </h3>
                  <p className="font-mono text-xs text-ochre-dark font-semibold mt-1">
                    {partner.role}
                  </p>
                  <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                    {partner.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
