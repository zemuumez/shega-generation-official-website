"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const LOCAL_CHANNELS = [
  { id: "telebirr", name: "Telebirr", note: "Instant mobile money transfer, ETB only." },
  { id: "cbebirr", name: "CBE Birr", note: "Commercial Bank of Ethiopia mobile wallet." },
  { id: "chapa", name: "Chapa", note: "Card and bank transfer aggregator for Ethiopia." },
];

const GLOBAL_CHANNELS = [
  { id: "stripe_card", name: "Card (Stripe)", note: "Visa, Mastercard, and Amex, settled in USD." },
  { id: "sepa", name: "SEPA / Bank transfer", note: "For recurring pledges in EUR/USD." },
];

const PRESETS_ETB = [250, 500, 1500, 5000];
const PRESETS_USD = [10, 25, 75, 200];

export default function DonationPortal() {
  const router = useRouter();
  const [mode, setMode] = useState<"local" | "global">("local");
  const [amount, setAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("telebirr");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal for Sandbox Simulation confirmation
  const [sandboxModal, setSandboxModal] = useState<{
    open: boolean;
    txRef: string;
    checkoutUrl: string;
    amount: number;
    currency: string;
  } | null>(null);

  const channels = mode === "local" ? LOCAL_CHANNELS : GLOBAL_CHANNELS;
  const presets = mode === "local" ? PRESETS_ETB : PRESETS_USD;
  const currency = mode === "local" ? "ETB" : "USD";
  const symbol = mode === "local" ? "ETB" : "$";

  const effectiveAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleModeSwitch = (m: "local" | "global") => {
    setMode(m);
    setAmount(m === "local" ? 500 : 25);
    setCustomAmount("");
    setSelectedChannel(m === "local" ? "telebirr" : "stripe_card");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!effectiveAmount || effectiveAmount <= 0) {
      setErrorMsg("Please select or enter a valid donation amount.");
      return;
    }
    if (!donorEmail.trim()) {
      setErrorMsg("Please enter your email address to receive your donation receipt.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim() || "Anonymous Donor",
          donorEmail: donorEmail.trim(),
          amount: effectiveAmount,
          currency,
          paymentMethod: selectedChannel,
          isAnonymous,
          message: message.trim(),
          website: websiteHoneypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Payment initialization failed. Please check details.");
        setLoading(false);
        return;
      }

      if (data.ok) {
        if (!data.isDemo && data.checkoutUrl && data.checkoutUrl.startsWith("http")) {
          // Live gateway redirect
          window.location.href = data.checkoutUrl;
        } else {
          // Demo / Sandbox modal confirmation
          setSandboxModal({
            open: true,
            txRef: data.txRef,
            checkoutUrl: data.checkoutUrl,
            amount: effectiveAmount,
            currency,
          });
          setLoading(false);
        }
      }
    } catch {
      setErrorMsg("Unable to connect to payment server. Please try again.");
      setLoading(false);
    }
  };

  const handleConfirmSandboxPayment = () => {
    if (sandboxModal) {
      router.push(
        `/donate/success?tx_ref=${encodeURIComponent(sandboxModal.txRef)}&gateway=demo&amount=${sandboxModal.amount}&currency=${sandboxModal.currency}&name=${encodeURIComponent(donorName || "Supporter")}&email=${encodeURIComponent(donorEmail)}`
      );
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl relative">
      {/* Mode Switcher */}
      <div className="flex rounded-full border border-zinc-200 bg-zinc-50 p-1" role="tablist" aria-label="Currency region">
        {(["local", "global"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => handleModeSwitch(m)}
            className={`flex-1 rounded-full py-2.5 text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
              mode === m ? "bg-ochre text-white shadow-sm font-bold" : "text-ink-soft hover:text-ink"
            }`}
          >
            {m === "local" ? "Ethiopia (ETB)" : "Global (USD)"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Amount Selector */}
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft/60">Select pledge amount</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount("");
                  }}
                  className={`rounded-2xl border py-3 text-xs font-mono transition-all duration-300 min-h-[44px] ${
                    amount === preset && !customAmount
                      ? "border-ochre bg-ochre/10 text-ink font-bold shadow-sm ring-1 ring-ochre"
                      : "border-zinc-200 bg-zinc-50/50 text-ink-soft hover:border-zinc-300 hover:text-ink"
                  }`}
                >
                  {symbol} {preset}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="mt-3">
              <div className="relative rounded-2xl border border-zinc-200 bg-zinc-50/40 focus-within:border-ochre focus-within:bg-white focus-within:ring-1 focus-within:ring-ochre transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-ink-soft">
                  {symbol}
                </span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  min="1"
                  step="any"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(null);
                  }}
                  className="w-full bg-transparent py-3 pl-12 pr-4 text-xs font-mono text-ink placeholder:text-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Channel Selection */}
            <p className="mt-7 font-mono text-xs uppercase tracking-widest text-ink-soft/60">Choose payment channel</p>
            <div className="mt-3 space-y-2.5">
              {channels.map((channel) => (
                <label
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-300 shadow-sm ${
                    selectedChannel === channel.id
                      ? "border-ochre bg-ochre/5 ring-1 ring-ochre/30"
                      : "border-zinc-200 bg-zinc-50/30 hover:border-zinc-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={selectedChannel === channel.id}
                      onChange={() => setSelectedChannel(channel.id)}
                      className="accent-ochre h-4 w-4"
                    />
                    <div>
                      <p className="font-display text-sm font-bold text-ink uppercase tracking-wide">{channel.name}</p>
                      <p className="text-xs text-ink-soft mt-0.5">{channel.note}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[8px] font-mono uppercase tracking-widest text-emerald-700 font-bold">
                    Active
                  </span>
                </label>
              ))}
            </div>

            {/* Donor Details */}
            <p className="mt-7 font-mono text-xs uppercase tracking-widest text-ink-soft/60">Donor Information</p>
            <div className="mt-3 space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Full Name (optional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/40 p-3.5 text-xs text-ink placeholder:text-zinc-400 focus:border-ochre focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address (for receipt) *"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/40 p-3.5 text-xs text-ink placeholder:text-zinc-400 focus:border-ochre focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  placeholder="Words of encouragement / Note (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/40 p-3.5 text-xs text-ink placeholder:text-zinc-400 focus:border-ochre focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Anonymous Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-ochre rounded"
                />
                <span className="text-xs text-ink-soft">Keep my name anonymous on public supporter lists</span>
              </label>

              {/* Honeypot field - invisible to human users */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={websiteHoneypot}
                  onChange={(e) => setWebsiteHoneypot(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-7 w-full rounded-full py-4 text-xs font-mono uppercase tracking-widest text-white transition-all duration-300 font-bold shadow-md flex items-center justify-center gap-2 ${
                loading ? "bg-ochre/70 cursor-wait" : "bg-ochre hover:bg-ochre/90 hover:shadow-lg active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Initializing Rail...
                </>
              ) : (
                `Pledge ${symbol} ${effectiveAmount || 0} via ${channels.find(c => c.id === selectedChannel)?.name || "Provider"}`
              )}
            </button>

            <p className="mt-4 text-xs text-ink-soft/50 text-center leading-relaxed">
              100% of contributions are allocated directly to housing, meals, and computing gear for student fellows.
            </p>
          </motion.div>
        </AnimatePresence>
      </form>

      {/* Sandbox Simulation Modal */}
      <AnimatePresence>
        {sandboxModal?.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-zinc-200 text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                  Payment Gateway Sandbox Mode
                </span>
                <button
                  onClick={() => setSandboxModal(null)}
                  className="text-zinc-400 hover:text-zinc-600 font-mono text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <h3 className="font-display text-xl font-bold uppercase text-ink">Simulate Payment rail</h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Live merchant API credentials (`CHAPA_SECRET_KEY` / `STRIPE_SECRET_KEY`) are not set in the environment.
                  You are testing in **Interactive Sandbox Mode**.
                </p>

                <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Pledge Amount:</span>
                    <span className="font-bold text-ink">{sandboxModal.currency} {sandboxModal.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Reference:</span>
                    <span className="font-bold text-ink truncate max-w-[180px]">{sandboxModal.txRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Recipient:</span>
                    <span className="font-bold text-ink">Shega Generations</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-2">
                <button
                  onClick={handleConfirmSandboxPayment}
                  className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-mono uppercase tracking-widest text-white font-bold transition-all shadow-md"
                >
                  Simulate Successful Payment ✓
                </button>
                <button
                  onClick={() => setSandboxModal(null)}
                  className="w-full rounded-full bg-zinc-100 hover:bg-zinc-200 py-3 text-xs font-mono uppercase tracking-widest text-ink-soft font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
