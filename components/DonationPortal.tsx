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
    <div className="mx-auto max-w-xl rounded-sm border border-ink/10 bg-white p-8">
      <div className="flex rounded-sm border border-ink/15 p-1" role="tablist" aria-label="Currency region">
        {(["local", "global"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setAmount(null);
            }}
            className={`flex-1 rounded-sm py-2.5 text-sm font-mono uppercase tracking-wide transition-colors ${
              mode === m ? "bg-ink text-ivory" : "text-ink-soft"
            }`}
          >
            {m === "local" ? "Ethiopia (ETB)" : "Global (USD/EUR)"}
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
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft/70">Pledge amount</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`rounded-sm border py-2.5 text-sm font-mono transition-colors ${
                  amount === preset
                    ? "border-ochre bg-ochre/10 text-ochre-dark"
                    : "border-ink/15 hover:border-ink/40"
                }`}
              >
                {symbol} {preset}
              </button>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-ink-soft/70">Choose a channel</p>
          <div className="mt-3 space-y-2">
            {channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between rounded-sm border border-ink/10 p-4">
                <div>
                  <p className="font-display text-base">{channel.name}</p>
                  <p className="text-xs text-ink-soft">{channel.note}</p>
                </div>
                <span className="rounded-sm bg-ivory-dim px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-soft/70">
                  Pending setup
                </span>
              </div>
            ))}
          </div>

          <button
            disabled
            title="Provider integration required before this can go live"
            className="mt-8 w-full cursor-not-allowed bg-ink/30 px-6 py-3.5 text-sm font-mono uppercase tracking-wide text-ivory"
          >
            {amount ? `Pledge ${symbol} ${amount}` : "Select an amount"}
          </button>
          <p className="mt-3 text-xs text-ink-soft/70">
            Payment rails are not yet connected. This interface is complete; it activates the moment
            merchant credentials are added to the environment.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
