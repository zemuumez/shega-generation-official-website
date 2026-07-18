import DonationPortal from "@/components/DonationPortal";
import TibebPattern from "@/components/TibebPattern";

export const metadata = { title: "Donate | Shega Generations" };

export default function DonatePage() {
  return (
    <div className="relative pb-24 pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.06]">
        <TibebPattern variant="watermark" tone="brick" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ochre">Financing Interface</p>
        <h1 className="mt-3 font-display text-display-lg">Fund the next cohort</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Every pledge, local or global, goes directly to diagnostic tooling, mentor stipends, and
          travel for students outside Addis Ababa.
        </p>

        <div className="mt-14">
          <DonationPortal />
        </div>
      </div>
    </div>
  );
}
