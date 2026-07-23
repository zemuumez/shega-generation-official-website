import DonationPortal from "@/components/DonationPortal";

export const metadata = { title: "Donate | Shega Generations" };

export default function DonatePage() {
  return (
    <div className="relative pb-28 pt-20 overflow-hidden">
      <div className="relative mx-auto w-full max-w-[90vw] px-4 sm:px-6 z-20">
        <span className="inline-block px-3.5 py-1 rounded-full font-mono text-xs uppercase tracking-[0.2em] bg-ink/5 text-ink border border-zinc-200 font-bold">
          Financing Interface
        </span>
        <h1 className="mt-6 font-display text-display-lg font-bold text-ink leading-tight uppercase">Support local talent directly</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          100% of all contributions go directly toward food, lodging, and transport for underprivileged geniuses.
        </p>

        <div className="mt-14">
          <DonationPortal />
        </div>
      </div>
    </div>
  );
}
