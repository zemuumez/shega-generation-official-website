import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

export function CourseCard({ course }: { course: any }) {
  return (
    <a
      href={course.externalLmsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="rail-item group block w-72 overflow-hidden rounded-[32px] border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent z-10" />
        <Image
          src={safeImageUrl(course.bannerImage)}
          alt={course.title}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 relative z-20">
        <span className="inline-block px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ink/5 text-ink border border-zinc-200 font-bold">
          {course.badgeCategory}
        </span>
        <h4 className="mt-4 font-display text-lg leading-snug font-bold text-ink group-hover:text-ink/80 transition-colors duration-300 uppercase">
          {course.title}
        </h4>
        <p className="mt-2 text-sm text-ink-soft line-clamp-2 leading-relaxed">{course.snippet}</p>
        <p className="mt-4 text-xs font-mono text-ink-soft/60">with {course.instructor}</p>
      </div>
    </a>
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
