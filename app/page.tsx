import HorizontalRail from "@/components/HorizontalRail";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import { CourseCard } from "@/components/Cards";
import ExpandingProjectCapsules from "@/components/ExpandingProjectCapsules";
import InteractiveProgramExplorer from "@/components/InteractiveProgramExplorer";
import TibebPattern from "@/components/TibebPattern";
import LeafPattern from "@/components/LeafPattern";
import CurriculumSplitSection from "@/components/CurriculumSplitSection";
import TypewriterTitle from "@/components/TypewriterTitle";
import PartnersSection from "@/components/PartnersSection";
import ThemeProvider from "@/components/ThemeProvider";
import Image from "next/image";
import { safeFetch, safeImageUrl } from "@/sanity/lib/client";
import { UPCOMING_EVENT_QUERY, FEATURED_COURSES_QUERY, PROJECTS_QUERY, SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY, PARTNERS_QUERY } from "@/sanity/lib/queries";
import { demoUpcomingEvent, demoCourses, demoProjects, demoTestimonials, demoPartners } from "@/lib/demoData";

export const revalidate = 0;

export default async function HomePage() {
  const siteSettings = await safeFetch(SITE_SETTINGS_QUERY, {}, {} as any);
  const upcomingEvent = await safeFetch(UPCOMING_EVENT_QUERY, {}, demoUpcomingEvent);
  const fetchedCourses = await safeFetch(FEATURED_COURSES_QUERY, {}, demoCourses);
  const fetchedProjects = await safeFetch(PROJECTS_QUERY, {}, demoProjects);
  const fetchedTestimonials = await safeFetch(TESTIMONIALS_QUERY, {}, demoTestimonials);
  const fetchedPartners = await safeFetch(PARTNERS_QUERY, {}, demoPartners);

  const courseList = (fetchedCourses && fetchedCourses.length > 0) ? fetchedCourses : demoCourses;
  const projectList = (fetchedProjects && fetchedProjects.length > 0) ? fetchedProjects : demoProjects;
  const testimonialList = (fetchedTestimonials && fetchedTestimonials.length > 0) ? fetchedTestimonials : demoTestimonials;
  const partnerList = (fetchedPartners && fetchedPartners.length > 0) ? fetchedPartners : demoPartners;

  const heroTitle = siteSettings?.heroTitle || "Shega Generation";
  const heroCaption = siteSettings?.heroCaption || "Sharing knowledge in kindness across generations — fusing software engineering and AI with Ethiopian heritage to empower future leaders.";
  const heroCtaPrimary = siteSettings?.heroCtaPrimary || "Apply for Summer Camp";
  const heroCtaSecondary = siteSettings?.heroCtaSecondary || "Partner & Sponsor";
  const heroTitleMaskBg = siteSettings?.heroTitleBgImage ? safeImageUrl(siteSettings.heroTitleBgImage, 1600, "/images/hero-bg.png") : "/images/hero-bg.png";

  const statement1 = siteSettings?.statementBannerTitle1 || "Software & AI Labs";
  const statement2 = siteSettings?.statementBannerTitle2 || "Indigenous Wisdom & Erq";
  const statement3 = siteSettings?.statementBannerTitle3 || "Youth Leadership";
  const statementBannerBg = siteSettings?.statementBannerImage ? safeImageUrl(siteSettings.statementBannerImage, 1600, "/images/hero-bg.png") : "/images/hero-bg.png";

  const culturalSubtitle = siteSettings?.culturalAnchoringSubtitle || "Rooted in Ethiopian Heritage & Character";
  const culturalDescription = siteSettings?.culturalAnchoringDescription || "From ancient Ge'ez fundamentals and Ethiopian history to traditional dining etiquette (የማዕድ ስነ-ስርዓት) and positive communication (ፈገግታና አዎንታዊ ተግባቦት), we nurture technically elite, culturally grounded leaders.";
  const culturalAnchoringBg = siteSettings?.culturalAnchoringImage ? safeImageUrl(siteSettings.culturalAnchoringImage, 1600, "/images/hero-bg.png") : "/images/hero-bg.png";
  const eventsKicker = siteSettings?.eventsSectionKicker || "The nearest gathering";
  const journeysKicker = siteSettings?.journeysKicker || "Student Media Coverage & Achievements";
  const journeysTitle = siteSettings?.journeysTitle || "Student Interviews & Media Features";
  const journeysDescription = siteSettings?.journeysDescription || "Radio interviews, podcast features, Facebook broadcasts, and software projects executed by Shega Generation students.";
  const communityKicker = siteSettings?.communityKicker || "Community";
  const communityTitle = siteSettings?.communityTitle || "Follow the day to day";
  const facebookHandle = siteSettings?.socialFacebookHandle || "Shega Community Group";
  const facebookUrl = siteSettings?.socialFacebookUrl || "https://web.facebook.com/share/g/18foDKzcBS/";
  const telegramHandle = siteSettings?.socialTelegramHandle || "t.me/shegagenerations";
  const telegramUrl = siteSettings?.socialTelegramUrl || "https://t.me/shegagenerations";
  const tiktokHandle = siteSettings?.socialTikTokHandle || "@samuelgeremew_21";
  const tiktokUrl = siteSettings?.socialTikTokUrl || "https://www.tiktok.com/@samuelgeremew_21";
  const curriculumOverview = siteSettings?.curriculumOverview;

  const socialChannels = [
    {
      name: "Facebook",
      handle: facebookHandle,
      url: facebookUrl,
      badgeColor: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20",
      accent: "text-[#1877F2]",
    },
    {
      name: "Telegram",
      handle: telegramHandle,
      url: telegramUrl,
      badgeColor: "bg-[#229ED9]/10 text-[#229ED9] border-[#229ED9]/20",
      accent: "text-[#229ED9]",
    },
    {
      name: "TikTok",
      handle: tiktokHandle,
      url: tiktokUrl,
      badgeColor: "bg-black/90 text-white border-black/20",
      accent: "text-zinc-900",
    },
  ];

  return (
    <>
      <ThemeProvider siteSettings={siteSettings} />

      {/* HERO PORTAL */}
      <section className="relative min-h-[calc(100dvh-76px)] flex flex-col justify-center items-center overflow-hidden px-6 py-12 md:py-20 bg-[#F4F3EE]">
        {/* Left Side Framing border ribbon */}
        <div className="absolute left-0 top-0 bottom-0 w-[22vw] max-w-xs z-0 pointer-events-none opacity-15 hidden md:block [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] [-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] select-none">
          <img
            src="/images/pattern1.svg"
            alt=""
            className="h-full w-full object-cover object-left scale-x-[-1]"
          />
        </div>

        {/* Right Side Framing border ribbon */}
        <div className="absolute right-0 top-0 bottom-0 w-[22vw] max-w-xs z-0 pointer-events-none opacity-15 hidden md:block [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] [-webkit-mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0)_85%)] select-none">
          <img
            src="/images/pattern1.svg"
            alt=""
            className="h-full w-full object-cover object-left"
          />
        </div>

        <div className="relative mx-auto max-w-7xl z-20 flex flex-col items-center justify-center w-full">
          
          {/* Giant Typewriter Title - Types and Backspaces in a Loop */}
          <div className="flex flex-col items-center justify-center text-center mt-2 sm:mt-4 select-none w-full min-h-[2.1em]">
            <TypewriterTitle
              phrases={[heroTitle || "Shega Generation", "ሸጋ ትውልድ"]}
              className="font-display font-black text-[clamp(3.4rem,12vw,6.8rem)] sm:text-[clamp(5.4rem,11.5vw,10rem)] leading-[0.94] uppercase text-masked-bg text-center max-w-full drop-shadow-sm flex flex-col items-center justify-center py-2"
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(46, 204, 112, 0.12), rgba(39, 174, 95, 0.17)), url('${heroTitleMaskBg}')` }}
            />
          </div>

          <div className="mt-6 sm:mt-8 mx-auto max-w-2xl text-center">
            <p className="text-base sm:text-xl text-ink/80 leading-relaxed font-sans font-medium px-4 tracking-wide">
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
        <Image
          src={statementBannerBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/45 to-black/35 z-10" />
        
        <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 select-none leading-[0.95]">
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-wider drop-shadow-md">
            {statement1}
          </h2>
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl stroke-text uppercase tracking-wider mt-3 drop-shadow-md">
            {statement2}
          </h2>
          <h2 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-wider mt-3 drop-shadow-md">
            {statement3}
          </h2>
        </div>
      </section>

      {/* HALF-PAGE SPLIT SCROLL CURRICULUM SECTION */}
      <CurriculumSplitSection />

      {/* PARALLAX PHILOSOPHY BANNER */}
      <section className="relative h-[65vh] min-h-[440px] w-full overflow-hidden flex items-center justify-center select-none">
        <Image
          src={culturalAnchoringBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45 z-10" />
        <div className="relative z-20 max-w-4xl text-center px-6">
          <span className="font-mono text-xs uppercase tracking-widest text-orange-300 font-bold drop-shadow-sm"> {culturalSubtitle}</span>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-wider leading-tight drop-shadow-md">
            We weave modern technology with cultural roots
          </h2>
          <p className="mt-6 text-zinc-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-medium drop-shadow-sm">
            {culturalDescription}
          </p>
        </div>
      </section>

      {/* INTERACTIVE TRACK EXPLORER */}
      <section className="py-24 border-b border-zinc-200 relative">
        {/* Background Geometric Line Pattern - Bleeds outward without breaking section entrance scroll */}
        <div className="absolute inset-y-0 -right-8 md:-right-14 w-96 pointer-events-none opacity-60 z-0 hidden lg:block [mask-image:linear-gradient(to_left,white_50%,transparent_100%)]">
          <TibebPattern variant="watermark" tone="ochre" className="opacity-15 w-full h-full object-cover" />
        </div>

        <InteractiveProgramExplorer />
      </section>

      {/* CURRICULUM OVERVIEW BREAKOUT */}
      {curriculumOverview && (
        <section className="py-24 border-b border-zinc-200 bg-white/40">
          <div className="mx-auto max-w-[90vw] px-4 sm:px-6 text-center max-w-4xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre font-bold block mb-4">
              Comprehensive Curriculum
            </span>
            <h2 className="font-display text-display-md font-bold text-ink uppercase tracking-wide">
              {curriculumOverview.title || "Full Educational Roadmap"}
            </h2>
            <p className="mt-6 text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto font-sans font-medium">
              {curriculumOverview.description}
            </p>
          </div>
        </section>
      )}

      {/* UPCOMING EVENT ACCENT HERO */}
      {upcomingEvent && (
        <section className="px-4 py-24 sm:px-6 relative border-b border-zinc-200">
          <h2 className="mx-auto mb-10 w-full max-w-[90vw] font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold">
             {eventsKicker}
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
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre font-bold"> LMS & Program Curriculum</span>
                <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Where to start learning</h2>
                <p className="mt-3 max-w-xl text-ink-soft leading-relaxed">
                  Hands-on engineering tracks, AI laboratories, and indigenous math modules prepared by Shega Generation, Sophor Code Academy, and TTI Hospitality.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-ochre font-bold bg-ochre/10 px-4 py-2 rounded-full border border-ochre/30 shadow-sm animate-pulse">
                <span>LMS Coming Soon</span>
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

      {/* STUDENT MEDIA COVERAGE & ACHIEVEMENTS (Expanding Capsules) */}
      <section className="py-24 relative border-b border-zinc-200">
        <div className="relative z-10">
          <div className="mx-auto mb-6 w-full max-w-[90vw] px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre font-bold">
                  {journeysKicker}
                </span>
                <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">
                  {journeysTitle}
                </h2>
                <p className="mt-3 max-w-xl text-ink-soft leading-relaxed">
                  {journeysDescription}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-ochre font-bold bg-ochre/10 px-3.5 py-1.5 rounded-full border border-ochre/20">
                <span>Radio, Podcasts &amp; Facebook Features</span>
              </div>
            </div>
          </div>
          <ExpandingProjectCapsules
            projects={projectList}
            customCategories={siteSettings?.journeysCategories}
          />
        </div>
      </section>

      {/* TESTIMONIALS HORIZONTAL RAIL */}
      <section className="py-24 relative overflow-hidden bg-white/20 border-b border-zinc-200">
        <div className="mx-auto mb-10 w-full max-w-[90vw] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/65 font-bold"> Alumni Testimonials</span>
              <h2 className="mt-2 font-display text-display-md font-bold text-ink uppercase tracking-wide">Voices of Shega</h2>
              <p className="mt-2 max-w-xl text-ink-soft text-sm sm:text-base leading-relaxed">
                Graduate stories from regional cohorts across Ethiopia — building localized software and launching real ventures.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-ochre-dark font-bold bg-ochre/10 px-3.5 py-1.5 rounded-full border border-ochre/20">
              <span>Verified Graduates</span>
            </div>
          </div>
        </div>

        <HorizontalRail ariaLabel="Alumni testimonials">
          {testimonialList.map((test: any, index: number) => {
            const avatarSrc = safeImageUrl(test.avatarImage || test.avatar, 300, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300");
            const locationTag = test.location || test.region || "Addis Ababa";
            const trackTag = test.track || test.year || "Summer Cohort";

            return (
              <div
                key={test._id || index}
                className="rail-item flex-shrink-0 w-84 sm:w-[420px] rounded-[36px] border border-zinc-200 bg-white p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-ochre/30 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl text-ochre/40 font-serif leading-none select-none">&ldquo;</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-ink-soft font-bold">
                        {locationTag}
                      </span>
                      <span className="rounded-full bg-ochre/10 text-ochre-dark border border-ochre/20 px-2.5 py-1 text-[9px] font-mono font-bold">
                        {trackTag}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-ink-soft italic leading-relaxed text-zinc-700">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-ochre/20 shadow-sm flex-shrink-0 bg-zinc-100">
                      <Image
                        src={avatarSrc}
                        alt={test.author || "Testimonial author"}
                        fill
                        sizes="48px"
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
            );
          })}
        </HorizontalRail>
      </section>

      {/* STRATEGIC INSTITUTIONAL PARTNERS SHOWCASE */}
      <PartnersSection partners={partnerList} />

      {/* SOCIAL MEDIA INTERACTION MODULE */}
      <section className="px-4 py-24 sm:px-6 relative bg-white border-t border-zinc-200">
        <div className="mx-auto w-full max-w-[90vw]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre font-bold block mb-2">
             {communityKicker}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink uppercase tracking-wide">
            {communityTitle}
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl border border-zinc-200/90 bg-white p-7 group hover:border-ochre/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border font-bold ${channel.badgeColor}`}>
                      {channel.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-ochre transition-colors">
                      Follow &rarr;
                    </span>
                  </div>

                  <p className="mt-5 font-display text-xl font-extrabold text-ink group-hover:text-ochre transition-colors duration-300">
                    {channel.handle}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between font-mono text-xs text-zinc-400 font-semibold group-hover:text-zinc-600 transition-colors">
                  <span>Connect on {channel.name}</span>
                  <span className="text-ochre font-bold">● Live</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
