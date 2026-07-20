"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOCAL_CHANNELS = [
  { name: "Telebirr", note: "Instant mobile money transfer, ETB only." },
  { name: "CBE Birr", note: "Commercial Bank of Ethiopia mobile wallet." },
  { name: "Chapa", note: "Card and bank transfer aggregator for Ethiopia." },
];

const GLOBAL_CHANNELS = [
  { name: "Card (Stripe)", note: "Visa, Mastercard, and Amex, settled in USD." },
  { name: "SEPA / Bank transfer", note: "For recurring pledges in EUR." },
];

const PRESETS_ETB = [250, 500, 1500, 5000];
const PRESETS_USD = [10, 25, 75, 200];

export default function DonationPortal() {
  const [mode, setMode] = useState<"local" | "global">("local");
  const [amount, setAmount] = useState<number | null>(null);
  const channels = mode === "local" ? LOCAL_CHANNELS : GLOBAL_CHANNELS;
  const presets = mode === "local" ? PRESETS_ETB : PRESETS_USD;
  const symbol = mode === "local" ? "ETB" : "$";

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-zinc-200 bg-white p-8 shadow-lg">
      <div className="flex rounded-full border border-zinc-200 bg-zinc-50 p-1" role="tablist" aria-label="Currency region">
        {(["local", "global"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setAmount(null);
            }}
            className={`flex-1 rounded-full py-2.5 text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
              mode === m ? "bg-ochre text-white shadow-sm font-bold" : "text-ink-soft hover:text-ink"
            }`}
          >
            {m === "local" ? "Ethiopia (ETB)" : "Global (USD)"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft/60">Pledge amount</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`rounded-full border py-3.5 text-xs font-mono transition-all duration-300 ${
                  amount === preset
                    ? "border-ochre bg-ochre/10 text-ink font-bold shadow-sm"
                    : "border-zinc-200 bg-zinc-50/50 text-ink-soft hover:border-zinc-300 hover:text-ink"
                }`}
              >
                {symbol} {preset}
              </button>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-ink-soft/60">Choose a channel</p>
          <div className="mt-3 space-y-2.5">
            {channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50/30 p-4 transition-all duration-300 hover:border-ochre/30 hover:bg-white shadow-sm">
                <div>
                  <p className="font-display text-base font-bold text-ink uppercase tracking-wide">{channel.name}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{channel.note}</p>
                </div>
                <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-[8px] font-mono uppercase tracking-widest text-ink-soft/60 font-bold">
                  Pending setup
                </span>
              </div>
            ))}
          </div>

          <button
            disabled
            title="Provider integration required before this can go live"
            className="mt-8 w-full cursor-not-allowed rounded-full bg-zinc-100 border border-zinc-200 px-6 py-4 text-xs font-mono uppercase tracking-widest text-ink-soft/40 transition-all duration-300 font-bold"
          >
            {amount ? `Pledge ${symbol} ${amount}` : "Select an amount"}
          </button>
          <p className="mt-4 text-xs text-ink-soft/50 text-center leading-relaxed">
            Payment rails are not yet connected. This interface is complete; it activates the moment
            merchant credentials are added to the environment.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
