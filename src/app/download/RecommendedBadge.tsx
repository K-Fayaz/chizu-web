"use client";

import { useSyncExternalStore } from "react";

// "For this computer" on the download card matching the visitor's OS.
// Client-side so the page itself stays static (cached); renders nothing
// during prerendering and on other operating systems.
type Platform = "windows" | "linux";

function detectPlatform(): Platform | null {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return null;
}

const subscribe = () => () => {};

export function RecommendedBadge({ platform }: { platform: Platform }) {
  const detected = useSyncExternalStore(subscribe, detectPlatform, () => null);
  if (detected !== platform) return null;
  return (
    <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white">
      FOR THIS COMPUTER
    </span>
  );
}
