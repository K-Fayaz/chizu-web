import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Changelog — Chizu",
  description: "Every update to Chizu, from day one.",
};

type Entry = {
  version: string;
  date: string;
  latest?: boolean;
  description: string;
  features: string[];
};

// Newest first, kept short: one plain sentence per feature. Set the date of
// the 0.1.0 entry on launch day (it's the first public release).
const entries: Entry[] = [
  {
    version: "0.1.0",
    date: "Launching soon",
    latest: true,
    description: "The first public release of Chizu.",
    features: [
      "Animate stories across a world map of countries and states.",
      "Highlight places with colours, flags or your own images.",
      "Smooth camera flights, pans and zooms between scenes.",
      "Add narration or music and time your scenes to it.",
      "Export MP4 videos in 9:16 or 16:9.",
      "Available for Windows and Linux, with automatic updates.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-20">
          <h1 className="text-4xl font-semibold tracking-tight text-[#16140f]">
            Changelog
          </h1>
          <p className="mt-2 text-[#16140f]/60">
            Every update to Chizu, from day one.
          </p>

          <div className="mt-10 space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.version}
                className={
                  entry.latest
                    ? "rounded-2xl border-2 border-brand bg-white p-8"
                    : "rounded-2xl border border-black/10 bg-white p-8"
                }
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xl font-bold tracking-tight text-[#16140f]">
                    {entry.version}
                  </span>
                  {entry.latest && (
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white">
                      LATEST
                    </span>
                  )}
                  <span className="text-sm text-[#16140f]/40">
                    {entry.date}
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#16140f]/70">
                  {entry.description}
                </p>

                <p className="mt-6 text-xs font-semibold tracking-[0.15em] text-[#16140f]/40">
                  FEATURES
                </p>
                <ul className="mt-3 space-y-2.5">
                  {entry.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="text-sm text-[#16140f]/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
