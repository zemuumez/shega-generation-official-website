import type { Metadata } from "next";

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
            &bull; Reach Out
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
                <span>&bull;</span>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:underline">X (Twitter)</a>
                <span>&bull;</span>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="md:col-span-3 space-y-4">
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dawit Kassaye"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-ochre focus:outline-none focus:ring-1 focus:ring-ochre transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-ochre focus:outline-none focus:ring-1 focus:ring-ochre transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
                  Subject / Cohort Interest
                </label>
                <select
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink bg-white focus:border-ochre focus:outline-none focus:ring-1 focus:ring-ochre transition-all"
                >
                  <option value="general">General Inquiry</option>
                  <option value="tech">Tech Orientation Labs</option>
                  <option value="indigenous">Indigenous Knowledge & Tibeb</option>
                  <option value="mentorship">Mentorship & Mentee Application</option>
                  <option value="partnership">Partnership & Regional Hubs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist or collaborate with you?"
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-ochre focus:outline-none focus:ring-1 focus:ring-ochre transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-950 hover:bg-black text-white font-mono text-xs uppercase tracking-widest py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
