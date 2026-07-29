"use client";

import { useState } from "react";
import Image from "next/image";
import TypewriterTitle from "@/components/TypewriterTitle";
import ShegaJourneyExplorer from "@/components/ShegaJourneyExplorer";
import { safeImageUrl } from "@/sanity/lib/client";

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
      {/* 1. HERO SECTION */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-[#F4F3EE] relative overflow-hidden">
        <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs font-mono font-bold uppercase tracking-widest mb-6">
            <span>እኛ ማን ነን • About Shega Generations</span>
          </div>

          {/* Typewriter Title */}
          <div className="max-w-4xl mx-auto mb-6">
            <TypewriterTitle phrases={phrases} />
          </div>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-ink/80 font-sans leading-relaxed">
            {customSubtitle ||
              "Shega Generations (ሽጋ ትውልድ) is a pioneering non-profit educational movement dedicated to providing free, high-tier software engineering, AI technology, indigenous Ethiopian history, and hospitality character training to talented youth across Ethiopia."}
          </p>

          {/* Stat Counter Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((st, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 text-center bg-white/80 border border-zinc-200/80 shadow-sm"
              >
                <div className={`text-3xl sm:text-4xl font-extrabold font-display ${st.color} mb-1`}>
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm font-sans text-ink/70 font-medium">
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/10 border border-navy/20 text-navy text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <span>የስርዓተ-ትምህርቱ አራት አእማዶች • Our 4 Pillars</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink font-display tracking-tight">
              Holistic Education: <span className="text-ochre">Tech</span> &amp; <span className="text-navy">Character</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {pillars.map((pil, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 sm:p-8 bg-white border border-zinc-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-ivory border border-zinc-200">
                      {pil.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400">Pillar 0{idx + 1}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-ink font-display mb-1">
                    {pil.title}
                  </h3>
                  <div className="text-xs font-sans text-ochre font-bold mb-3">{pil.titleAmharic}</div>

                  <p className="text-sm text-ink/75 font-sans leading-relaxed mb-6">
                    {pil.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
                  {pil.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-mono"
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <span>መሪዎችና መምህራን • Leadership & Mentors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink font-display tracking-tight mb-4">
              The Minds Behind <span className="text-ochre">Shega</span> <span className="text-navy">Generations</span>
            </h2>
            <p className="text-base text-ink/75 font-sans">
              Meet our team of higher education lecturers, AI engineers, cultural heritage scholars, hospitality leaders, and senior student mentors.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
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
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-bold transition-all ${
                    isActive
                      ? "bg-navy text-white shadow-sm"
                      : "bg-ivory text-zinc-600 hover:text-ink hover:bg-zinc-200/70 border border-zinc-200/80"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredTeam.map((member) => (
              <div
                key={member._id}
                onClick={() => setSelectedMember(member)}
                className="glass-card rounded-3xl p-6 bg-white border border-zinc-200/90 hover:border-ochre/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Avatar & Role Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 flex-shrink-0">
                      <Image
                        src={safeImageUrl(member.avatar, 200)}
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
                  <p className="text-xs sm:text-sm text-ink/75 font-sans line-clamp-3 leading-relaxed mb-4">
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
                          className="px-2 py-0.5 rounded-md bg-ivory text-zinc-700 text-[10px] font-mono border border-zinc-200"
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

        <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-ochre text-xs font-mono font-bold uppercase tracking-widest mb-6">
            <span>የወደፊት ራእይ • Future Campus Vision</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight mb-6 leading-tight">
            Building the Permanent <span className="text-ochre">Shega Innovation Campus</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/80 font-sans leading-relaxed mb-10">
            {customCampusVision ||
              "Our ultimate goal is building our own dedicated 24/7 innovation campus in Addis Ababa—equipped with overnight coding laboratories, hardware workshops, incubation spaces, rest facilities, and multi-tier cohort capacity reachable from every corner of Ethiopia."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/donate"
              className="bg-ochre hover:bg-ochre-dark text-white rounded-full px-8 py-3.5 text-sm font-mono font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              Support the Campus Build →
            </a>
            <a
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-3.5 text-sm font-mono font-bold uppercase tracking-wider border border-white/20 transition-all"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </section>

      {/* 6. MEMBER PROFILE MODAL DIALOG */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
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
                  src={safeImageUrl(selectedMember.avatar, 300)}
                  alt={selectedMember.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-ink font-display">{selectedMember.name}</h3>
                <div className="text-sm font-mono font-bold text-ochre mb-1">{selectedMember.role}</div>
                <div className="text-xs font-sans text-zinc-500 capitalize">{selectedMember.department} Division</div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">Biography</h4>
              <p className="text-sm text-ink/80 font-sans leading-relaxed">{selectedMember.bio}</p>
            </div>

            {/* Quote */}
            {selectedMember.quote && (
              <div className="p-4 rounded-2xl bg-ivory border-l-4 border-navy mb-6 text-sm italic text-ink/90">
                &ldquo;{selectedMember.quote}&rdquo;
              </div>
            )}

            {/* Affiliations */}
            {selectedMember.organizationAffiliations && (
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">Affiliations &amp; Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.organizationAffiliations.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-mono">
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
