"use client";

import { useState } from "react";
import Image from "next/image";
import TypewriterTitle from "@/components/TypewriterTitle";
import ShegaJourneyExplorer from "@/components/ShegaJourneyExplorer";
import TibebPattern from "@/components/TibebPattern";
import { safeImageUrl } from "@/sanity/lib/client";

const teamFallbackAvatars: Record<string, string> = {
  "Samuel Geremew": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  "Dawit Kassaye": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "Bethlehem Tadesse": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
  "Yonas Bekele": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "Selamawit Abrha": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600",
  "Kaleb Tesfaye": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
};

export default function AboutDirectory({
  teamMembers = [],
  milestones = [],
  customPhrases,
  customSubtitle,
  customCampusVision,
}: {
  teamMembers?: any[];
  milestones?: any[];
  customPhrases?: string[];
  customSubtitle?: string;
  customCampusVision?: string;
}) {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const defaultPhrases = [
    "OUR MISSION & STORY",
    "የማህበረሰባችን ታሪክና ራእይ",
    "WEYN COFFEE TO FUTURE CAMPUS",
    "KINDNESS & KNOWLEDGE IN ACTION",
  ];

  const phrases = customPhrases && customPhrases.length > 0 ? customPhrases : defaultPhrases;

  // Filter Team Members
  const filteredTeam =
    selectedDept === "all"
      ? teamMembers
      : teamMembers.filter((m) => m.department === selectedDept);

  const stats = [
    { label: "Talented Geniuses Trained", value: "500+", color: "text-ochre" },
    { label: "Tuition Cost to Students", value: "100% Free", color: "text-navy" },
    { label: "Summer & Annual Cohorts", value: "12+", color: "text-ochre" },
    { label: "Institutional Partners", value: "15+", color: "text-navy" },
  ];

  const pillars = [
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
            {stats.map((st, i) => (
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink font-display tracking-tight">
              Holistic Education: <span className="text-ochre">Tech</span> &amp; <span className="text-navy">Character</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
            {pillars.map((pil, idx) => (
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
                  {pil.tags.map((t, i) => (
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

      {/* 4. ORGANIZATIONAL & TEAM DIRECTORY */}
      <section className="py-16 md:py-24 bg-white relative border-t border-zinc-200/80">
        <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink font-display tracking-tight mb-4">
              The Minds Behind <span className="text-ochre">Shega</span> <span className="text-navy">Generations</span>
            </h2>
            <p className="text-base text-zinc-600 font-sans font-medium">
              Meet our team of higher education lecturers, AI engineers, cultural heritage scholars, hospitality leaders, and senior student mentors.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-12 px-2 py-2">
            {[
              { id: "all", label: "All Members" },
              { id: "leadership", label: "Executive Leadership" },
              { id: "tech", label: "Technical & AI Mentors" },
              { id: "cultural", label: "Cultural Advisors" },
              { id: "student-mentors", label: "Student Council" },
            ].map((tab) => {
              const isActive = selectedDept === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDept(tab.id)}
                  className={`flex-shrink-0 whitespace-nowrap px-5 py-3 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 flex items-center gap-2 border select-none leading-none min-w-max ${
                    isActive
                      ? "bg-navy text-white border-navy shadow-md scale-105"
                      : "bg-ivory/90 text-zinc-700 hover:text-ink border-zinc-200/90 hover:bg-white"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? "bg-ochre" : "bg-zinc-400"}`} />
                  <span className="whitespace-nowrap leading-none">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
            {filteredTeam.map((member) => (
              <div
                key={member._id}
                onClick={() => setSelectedMember(member)}
                className="glass-card rounded-3xl p-6 bg-white border border-zinc-200/90 hover:border-ochre/40 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Avatar & Role Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xs border border-zinc-200 flex-shrink-0">
                      <Image
                        src={safeImageUrl(member.avatar, 200, teamFallbackAvatars[member.name] || teamFallbackAvatars["Samuel Geremew"])}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-ink font-display group-hover:text-ochre transition-colors">
                        {member.name}
                      </h3>
                      <div className="text-xs font-mono font-semibold text-navy">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  {/* Bio Snippet */}
                  <p className="text-xs sm:text-sm text-zinc-600 font-sans line-clamp-3 leading-relaxed mb-4 font-medium">
                    {member.bio}
                  </p>
                </div>

                <div>
                  {/* Affiliation Tags */}
                  {member.organizationAffiliations && member.organizationAffiliations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {member.organizationAffiliations.slice(0, 3).map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-ivory text-zinc-700 text-[10px] font-mono border border-zinc-200 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs font-mono font-bold text-ochre flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Profile &amp; Story</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FUTURE INNOVATION CAMPUS VISION CALLOUT */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-navy via-slate-900 to-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-ochre/20 via-transparent to-transparent pointer-events-none" />

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

            <div className="flex items-center gap-5 mb-6">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border border-zinc-200 flex-shrink-0">
                <Image
                  src={safeImageUrl(selectedMember.avatar, 300, teamFallbackAvatars[selectedMember.name] || teamFallbackAvatars["Samuel Geremew"])}
                  alt={selectedMember.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-ink font-display">{selectedMember.name}</h3>
                <div className="text-sm font-mono font-bold text-ochre mb-1">{selectedMember.role}</div>
                <div className="text-xs font-sans text-zinc-500 capitalize font-medium">{selectedMember.department} Division</div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">Biography</h4>
              <p className="text-sm text-zinc-700 font-sans leading-relaxed font-medium">{selectedMember.bio}</p>
            </div>

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
