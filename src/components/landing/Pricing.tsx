import Link from "next/link";
import { AvatarGrid } from "./AvatarGrid";
import { PricingCard } from "./PricingCard";
import { Eyebrow } from "./Scenery";

const tiers = [
  {
    price: "$14.99",
    align: "items-start text-left",
    dotPosition: "left-0",
    dotSize: "h-4 w-4",
    dotStyle: "bg-coral ring-4 ring-coral/25",
    priceStyle: "text-foreground",
    caption: "LAUNCH PRICE · 50 SPOTS ONLY",
    current: true,
  },
  {
    price: "$29",
    align: "items-end text-right",
    dotPosition: "right-0",
    dotSize: "h-2.5 w-2.5",
    dotStyle: "bg-foreground/15",
    priceStyle: "text-foreground/40",
    caption: "AFTER 50 CUSTOMERS",
  },
];

const currentIndex = tiers.findIndex((tier) => tier.current);
const progressWidth = `${(currentIndex / (tiers.length - 1)) * 100}%`;

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Eyebrow>PRICING</Eyebrow>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          One price. <span className="text-brand">Locked in for life.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg font-medium text-foreground/65">
          Lock in your monthly rate today — it never goes up. If Chizu
          doesn&apos;t fit how you work, email us within 14 days and
          we&apos;ll refund you.
        </p>

        <div className="mx-auto mt-14 max-w-xl">
          <div className="relative h-1.5 rounded-full bg-foreground/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand/50"
              style={{ width: progressWidth }}
            />
            {tiers.map((tier) => (
              <span
                key={tier.price}
                className={`absolute top-1/2 -translate-y-1/2 rounded-full ${tier.dotPosition} ${tier.dotSize} ${tier.dotStyle}`}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {tiers.map((tier) => (
              <div key={tier.price} className={`flex flex-col ${tier.align}`}>
                <span className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-black tracking-tight sm:text-4xl ${tier.priceStyle}`}>
                    {tier.price}
                  </span>
                </span>
                <span className="mt-1 text-[11px] font-extrabold tracking-[0.12em] text-foreground/45">
                  {tier.caption}
                </span>
                {tier.current && (
                  <span className="mt-3 rounded-full bg-brand px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] text-white">
                    YOU ARE HERE
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 text-left lg:grid-cols-[1fr_1.3fr] lg:items-stretch">
          <PricingCard
            cta={
              <Link
                href="/download"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-brand px-5 py-3.5 text-base font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
              >
                Get Chizu — $14.99/mo
              </Link>
            }
          />

          <AvatarGrid />
        </div>
      </div>
    </section>
  );
}
