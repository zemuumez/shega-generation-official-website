import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

export function CourseCard({ course }: { course: any }) {
  return (
    <a
      href={course.externalLmsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="rail-item group block w-72 overflow-hidden rounded-sm border border-ink/10 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={safeImageUrl(course.bannerImage)}
          alt={course.title}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ochre">{course.badgeCategory}</p>
        <h4 className="mt-1.5 font-display text-lg leading-snug">{course.title}</h4>
        <p className="mt-1.5 text-sm text-ink-soft">{course.snippet}</p>
        <p className="mt-3 text-xs font-mono text-ink-soft/70">with {course.instructor}</p>
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
      className="rail-item group block w-72 overflow-hidden rounded-sm border border-ink/10 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={safeImageUrl(project.image)}
          alt={project.title}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-indigo">{project.category}</p>
        <h4 className="mt-1.5 font-display text-lg leading-snug">{project.title}</h4>
        <p className="mt-1.5 text-sm text-ink-soft">{project.description}</p>
        <p className="mt-3 text-xs font-mono text-ink-soft/70">by {project.creatorName}</p>
      </div>
    </a>
  );
}

export function EventCard({ event }: { event: any }) {
  const date = new Date(event.eventDate);
  return (
    <div className="rail-item w-80 overflow-hidden rounded-sm border border-ink/10 bg-white">
      <div className="relative aspect-[16/10]">
        <Image
          src={safeImageUrl(event.coverImage)}
          alt={event.title}
          fill
          sizes="320px"
          className="object-cover"
        />
        {!event.isUpcoming && (
          <span className="absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-ivory">
            Past
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-brick">{event.type}</p>
        <h4 className="mt-1.5 font-display text-lg leading-snug">{event.title}</h4>
        <p className="mt-1.5 text-sm text-ink-soft">{event.location}</p>
        <p className="mt-3 text-xs font-mono text-ink-soft/70">
          {date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
