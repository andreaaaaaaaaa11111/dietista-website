import { BETTER_NOTICE } from "@shared/betterOffers";

export default function BetterNotice() {
  return (
    <div role="status" className="mb-6 rounded-xl border border-[#153927]/25 bg-primary/5 p-4 text-[#153927]">
      <p className="font-semibold">Better Club — {BETTER_NOTICE}</p>
    </div>
  );
}
