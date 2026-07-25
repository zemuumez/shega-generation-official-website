import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Shega Generations",
  description:
    "Get in touch with the Shega Generations team for general inquiries, partnerships, sponsorships, donations, and media features.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#145A32] font-bold">
            Reach Out
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl font-bold uppercase tracking-wider text-ink">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-ink-soft text-sm sm:text-base leading-relaxed">
            Reach out to our leadership team for general inquiries, partnerships, sponsorships, media features, or donations.
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid md:grid-cols-5 gap-8 bg-white border border-zinc-200 rounded-[32px] p-6 sm:p-10 shadow-sm">
          {/* Contact Details Column */}
          <div className="md:col-span-2 space-y-7 border-b md:border-b-0 md:border-r border-zinc-200 pb-6 md:pb-0 md:pr-8">
            {/* Phone Number Contact */}
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink flex items-center gap-2">
                <span>📞</span>
                <span>Phone / Contact</span>
              </h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed font-mono font-medium">
                <a href="tel:+251911210000" className="hover:text-[#145A32] transition-colors block">
                  +251 911 21 00 00
                </a>
                <a href="tel:+251911234567" className="hover:text-[#145A32] transition-colors block mt-0.5">
                  +251 911 23 45 67
                </a>
              </p>
            </div>

            {/* Email Contact */}
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink flex items-center gap-2">
                <span>✉️</span>
                <span>Email</span>
              </h3>
              <p className="mt-2 text-sm text-ink-soft font-mono font-medium">
                <a href="mailto:contact@shegagenerations.org" className="hover:text-[#145A32] transition-colors">
                  contact@shegagenerations.org
                </a>
              </p>
            </div>

            {/* Headquarters Location */}
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink flex items-center gap-2">
                <span>📍</span>
                <span>Headquarters</span>
              </h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed font-sans">
                Tourism Training Institute (TTI) &amp; Guenet Hotel Mexico, Addis Ababa, Ethiopia
              </p>
            </div>

            {/* Social Channels */}
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink flex items-center gap-2">
                <span>🌐</span>
                <span>Social Hubs</span>
              </h3>
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-[#145A32]">
                <a
                  href="https://www.tiktok.com/@samuelgeremew_21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  TikTok
                </a>
                <span>•</span>
                <a
                  href="https://web.facebook.com/share/g/18foDKzcBS/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
                <span>•</span>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="md:col-span-3 space-y-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
