import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Shega Generations",
  description: "Get in touch with the Shega Generations team, regional cohorts, and community mentors across Ethiopia.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre-dark font-bold">
             Reach Out
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl font-bold uppercase tracking-wider text-ink">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-ink-soft text-sm sm:text-base leading-relaxed">
            Have questions about our regional cohorts, tech mentorship, or ethnomathematics workshops? Send us a message below.
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid md:grid-cols-5 gap-8 bg-white border border-zinc-200 rounded-[32px] p-6 sm:p-10 shadow-sm">
          {/* Contact Details Column */}
          <div className="md:col-span-2 space-y-6 border-b md:border-b-0 md:border-r border-zinc-200 pb-6 md:pb-0 md:pr-8">
            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-ink">Headquarters</h3>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                Addis Ababa & Regional Cohort Hubs<br />
                Bahir Dar • Hawassa • Adama • Mekelle
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-ink">Email</h3>
              <p className="mt-1 text-sm text-ink-soft">
                <a href="mailto:contact@shegagenerations.org" className="hover:text-ochre transition-colors">
                  contact@shegagenerations.org
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-ink">Social Hubs</h3>
              <div className="mt-2 flex items-center gap-4 text-xs font-mono font-bold text-ochre-dark">
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:underline">Telegram</a>
                <span></span>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:underline">X (Twitter)</a>
                <span></span>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a>
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
