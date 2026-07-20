import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

export function CourseCard({ course }: { course: any }) {
  return (
    <a
      href={course.externalLmsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="rail-item group block w-72 overflow-hidden rounded-xl border border-zinc-200/60 bg-white transition-all duration-300 hover:border-ochre/40 hover:shadow-md hover:-translate-y-1"
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
      <div className="p-5 relative z-20">
        <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-ochre/10 text-ochre border border-ochre/20">
          {course.badgeCategory}
        </span>
        <h4 className="mt-3 font-display text-lg leading-snug font-semibold text-ink group-hover:text-ochre transition-colors duration-300">
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
      className="rail-item group block w-72 overflow-hidden rounded-xl border border-zinc-200/60 bg-white transition-all duration-300 hover:border-indigo/40 hover:shadow-md hover:-translate-y-1"
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
      <div className="p-5 relative z-20">
        <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-indigo/10 text-indigo border border-indigo/20">
          {project.category}
        </span>
        <h4 className="mt-3 font-display text-lg leading-snug font-semibold text-ink group-hover:text-indigo transition-colors duration-300">
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
    <div className="rail-item w-80 overflow-hidden rounded-xl border border-zinc-200/60 bg-white transition-all duration-300 hover:border-brick/40 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={safeImageUrl(event.coverImage)}
          alt={event.title}
          fill
          sizes="320px"
          className="object-cover"
        />
        {!event.isUpcoming && (
          <span className="absolute left-3 top-3 z-20 bg-ink/80 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest text-ivory border border-zinc-700">
            Past
          </span>
        )}
      </div>
      <div className="p-5 relative z-20">
        <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-brick/10 text-brick border border-brick/20">
          {event.type}
        </span>
        <h4 className="mt-3 font-display text-lg leading-snug font-semibold text-ink">{event.title}</h4>
        <p className="mt-2 text-sm text-ink-soft">{event.location}</p>
        <p className="mt-4 text-xs font-mono text-ink-soft/60">
          {date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
