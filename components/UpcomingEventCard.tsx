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

  const [remaining, setRemaining] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRemaining(Math.max(0, parseTarget(target) - Date.now()));
    setMounted(true);

    const id = setInterval(() => {
      setRemaining(Math.max(0, parseTarget(target) - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  return { days, hours, minutes, seconds, mounted };
}

export default function UpcomingEventCard({ event }: { event: EventDoc | null }) {
  const { days, hours, minutes, seconds, mounted } = useCountdown(event?.eventDate ?? "");

  if (!event) return null;

  const displayDays = mounted ? days : 0;
  const displayHours = mounted ? hours : 0;
  const displayMinutes = mounted ? minutes : 0;
  const displaySeconds = mounted ? seconds : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto grid w-full max-w-[90vw] grid-cols-1 overflow-hidden rounded-[40px] border border-zinc-200 bg-white sm:grid-cols-2 shadow-lg"
    >
      <div className="relative aspect-[4/3] sm:aspect-auto overflow-hidden">
        <Image
          src={safeImageUrl(event.coverImage)}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-between p-8 sm:p-10 relative z-20">
        <div>
          <h3 className="font-display text-display-md font-bold text-ink leading-tight uppercase">{event.title}</h3>
          <p className="mt-2 text-sm text-ink-soft font-medium">
            {event.location}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3 font-mono">
          {[
            { label: "days", value: displayDays },
            { label: "hrs", value: displayHours },
            { label: "min", value: displayMinutes },
            { label: "sec", value: displaySeconds },
          ].map((unit) => (
            <div key={unit.label} className="rounded-full bg-zinc-50 border border-zinc-100 p-3 text-center aspect-square flex flex-col justify-center items-center transition-all duration-300 hover:border-ochre/20">
              <div className="text-xl font-bold text-ink leading-none">{String(unit.value).padStart(2, "0")}</div>
              <div className="text-[8px] uppercase tracking-widest text-ink-soft/60 mt-1 leading-none">{unit.label}</div>
            </div>
          ))}
        </div>

        <a
          href={event.registrationLink}
          className="mt-8 inline-flex w-full sm:w-fit justify-center items-center gap-2 rounded-full bg-ochre px-8 py-4 text-xs font-mono uppercase tracking-widest text-white transition-all duration-300 hover:bg-ochre-dark hover:shadow-lg hover:shadow-ochre/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          Register for Gathering
        </a>
      </div>
    </motion.div>
  );
}
