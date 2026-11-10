"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import type { FoundingSlotsResponse } from "@/app/api/founding-slots/route";

// Fetched in the browser from /api/founding-slots so the grid is always live,
// even though the landing page itself is served from the static cache.
export function AvatarGrid({ total }: { total: number }) {
  const [slots, setSlots] = useState<FoundingSlotsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/founding-slots", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: FoundingSlotsResponse | null) => {
        if (!cancelled && data) setSlots(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const limit = slots?.total ?? total;
  const filled = slots?.filled ?? 0;
  const avatars = slots?.avatars ?? [];

  return (
    <div className="flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-xl shadow-foreground/5 ring-1 ring-foreground/5">
      <p className="text-lg font-extrabold text-foreground">Launch spots</p>
      <p className="mt-1 text-sm font-semibold text-foreground/55">
        {slots
          ? `${slots.remaining} of ${limit} spots left at $5/month — be one of the first.`
          : `Only ${limit} spots at $5/month — be one of the first.`}
      </p>

      <div className="mt-5 grid flex-1 grid-cols-8 content-center gap-3">
        {Array.from({ length: limit }, (_, index) => {
          if (index < filled) {
            const imageUrl = avatars[index];
            return imageUrl ? (
              <Image
                key={index}
                src={imageUrl}
                alt=""
                title={`Spot ${index + 1} · taken`}
                width={32}
                height={32}
                className="aspect-square w-full rounded-full object-cover"
              />
            ) : (
              <div
                key={index}
                title={`Spot ${index + 1} · taken`}
                className="flex aspect-square items-center justify-center rounded-full bg-brand text-white"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </div>
            );
          }

          return (
            <div
              key={index}
              title={`Spot ${index + 1} · open`}
              className="flex aspect-square items-center justify-center rounded-full border-2 border-dashed border-ocean/30 bg-ocean/5 text-ocean/60"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-sm font-semibold text-foreground/55">
        Your spot could be one of these.
      </p>
    </div>
  );
}
