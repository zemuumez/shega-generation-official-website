import DonationPortal from "@/components/DonationPortal";
import TibebPattern from "@/components/TibebPattern";

export const metadata = { title: "Donate | Shega Generations" };

export default function DonatePage() {
  return (
    <div className="relative pb-28 pt-20 overflow-hidden">
      <div className="glow-bubble top-[10%] left-[20%] w-[35vw] h-[35vw] bg-brick/5" />
      <div className="glow-bubble bottom-[20%] right-[10%] w-[35vw] h-[35vw] bg-ochre/5" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-[0.03]">
        <TibebPattern variant="watermark" tone="brick" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 sm:px-10 z-20">
        <span className="inline-block px-3 py-1 rounded-full font-mono text-xs uppercase tracking-[0.2em] bg-ochre/10 text-ochre border border-ochre/20">
          Financing Interface
        </span>
        <h1 className="mt-6 font-display text-display-lg font-bold text-ink leading-tight">Fund the next cohort</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          Every pledge, local or global, goes directly to diagnostic tooling, mentor stipends, and
          travel for students outside Addis Ababa.
        </p>

        <div className="mt-16">
          <DonationPortal />
        </div>
      </div>
    </div>
  );
}
