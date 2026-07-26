"use client";

import TypewriterTitle from "@/components/TypewriterTitle";
import ContactForm from "@/components/ContactForm";

export default function ContactDirectory({
  customPhrases,
  customSubtitle,
}: {
  customPhrases?: string[];
  customSubtitle?: string;
}) {
  const phrases =
    customPhrases && customPhrases.length > 0
      ? customPhrases
      : ["Get in touch, with Shega Generation.", "ከሸጋ ትውልድ ጋር ይገናኙ"];

  const subtitle =
    customSubtitle ||
    "Reach out to our leadership team for general inquiries, partnerships, sponsorships, media features, or donations.";

  return (
    <div className="w-full max-w-[90vw] mx-auto px-4 sm:px-6 pt-16 pb-28">
      {/* HEADER SECTION WITH TYPEWRITER ANIMATION & MAX 2 LINES */}
      <div className="text-center max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center text-center min-h-[2.4em] select-none py-2">
          <TypewriterTitle
            phrases={phrases}
            className="font-display font-black text-[clamp(2.4rem,7vw,4.8rem)] sm:text-[clamp(3.8rem,7vw,6.5rem)] leading-[0.96] uppercase text-[#145A32] text-center max-w-full drop-shadow-xs flex flex-col items-center justify-center"
          />
        </div>

        <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-sans font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* CENTERED DIVIDER BAR MATCHING EVENTS AND GALLERY PAGE */}
      <div className="mt-14 mb-14 border-y border-zinc-200 py-4 flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#145A32] font-bold">
          Direct Communications &amp; Inquiries
        </span>
      </div>

      {/* RESPONSIVE LAYOUT GRID MATCHING WEBSITE SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
        {/* LEFT COLUMN: CONTACT DETAILS & SOCIAL HUBS */}
        <div className="lg:col-span-5 space-y-6">
          {/* Phone & Contact Card */}
          <div className="bg-white rounded-[32px] border border-zinc-200 p-6 sm:p-8 shadow-xs hover:border-[#145A32]/40 transition-all duration-300">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-[#145A32]/10 text-[#145A32] px-3 py-1 rounded-full border border-[#145A32]/20">
              Direct Phone
            </span>
            <h3 className="font-display text-xl font-bold uppercase text-ink mt-3">
              Phone &amp; WhatsApp
            </h3>
            <div className="mt-3 text-sm font-mono font-medium text-zinc-600 space-y-1.5">
              <a
                href="tel:+251 91 156 7465"
                className="block hover:text-[#145A32] transition-colors"
              >
                +251 91 156 7465
              </a>
              <a
                href="tel:+251 913 528 574"
                className="block hover:text-[#145A32] transition-colors"
              >
                +251 913 528 574
              </a>
            </div>
          </div>

          {/* Email & Location Card */}
          <div className="bg-white rounded-[32px] border border-zinc-200 p-6 sm:p-8 shadow-xs hover:border-[#145A32]/40 transition-all duration-300">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-[#145A32]/10 text-[#145A32] px-3 py-1 rounded-full border border-[#145A32]/20">
              Official Hub
            </span>
            <h3 className="font-display text-xl font-bold uppercase text-ink mt-3">
              Email &amp; Location
            </h3>
            <p className="mt-3 text-sm font-mono font-medium text-zinc-600">
              <a
                href="mailto:contact@shegagenerations.org"
                className="hover:text-[#145A32] transition-colors"
              >
                contact@shegagenerations.org
              </a>
            </p>
            <p className="mt-3 text-sm text-zinc-500 font-sans leading-relaxed pt-3 border-t border-zinc-100">
              Tourism Training Institute (TTI) &amp; Guenet Hotel Mexico, Addis Ababa, Ethiopia
            </p>
          </div>

          {/* Official Social Channels Card */}
          <div className="bg-white rounded-[32px] border border-zinc-200 p-6 sm:p-8 shadow-xs hover:border-[#145A32]/40 transition-all duration-300">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-[#145A32]/10 text-[#145A32] px-3 py-1 rounded-full border border-[#145A32]/20">
              Social Channels
            </span>
            <h3 className="font-display text-xl font-bold uppercase text-ink mt-3">
              Community Hubs
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://www.tiktok.com/@samuelgeremew_21"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-[#145A32] hover:text-white font-mono text-xs font-bold transition-all border border-zinc-200"
              >
                TikTok
              </a>
              <a
                href="https://web.facebook.com/share/g/18foDKzcBS/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-[#145A32] hover:text-white font-mono text-xs font-bold transition-all border border-zinc-200"
              >
                Facebook Group
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-[#145A32] hover:text-white font-mono text-xs font-bold transition-all border border-zinc-200"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM CONTAINER */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-zinc-200 p-6 sm:p-10 shadow-xs">
          <div className="mb-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-[#145A32]/10 text-[#145A32] px-3 py-1 rounded-full border border-[#145A32]/20">
              Send a Message
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-ink mt-3">
              Inquiry &amp; Collaboration Form
            </h2>
            <p className="mt-2 text-sm text-zinc-500 font-sans">
              Select your inquiry subject below. For student summer camp registration, visit our program pages.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
