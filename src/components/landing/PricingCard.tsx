import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Logo } from "./Logo";

const perks = [
  "Your $14.99/month rate, locked in for as long as you stay subscribed",
  "Unlimited projects",
  "All export options",
  "Audio support",
  "Free updates",
];

export function PricingCard({ cta }: { cta: ReactNode }) {
  return (
    <div className="h-full rounded-[2rem] bg-white p-7 shadow-xl shadow-foreground/5 ring-1 ring-foreground/5">
      <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
        <Logo />
        <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-bold text-foreground/60">
          Desktop app
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-5xl font-black tracking-tight text-foreground">
          $14.99
        </span>
        <span className="text-base font-semibold text-foreground/50">/ month</span>
      </div>

      <p className="mt-3 rounded-2xl bg-coral/10 px-3.5 py-2.5 text-xs font-bold text-[#c2410c]">
        Only 50 spots at this launch rate — $29/month once they&apos;re gone.
        Your rate stays locked in for as long as you keep your subscription
        active.
      </p>

      <ul className="mt-5 space-y-2.5">
        {perks.map((perk) => (
          <li
            key={perk}
            className="flex items-start gap-2.5 text-sm font-semibold text-foreground/75"
          >
            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-land/25 text-[#3f6212]">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {perk}
          </li>
        ))}
      </ul>

      {cta}

      <p className="mt-3 text-center text-xs font-semibold text-foreground/45">
        Cancel anytime · Prices in USD
      </p>
    </div>
  );
}
