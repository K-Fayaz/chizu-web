import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Logo } from "./Logo";

const perks = [
  "Your $14.99/month rate locked in for life",
  "Unlimited projects",
  "All export options",
  "Audio support",
  "Free updates",
];

export function PricingCard({ cta }: { cta: ReactNode }) {
  return (
    <div className="h-full rounded-2xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
      <div className="flex items-center justify-between border-b border-black/5 pb-4">
        <Logo />
        <span className="text-xs text-[#16140f]/40">Desktop app</span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight text-[#16140f]">
          $14.99
        </span>
        <span className="text-sm text-[#16140f]/50">/ month</span>
      </div>

      <p className="mt-3 text-xs font-medium text-brand">
        Only 50 spots at this launch rate — $29/month once they&apos;re gone.
        Your rate stays locked in for life either way.
      </p>

      <ul className="mt-5 space-y-2.5">
        {perks.map((perk) => (
          <li
            key={perk}
            className="flex items-start gap-2 text-sm text-[#16140f]/70"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {perk}
          </li>
        ))}
      </ul>

      {cta}

      <p className="mt-3 text-center text-xs text-[#16140f]/40">
        Cancel anytime · Prices in USD
      </p>
    </div>
  );
}
