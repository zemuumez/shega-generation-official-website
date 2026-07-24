import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

export function CourseCard({ course }: { course: any }) {
  return (
    <div className="rail-item group block w-80 sm:w-[410px] flex-shrink-0 overflow-hidden rounded-[32px] border border-zinc-200 bg-white transition-all duration-300 hover:border-[#145A32]/40 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
          <Image
            src={safeImageUrl(course.bannerImage)}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 320px, 410px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Top Badges */}
          <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
            <span className="inline-block px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-white/90 text-ink backdrop-blur-md font-bold shadow-sm">
              {course.badgeCategory || "Course"}
            </span>
            {course.level && (
              <span className="inline-block px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-[#145A32] text-white backdrop-blur-md font-bold shadow-sm">
                {course.level}
              </span>
            )}
          </div>
          {/* Bottom LMS Coming Soon Badge */}
          <div className="absolute right-4 bottom-3 z-20 font-mono text-[10px] bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm">
            <span className="text-amber-400 font-bold">★ {course.rating || "5.0"}</span>
            <span className="text-emerald-300 font-bold">&bull; LMS Coming Soon</span>
          </div>
        </div>

        <div className="p-6">
          <h4 className="font-display text-xl leading-snug font-bold text-ink group-hover:text-[#145A32] transition-colors duration-300 uppercase">
            {course.title}
          </h4>
          <p className="mt-2.5 text-sm text-ink-soft line-clamp-3 leading-relaxed">{course.snippet}</p>

          {/* Tech Stack Pills */}
          {course.tags && course.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {course.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 text-[9px] font-mono text-ink-soft font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">Prepared By</span>
          <span className="text-ink font-extrabold text-xs mt-0.5">{course.instructor}</span>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: any }) {
  return (
    <a
      href={project.projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="rail-item group block w-72 overflow-hidden rounded-[32px] border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent z-10" />
        <Image
          src={safeImageUrl(project.image)}
          alt={project.title}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 relative z-20">
        <span className="inline-block px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ink/5 text-ink border border-zinc-200 font-bold">
          {project.category}
        </span>
        <h4 className="mt-4 font-display text-lg leading-snug font-bold text-ink group-hover:text-ink/80 transition-colors duration-300 uppercase">
          {project.title}
        </h4>
        <p className="mt-2 text-sm text-ink-soft line-clamp-2 leading-relaxed">{project.description}</p>
        <p className="mt-4 text-xs font-mono text-ink-soft/60">by {project.creatorName}</p>
      </div>
    </a>
  );
}

export function EventCard({ event }: { event: any }) {
  const date = new Date(event.eventDate);
  return (
    <div className="rail-item w-80 overflow-hidden rounded-[32px] border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-300 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={safeImageUrl(event.coverImage)}
          alt={event.title}
          fill
          sizes="320px"
          className="object-cover"
        />
        {!event.isUpcoming && (
          <span className="absolute left-4 top-4 z-20 bg-ink text-white px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest border border-zinc-700">
            Past
          </span>
        )}
      </div>
      <div className="p-6 relative z-20">
        <span className="inline-block px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ink/5 text-ink border border-zinc-200 font-bold">
          {event.type}
        </span>
        <h4 className="mt-4 font-display text-lg leading-snug font-bold text-ink uppercase">{event.title}</h4>
        <p className="mt-2 text-sm text-ink-soft">{event.location}</p>
        <p className="mt-4 text-xs font-mono text-ink-soft/60">
          {date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
