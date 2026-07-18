"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { safeImageUrl } from "@/sanity/lib/client";

type EventDoc = {
  _id: string;
  title: string;
  type: string;
  location: string;
  eventDate: string;
  registrationLink: string;
  coverImage?: any;
};

function useCountdown(target: string) {
  const parseTarget = (t: string) => {
    if (!t) return 0;
    const time = new Date(t).getTime();
    return isNaN(time) ? 0 : time;
  };

  const [remaining, setRemaining] = useState(() => Math.max(0, parseTarget(target) - Date.now()));

  useEffect(() => {
    if (!target) {
      setRemaining(0);
      return;
    }
    const id = setInterval(() => {
      setRemaining(Math.max(0, parseTarget(target) - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function UpcomingEventCard({ event }: { event: EventDoc | null }) {
  const { days, hours, minutes, seconds } = useCountdown(event?.eventDate ?? "");

  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-sm border border-ink/10 bg-white sm:grid-cols-2"
    >
      <div className="relative aspect-[4/3] sm:aspect-auto">
        <Image
          src={safeImageUrl(event.coverImage)}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ochre">
            Next up &middot; {event.type}
          </p>
          <h3 className="mt-2 font-display text-display-md">{event.title}</h3>
          <p className="mt-2 text-sm text-ink-soft">{event.location}</p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2 font-mono">
          {[
            { label: "days", value: days },
            { label: "hrs", value: hours },
            { label: "min", value: minutes },
            { label: "sec", value: seconds },
          ].map((unit) => (
            <div key={unit.label} className="rounded-sm bg-ivory-dim px-2 py-3 text-center">
              <div className="text-2xl">{String(unit.value).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase tracking-widest text-ink-soft/70">{unit.label}</div>
            </div>
          ))}
        </div>

        <a
          href={event.registrationLink}
          className="mt-6 inline-flex w-fit items-center gap-2 border border-ink px-5 py-2.5 text-sm font-mono uppercase tracking-wide transition-colors hover:bg-ink hover:text-ivory"
        >
          Register
        </a>
      </div>
    </motion.div>
  );
}
