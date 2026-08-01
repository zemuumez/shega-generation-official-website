"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TypewriterTitle from "@/components/TypewriterTitle";
import ShegaJourneyExplorer from "@/components/ShegaJourneyExplorer";
import TibebPattern from "@/components/TibebPattern";
import { safeImageUrl } from "@/sanity/lib/client";

const NAME_MAP: Record<string, { english: string; amharic: string }> = {
  "ወ/ሮ ሳህረት ሰፋ": { english: "Sahret Sefa", amharic: "ወ/ሮ ሳህረት ሰፋ" },
  "Sahret Sefa": { english: "Sahret Sefa", amharic: "ወ/ሮ ሳህረት ሰፋ" },
  "ፕሮፌሰር ሰላማዊት መኮንን": { english: "Prof. Selamawit Mekonnen", amharic: "ፕሮፌሰር ሰላማዊት መኮንን" },
  "Prof. Selamawit Mekonnen": { english: "Prof. Selamawit Mekonnen", amharic: "ፕሮፌሰር ሰላማዊት መኮንን" },
  "ዶክተር ሄኖክ ሙሉጌታ": { english: "Dr. Henok Mulugeta", amharic: "ዶክተር ሄኖክ ሙሉጌታ" },
  "Dr. Henok Mulugeta": { english: "Dr. Henok Mulugeta", amharic: "ዶክተር ሄኖክ ሙሉጌታ" },
  "ጥበቡ በለጠ": { english: "Tibebu Belete", amharic: "ጥበቡ በለጠ" },
  "Tibebu Belete": { english: "Tibebu Belete", amharic: "ጥበቡ በለጠ" },
  "ሳሙኤል ገረመው": { english: "Samuel Geremew", amharic: "ሳሙኤል ገረመው" },
  "Samuel Geremew": { english: "Samuel Geremew", amharic: "ሳሙኤል ገረመው" },
  "አቶ ዘሚካኤል ተፈራ": { english: "Zemichael Tefera", amharic: "አቶ ዘሚካኤል ተፈራ" },
  "Zemichael Tefera": { english: "Zemichael Tefera", amharic: "አቶ ዘሚካኤል ተፈራ" },
  "አቶ ቴድሮስ ሞላ": { english: "Tedros Molla", amharic: "አቶ ቴድሮስ ሞላ" },
  "Tedros Molla": { english: "Tedros Molla", amharic: "አቶ ቴድሮስ ሞላ" },
  "አቶ ቶማስ ሃይሉ": { english: "Thomas Hailu", amharic: "አቶ ቶማስ ሃይሉ" },
  "Thomas Hailu": { english: "Thomas Hailu", amharic: "አቶ ቶማስ ሃይሉ" },
  "Dawit Kassaye": { english: "Dawit Kassaye", amharic: "ዳዊት ካሳዬ" },
  "Bethlehem Tadesse": { english: "Bethlehem Tadesse", amharic: "ቤተልሔም ታደሰ" },
  "Yonas Bekele": { english: "Yonas Bekele", amharic: "ዮናስ በቀለ" },
  "Kaleb Tesfaye": { english: "Kaleb Tesfaye", amharic: "ካሌብ ተስፋዬ" },
  "Gebriel Kassahun": { english: "Gebriel Kassahun", amharic: "ገብርኤል ካሳሁን" },
  "Hizkeal": { english: "Hizkeal", amharic: "ሕዝቅኤል" },
};

function parseMemberName(rawName: string = ""): { english: string; amharic: string | null } {
  if (!rawName) return { english: "", amharic: null };
  const match = rawName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { english: match[1].trim(), amharic: match[2].trim() };
  }
  const mapped = NAME_MAP[rawName.trim()];
  if (mapped) {
    return mapped;
  }
  return { english: rawName, amharic: null };
}

const teamFallbackAvatars: Record<string, string> = {
  "Sahret Sefa": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
  "Prof. Selamawit Mekonnen": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600",
  "Dr. Henok Mulugeta": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "Tibebu Belete": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "Samuel Geremew": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  "Zemichael Tefera": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
  "Tedros Molla": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  "Thomas Hailu": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
  "Dawit Kassaye": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "Bethlehem Tadesse": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
  "Yonas Bekele": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "Kaleb Tesfaye": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
};

export default function AboutDirectory({
  teamMembers = [],
  milestones = [],
  pillars = [],
  customPhrases,
  customSubtitle,
  customCampusVision,
  siteSettings,
}: {
  teamMembers?: any[];
  milestones?: any[];
  pillars?: any[];
  customPhrases?: string[];
  customSubtitle?: string;
  customCampusVision?: string;
  siteSettings?: any;
}) {
  const [selectedDept, setSelectedDept] = useState<string>("executive");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 25);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 25);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const defaultPhrases = [
    "OUR MISSION & STORY",
    "የማህበረሰባችን ታሪክና ራእይ",
    "WEYN COFFEE TO FUTURE CAMPUS",
    "KINDNESS & KNOWLEDGE IN ACTION",
  ];

  const phrases = customPhrases && customPhrases.length > 0 ? customPhrases : defaultPhrases;

  // Filter and Sort Team Members by numerical order
  const boardMembers = useMemo(() => {
    return teamMembers
      .filter((m) => {
        if (m.isBoardMember === true) return true;
        if (Array.isArray(m.departments) && m.departments.includes("board")) return true;
        if (m.department === "board") return true;
        return false;
      })
      .sort((a, b) => (a.order || 99) - (b.order || 99));
  }, [teamMembers]);

  const execMembers = useMemo(() => {
    return teamMembers
      .filter((m) => {
        if (m.isExecutiveLeader === true) return true;
        if (Array.isArray(m.departments) && (m.departments.includes("executive") || m.departments.includes("leadership"))) return true;
        if (m.department === "executive" || m.department === "leadership") return true;
        return false;
      })
      .sort((a, b) => (a.order || 99) - (b.order || 99));
  }, [teamMembers]);

  const teacherMembers = useMemo(() => {
    return teamMembers
      .filter((m) => {
        if (m.isTeacher === true) return true;
        if (Array.isArray(m.departments) && m.departments.includes("tech")) return true;
        if (m.department === "tech" || Boolean(m.teachingSubject)) return true;
        return false;
      })
      .sort((a, b) => (a.order || 99) - (b.order || 99));
  }, [teamMembers]);

  const allMembersSorted = useMemo(() => {
    return [...teamMembers].sort((a, b) => (a.order || 99) - (b.order || 99));
  }, [teamMembers]);

  const filteredTeam = useMemo(() => {
    if (selectedDept === "board") return boardMembers;
    if (selectedDept === "teachers" || selectedDept === "tech") return teacherMembers;
    if (selectedDept === "executive") return execMembers;
    return allMembersSorted;
  }, [selectedDept, boardMembers, teacherMembers, execMembers, allMembersSorted]);

  const defaultStats = [
    { label: "Talented Geniuses Trained", value: "500+", color: "text-ochre" },
    { label: "Tuition Cost to Students", value: "100% Free", color: "text-navy" },
    { label: "Summer & Annual Cohorts", value: "12+", color: "text-ochre" },
    { label: "Institutional Partners", value: "15+", color: "text-navy" },
  ];

  const stats = (siteSettings?.aboutHeroStats && siteSettings.aboutHeroStats.length > 0)
    ? siteSettings.aboutHeroStats.map((st: any, i: number) => ({
        ...st,
        color: i % 2 === 0 ? "text-ochre" : "text-navy",
      }))
    : defaultStats;

  const defaultPillars = [
    {
      title: "Computational Supremacy",
      titleAmharic: "የኮምፒውተርና አይ-ኦቲ ትምህርት",
      description: "From Scratch & Python to AI Command Engineering, Full-Stack web development, cybersecurity, and robotics.",
      icon: (
        <svg className="w-6 h-6 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      tags: ["Python", "AI Engineering", "Web Dev", "Robotics"],
    },
    {
      title: "Indigenous Heritage & Ge'ez",
      titleAmharic: "ሀገር በቀል እውቀትና ግዕዝ",
      description: "Unlocking ancient Ge'ez numeral systems, traditional architectural secrets, Ethiopian history, and Erq conflict resolution.",
      icon: (
        <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      tags: ["Ge'ez", "Ethiopian History", "Architecture Secrets", "Erq"],
    },
    {
      title: "Etiquette & Hospitality",
      titleAmharic: "የማዕድ ስነ-ስርዓትና ስነ-ምግባር",
      description: "Practical instruction in የማዕድ ስነ-ስርዓት (Dining Etiquette), ፈገግታና አዎንታዊ ተግባቦት (Positive Communication) in partnership with TTI.",
      icon: (
        <svg className="w-6 h-6 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      tags: ["የማዕድ ስነ-ስርዓት", "Hospitality", "Public Speaking", "Character"],
    },
    {
      title: "Youth Mentorship & Software Lab",
      titleAmharic: "የተማሪዎች ሶፍትዌር ላብ",
      description: "Senior students mentor junior cohorts and execute commercial client software contracts—gaining real industry experience.",
      icon: (
        <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      tags: ["Peer Mentorship", "Commercial Lab", "Client Projects", "Incubation"],
    },
  ];

  const activePillarsList = (pillars && pillars.length > 0)
    ? pillars
    : (siteSettings?.aboutPillarsList && siteSettings.aboutPillarsList.length > 0)
      ? siteSettings.aboutPillarsList
      : null;

  const resolvedPillars = activePillarsList
    ? activePillarsList.map((p: any, idx: number) => ({
        title: p.title || defaultPillars[idx % defaultPillars.length].title,
        titleAmharic: p.titleAmharic || defaultPillars[idx % defaultPillars.length].titleAmharic,
        description: p.description || defaultPillars[idx % defaultPillars.length].description,
        tags: (p.tags && p.tags.length > 0) ? p.tags : defaultPillars[idx % defaultPillars.length].tags,
        icon: defaultPillars[idx % defaultPillars.length].icon,
      }))
    : defaultPillars;

  const renderMemberCard = (member: any, index = 0) => {
    const isBoard = member.department === "board";
    const isExec = member.department === "executive" || member.department === "leadership";
    const isTech = member.department === "tech";

    // Alternate layout direction: Even index = Text on Left, Photo on Right. Odd index = Photo on Left, Text on Right.
    const isTextLeft = index % 2 === 0;

    // Palette assignment matching website color theme & reference screenshot
    let bannerBg = "bg-[#0F172A] group-hover:bg-[#1E293B]"; // Deep Navy -> Slate
    let foldBg = "#020617";
    let roleColor = "text-sky-300";

    if (
      member.role?.includes("President") ||
      member.role?.includes("Founder") ||
      member.role?.includes("Executive Director")
    ) {
      bannerBg = "bg-[#C2410C] group-hover:bg-[#9A3412]"; // Ochre -> Rich Terracotta
      foldBg = "#7C2D12";
      roleColor = "text-amber-200";
    } else if (isBoard) {
      bannerBg = "bg-[#0A192F] group-hover:bg-[#0F2847]"; // Royal Navy -> Vibrant Deep Navy
      foldBg = "#020617";
      roleColor = "text-sky-200";
    } else if (isTech) {
      bannerBg = "bg-[#1E293B] group-hover:bg-[#0F172A]"; // Slate Blue -> Dark Slate
      foldBg = "#0F172A";
      roleColor = "text-amber-300";
    } else {
      bannerBg = "bg-[#475569] group-hover:bg-[#334155]"; // Slate Grey -> Darker Slate
      foldBg = "#1E293B";
      roleColor = "text-orange-200";
    }

    const { english: mainEnglishName, amharic: amharicSubName } = parseMemberName(member.name);

    const avatarUrl = safeImageUrl(
      member.avatar,
      600,
      teamFallbackAvatars[mainEnglishName] || teamFallbackAvatars["Samuel Geremew"]
    );

    return (
      <motion.div
        key={member._id || index}
        layout
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: "easeOut" }}
        onClick={() => setSelectedMember(member)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white border border-zinc-200/90 flex flex-col sm:flex-row hover:-translate-y-1.5 min-h-[300px]"
      >
        {/* TEXT BANNER SECTION */}
        <div
          className={`w-full sm:w-1/2 p-6 sm:p-7 text-white flex flex-col justify-between relative z-20 ${bannerBg} transition-colors duration-500 ${
            isTextLeft ? "order-1" : "order-2"
          }`}
        >
          {/* 3D Folded Ribbon Pointer leading to Photo */}
          <div
            className={`hidden sm:block absolute top-1/2 -translate-y-1/2 w-5 h-10 z-30 pointer-events-none transition-transform duration-300 group-hover:scale-110 ${
              isTextLeft
                ? "right-0 translate-x-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]"
                : "left-0 -translate-x-1/2 [clip-path:polygon(100%_0,0_50%,100%_100%)]"
            }`}
            style={{ backgroundColor: foldBg }}
          />

          <div>
            {/* NAME (English Version with Amharic Version in Modern Style) */}
            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                {mainEnglishName}
              </h3>
              {amharicSubName && (
                <div className="mt-1 font-sans text-xs sm:text-sm font-semibold text-white/85 tracking-wide">
                  ({amharicSubName})
                </div>
              )}
            </div>

            {/* Designation / Role (Italic style) */}
            <p className={`mt-2 font-serif italic text-xs sm:text-sm font-semibold tracking-wide ${roleColor}`}>
              {member.role}
            </p>

            {/* Description / Responsibilities */}
            <p className="mt-4 text-xs text-white/85 font-sans leading-relaxed font-normal line-clamp-3">
              {member.responsibilities || member.bio}
            </p>
          </div>

          {/* Footer & Action */}
          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {(member.organizationAffiliations || []).slice(0, 2).map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[9px] font-mono bg-black/25 text-white/90 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Profile &rarr;
            </span>
          </div>
        </div>

        {/* PHOTO SECTION (Normal Full-Color Image at all times) */}
        <div
          className={`w-full sm:w-1/2 relative min-h-[260px] sm:min-h-[300px] overflow-hidden bg-zinc-900 ${
            isTextLeft ? "order-2" : "order-1"
          }`}
        >
          <Image
            src={avatarUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-40 group-hover:opacity-10 transition-opacity" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* 1. HERO SECTION WITH TYPEWRITER */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-[#F4F3EE] relative overflow-hidden">
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

        <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 relative z-10 text-center flex flex-col items-center justify-center">
          {/* Typewriter Title */}
          <div className="w-full flex items-center justify-center text-center min-h-[2.4em] select-none py-2 max-w-7xl mx-auto">
            <TypewriterTitle
              phrases={phrases}
              className="font-display font-black text-[clamp(2.4rem,7vw,4.8rem)] sm:text-[clamp(3.8rem,7vw,6.5rem)] leading-[0.96] uppercase text-ochre text-center max-w-full drop-shadow-xs flex flex-col items-center justify-center"
            />
          </div>

          <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-sans font-medium leading-relaxed">
            {customSubtitle ||
              "Shega Generations (ሽጋ ትውልድ) is a pioneering non-profit educational movement dedicated to providing free, high-tier software engineering, AI technology, indigenous Ethiopian history, and hospitality character training to talented youth across Ethiopia."}
          </p>

          {/* Stat Counter Bar */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto w-full">
            {stats.map((st: any, i: number) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 text-center bg-white/90 border border-zinc-200/80 shadow-xs hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display ${st.color} mb-1`}>
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm font-sans text-zinc-600 font-medium">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE STORY JOURNEY EXPLORER */}
      <ShegaJourneyExplorer milestones={milestones} />

      {/* 3. CORE PILLARS & PHILOSOPHY */}
      <section className="py-16 md:py-24 bg-[#F4F3EE] relative">
        <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink font-display tracking-tight mb-3">
              {siteSettings?.aboutPillarsTitle || "Our 4 Pillars of Holistic Education"}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-sans leading-relaxed font-medium">
              {siteSettings?.aboutPillarsSubtitle || "Combining elite computational software engineering with indigenous Ethiopian heritage, dining etiquette, and youth peer mentorship."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
            {resolvedPillars.map((pil: any, idx: number) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 sm:p-7 bg-white border border-zinc-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-ivory border border-zinc-200">
                      {pil.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400">Pillar 0{idx + 1}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-ink font-display mb-1">
                    {pil.title}
                  </h3>
                  <div className="text-xs font-sans text-ochre font-bold mb-3">{pil.titleAmharic}</div>

                  <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed mb-6 font-medium">
                    {pil.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-100">
                  {pil.tags.map((t: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-700 text-[11px] font-mono font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ORGANIZATIONAL STRUCTURE & GOVERNANCE BREAKDOWN */}
      <section className="py-16 md:py-24 bg-white relative border-t border-zinc-200/80">
        <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink font-display tracking-tight mb-4">
              {siteSettings?.orgStructureTitle || "Role & Responsibilities Breakdown"}
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 font-sans leading-relaxed max-w-2xl mx-auto font-medium">
              {siteSettings?.orgStructureSubtitle || "Organizational breakdown & governance framework for Shega Generation."}
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="w-full max-w-5xl mx-auto mb-14 px-4">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
              {[
                { id: "executive", label: "Executive Leadership", count: execMembers.length },
                { id: "board", label: "Board of Directors", count: boardMembers.length },
                { id: "teachers", label: "Teachers & Instructors", count: teacherMembers.length },
                { id: "all", label: "All Members & Governance", count: allMembersSorted.length },
              ].map((tab) => {
                const isActive = selectedDept === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedDept(tab.id)}
                    className={`relative whitespace-nowrap px-5 sm:px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 flex items-center justify-center gap-2.5 border select-none leading-none outline-none ${
                      isActive
                        ? "text-white border-navy bg-navy shadow-lg"
                        : "text-zinc-700 bg-ivory/90 hover:bg-white hover:text-ochre border-zinc-200/90 shadow-xs"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPillAbout"
                        className="absolute inset-0 rounded-2xl bg-navy shadow-md z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            isActive ? "bg-white/20 text-white font-semibold" : "bg-zinc-200/80 text-zinc-600 font-semibold"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified 2-Column Split Card Grid Sorted strictly by Display Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-7xl mx-auto w-full">
            {filteredTeam.map((m, i) => renderMemberCard(m, i))}
          </div>
        </div>
      </section>

      {/* 5. FUTURE INNOVATION CAMPUS VISION CALLOUT */}
      <section className="py-16 md:py-24 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 relative z-10 text-center max-w-5xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight mb-6 leading-tight">
            Building the Permanent <span className="text-ochre">Shega Innovation Campus</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/80 font-sans leading-relaxed mb-10 font-medium">
            {customCampusVision ||
              "Our ultimate goal is building our own dedicated 24/7 innovation campus in Addis Ababa—equipped with overnight coding laboratories, hardware workshops, incubation spaces, rest facilities, and multi-tier cohort capacity reachable from every corner of Ethiopia."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/donate"
              className="bg-ochre hover:bg-ochre-dark text-white rounded-full px-8 py-3.5 text-sm font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105"
            >
              Support the Campus Build →
            </a>
            <a
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-3.5 text-sm font-mono font-bold uppercase tracking-wider border border-white/20 transition-all duration-300"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </section>

      {/* 6. MEMBER PROFILE MODAL DIALOG */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-ink p-2 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-5 mb-6 pt-2">
              {(() => {
                const { english: engName, amharic: amhName } = parseMemberName(selectedMember.name);
                const modalAvatarUrl = safeImageUrl(
                  selectedMember.avatar,
                  300,
                  teamFallbackAvatars[engName] || teamFallbackAvatars["Samuel Geremew"]
                );

                return (
                  <>
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border border-zinc-200 flex-shrink-0 bg-ivory">
                      <Image
                        src={modalAvatarUrl}
                        alt={engName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-ink font-display">{engName}</h3>
                      {amhName && (
                        <div className="text-sm font-sans font-semibold text-zinc-600 mb-1">
                          ({amhName})
                        </div>
                      )}
                      <div className="text-sm font-mono font-bold text-ochre mt-1 mb-1">{selectedMember.role}</div>
                      <div className="text-xs font-sans text-navy font-semibold uppercase tracking-wider">
                        {selectedMember.department === "board"
                          ? "Board of Directors & Governance"
                          : selectedMember.department === "executive"
                          ? "Executive & Operational Leadership"
                          : `${selectedMember.department} Division`}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Teaching Specialization & Tenure Callout */}
            {(selectedMember.teachingSubject || selectedMember.isTeacher) && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-xs">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ochre mb-1.5 flex items-center gap-1.5">
                  <span>🎓</span>
                  <span>Teaching Specialization &amp; Course Tenure</span>
                </h4>
                <div className="text-sm font-sans font-bold text-ink">
                  {selectedMember.teachingSubject || "Technical & Coding Instruction"}
                </div>
                {selectedMember.teachingPeriod && (
                  <div className="text-xs font-mono font-semibold text-zinc-600 mt-1">
                    Tenure / Period: {selectedMember.teachingPeriod}
                  </div>
                )}
              </div>
            )}

            {/* Core Responsibilities Breakdown Callout */}
            <div className="mb-6 p-4 rounded-2xl bg-[#F8F7F2] border border-amber-200/90 shadow-xs">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ochre mb-2 flex items-center gap-1.5">
                <span>📋</span>
                <span>Role &amp; Responsibilities Breakdown</span>
              </h4>
              <p className="text-sm text-zinc-800 font-sans leading-relaxed font-medium">
                {selectedMember.responsibilities || selectedMember.bio}
              </p>
            </div>

            {/* Bio */}
            {selectedMember.bio && (
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">Biography &amp; Background</h4>
                <p className="text-sm text-zinc-700 font-sans leading-relaxed font-medium">{selectedMember.bio}</p>
              </div>
            )}

            {/* Quote */}
            {selectedMember.quote && (
              <div className="p-4 rounded-2xl bg-ivory border-l-4 border-navy mb-6 text-sm italic text-zinc-800 font-sans">
                &ldquo;{selectedMember.quote}&rdquo;
              </div>
            )}

            {/* Affiliations */}
            {selectedMember.organizationAffiliations && (
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">Affiliations &amp; Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.organizationAffiliations.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-mono font-medium">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {selectedMember.socialLinks && (
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                {selectedMember.socialLinks.email && (
                  <a
                    href={`mailto:${selectedMember.socialLinks.email}`}
                    className="text-xs font-mono font-bold text-navy hover:text-ochre transition-colors"
                  >
                    ✉ {selectedMember.socialLinks.email}
                  </a>
                )}
                {selectedMember.socialLinks.tiktok && (
                  <a
                    href={selectedMember.socialLinks.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold text-ochre hover:underline"
                  >
                    TikTok Profile
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
