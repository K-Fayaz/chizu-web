import { Play } from "lucide-react";
import { Eyebrow } from "./Scenery";

const videos = [
  {
    id: "nJwqe2TzNPU",
    title: "Which Countries Produce and Consume the Most?",
  },
  { id: "pBiyrYmwW1E", title: "The U.S. Has The Most Billionaires In The World" },
  { id: "OuVgfe4xDss", title: "The U.S. Is The Richest Country In The World" },
  { id: "FDfMInY9P5U", title: "Team India vs Team China" },
  { id: "iNb8U5G12z4", title: "Countries That Own Every Religion on Earth" },
  { id: "pRXuPu2Cnng", title: "The Most Powerful Country in Every Major Religion" },
  { id: "zDar0HQku6o", title: "Team India VS Team Bangladesh" },
  { id: "sXY-vh2MtTE", title: "World War II: The Allies vs Axis Powers" },
  {
    id: "RnG2255gZh0",
    title: "The U.S. Has The Most Active Nuclear Reactors In The World",
  },
  { id: "hLPgHQbNkaQ", title: "Where Does Your Food Actually Come From?" },
  {
    id: "AFWpUNlDl0o",
    title: "Countries with the most VS least Olympic Medals in the world",
  },
  { id: "atrRbYqXdew", title: "Italy Produces the Most Wine In The World" },
  { id: "8jkitKJsuNI", title: "The United States Produces The Most Beef In The World" },
  {
    id: "FF8BbXIXyMw",
    title: "The United States Has Produced The Most Corn In The World",
  },
  { id: "ofwN_ufIdaI", title: "Countries With the Most VS Least Natural Resources" },
];

const loop = [...videos, ...videos];

export function VideoGallery() {
  return (
    <section className="overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Eyebrow>REAL STORIES. REAL MAPS.</Eyebrow>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Videos made with Chizu
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg font-medium text-foreground/65">
          Here are some videos created using Chizu.
        </p>
      </div>

      <div
        className="pause-on-hover relative mt-12 w-full"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="animate-marquee flex w-max gap-5">
          {loop.map((video, index) => (
            <a
              key={`${video.id}-${index}`}
              href={`https://www.youtube.com/shorts/${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-40 flex-none sm:w-48"
            >
              <div className="group relative overflow-hidden rounded-[1.25rem] bg-white p-1.5 shadow-md shadow-foreground/10 ring-1 ring-foreground/5 transition group-hover:-translate-y-1">
                <div className="aspect-[9/16] w-full overflow-hidden rounded-2xl">
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/oar2.jpg`}
                    alt={video.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white shadow-lg shadow-coral/30 transition group-hover:scale-110">
                    <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                  </span>
                </span>
              </div>
              <p className="mt-3 px-1 text-left text-sm font-bold text-foreground/80">
                {video.title}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
