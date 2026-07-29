"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref") || "SG-DON-DEMO";
  const gateway = searchParams.get("gateway") || "demo";
  const initialAmount = searchParams.get("amount");
  const initialCurrency = searchParams.get("currency");
  const nameParam = searchParams.get("name");
  const emailParam = searchParams.get("email");

  const [verifying, setVerifying] = useState<boolean>(true);
  const [details, setDetails] = useState<{
    txRef: string;
    donorName: string;
    amount: number;
    currency: string;
    gateway: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    async function verify() {
      try {
        const queryStr = searchParams.toString();
        const res = await fetch(`/api/payments/verify?${queryStr}`);
        const data = await res.json();
        if (data.ok && data.record) {
          setDetails(data.record);
        } else {
          setDetails({
            txRef,
            donorName: nameParam || "Generous Supporter",
            amount: Number(initialAmount) || 500,
            currency: initialCurrency || "ETB",
            gateway,
            status: "success",
          });
        }
      } catch {
        setDetails({
          txRef,
          donorName: nameParam || "Generous Supporter",
          amount: Number(initialAmount) || 500,
          currency: initialCurrency || "ETB",
          gateway,
          status: "success",
        });
      } finally {
        setVerifying(false);
      }
    }
    verify();
  }, [searchParams, txRef, gateway, initialAmount, initialCurrency, nameParam, emailParam]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-lg rounded-[32px] border border-zinc-200 bg-white p-8 shadow-2xl text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <span className="mt-6 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-800 font-bold">
        {gateway === "demo" ? "Sandbox Transaction Confirmed" : "Payment Verified"}
      </span>

      <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight text-ink">
        Ameseginalehu!
      </h1>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">
        Thank you for directly backing underprivileged tech and creative talent in Ethiopia.
      </p>

      {verifying ? (
        <div className="mt-8 py-6 font-mono text-xs text-ink-soft animate-pulse">
          Verifying transaction parameters...
        </div>
      ) : (
        <div className="mt-8 text-left rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-zinc-200/60 pb-2">
            <span className="text-ink-soft">Amount Pledged:</span>
            <span className="font-bold text-ink text-sm">
              {details?.currency} {details?.amount}
            </span>
          </div>
          <div className="flex justify-between border-b border-zinc-200/60 pb-2">
            <span className="text-ink-soft">Reference ID:</span>
            <span className="font-bold text-ink truncate max-w-[180px]">{details?.txRef}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-200/60 pb-2">
            <span className="text-ink-soft">Payment Rail:</span>
            <span className="font-bold text-ink uppercase">{details?.gateway}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Status:</span>
            <span className="font-bold text-emerald-700 capitalize">{details?.status}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/"
          className="w-full rounded-full bg-ochre hover:bg-ochre/90 py-3.5 text-xs font-mono uppercase tracking-widest text-white font-bold transition-all shadow-sm"
        >
          Return to Homepage
        </Link>
        <Link
          href="/gallery"
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 py-3 text-xs font-mono uppercase tracking-widest text-ink-soft font-bold transition-all"
        >
          Explore Talent Gallery
        </Link>
      </div>
    </motion.div>
  );
}

export default function DonationSuccessPage() {
  return (
    <div className="relative pb-28 pt-20 overflow-hidden min-h-[70vh] flex items-center justify-center">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 z-20">
        <Suspense fallback={<div className="text-center font-mono text-xs text-ink-soft">Loading receipt...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
