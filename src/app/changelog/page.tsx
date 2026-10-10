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
  features: { name: string; description: string }[];
};

const entries: Entry[] = [
  {
    version: "Beta",
    date: "October 1, 2026",
    latest: true,
    description:
      "The first public release of Chizu — search, animate and export map videos from a real desktop editor.",
    features: [
      {
        name: "World map",
        description:
          "Explore countries, states, rivers, lakes and seas, with political map coloring and instant search.",
      },
      {
        name: "Camera & animation",
        description:
          "Smooth cinematic camera moves, scripted pans and zooms, per-scene zoom control, and a “Hold” beat between scenes.",
      },
      {
        name: "Visual timeline",
        description:
          "Sequence your scenes and play them back in order, scene by scene.",
      },
      {
        name: "Highlights & styling",
        description:
          "Per-scene highlight colors that can stack, flag-image fills, and your own custom image uploads.",
      },
      {
        name: "Audio",
        description:
          "Import a reference track and scrub scenes and audio together in sync, waveform included.",
      },
      {
        name: "Export",
        description:
          "Export finished videos with a live aspect ratio picker (9:16 or 16:9) and export progress.",
      },
      {
        name: "Projects",
        description:
          "Create, save, rename and reopen projects from a home screen, with naming built into project creation.",
      },
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
                  NEW FEATURES
                </p>
                <ul className="mt-3 space-y-2.5">
                  {entry.features.map((feature) => (
                    <li key={feature.name} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="text-sm text-[#16140f]/70">
                        <strong className="font-semibold text-[#16140f]">
                          {feature.name}
                        </strong>{" "}
                        — {feature.description}
                      </span>
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
