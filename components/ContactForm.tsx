"use client";

import { useState } from "react";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          subject,
          message,
          website: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setFullName("");
      setEmail("");
      setSubject("General Inquiry");
      setMessage("");
    } catch (err: any) {
      console.error("Contact submit error:", err);
      setStatus("error");
      setErrorMessage(err.message || "An error occurred while sending your message. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {status === "success" ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xl">
            ✓
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-wide">Message Received!</h3>
          <p className="text-sm text-emerald-800 leading-relaxed">
            Thank you for reaching out. Your inquiry has been sent to our team and we will get back to you shortly.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - invisible to real humans */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {status === "error" && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dawit Kassaye"
              disabled={status === "submitting"}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-[#145A32] focus:outline-none focus:ring-1 focus:ring-[#145A32] transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={status === "submitting"}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-[#145A32] focus:outline-none focus:ring-1 focus:ring-[#145A32] transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
              Subject / Topic
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={status === "submitting"}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink bg-white focus:border-[#145A32] focus:outline-none focus:ring-1 focus:ring-[#145A32] transition-all disabled:opacity-50"
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Partnership & Collaboration">Partnership &amp; Collaboration</option>
              <option value="Sponsorship">Sponsorship</option>
              <option value="Donation & Support">Donation &amp; Support</option>
              <option value="Media, Press & Radio Features">Media, Press &amp; Radio Features</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/70 font-bold mb-1.5">
              Your Message
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we assist, partner, or collaborate with you?"
              disabled={status === "submitting"}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-ink placeholder:text-zinc-400 focus:border-[#145A32] focus:outline-none focus:ring-1 focus:ring-[#145A32] transition-all disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-[#145A32] hover:bg-[#0E3B21] text-white font-mono text-xs uppercase tracking-widest py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <span>Send Message</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
