import { Eyebrow } from "./Scenery";

const accents = ["bg-ocean", "bg-land", "bg-coral", "bg-sky"];

const features = [
  {
    title: "Create your project",
    description:
      "Start a new Chizu project in seconds and pick up right where inspiration strikes.",
    video: "/create-project.mp4",
  },
  {
    title: "Choose your aspect ratio",
    description:
      "Vertical for Shorts and Reels, widescreen for YouTube — pick the format that fits where your video is going.",
    video: "/select-aspect-ratio.mp4",
  },
  {
    title: "Import your audio",
    description:
      "Drop in narration or music and build your animation around it.",
    video: "/import-audio.mp4",
  },
  {
    title: "Add scenes",
    description: "Build your story scene by scene on the map.",
    video: "/add-scenes.mp4",
  },
];

export function CloserLook() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Eyebrow>A CLOSER LOOK</Eyebrow>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Built for creators who care.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg font-medium text-foreground/65">
          Every part of Chizu is built to turn an idea into a finished
          video, fast.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-6 sm:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="flex flex-col rounded-[2rem] bg-white p-6 shadow-lg shadow-foreground/5 ring-1 ring-foreground/5"
          >
            <h3 className="flex items-center gap-2.5 text-xl font-extrabold text-foreground">
              <span
                aria-hidden
                className={`h-3 w-3 rounded-full ${accents[index % accents.length]}`}
              />
              {feature.title}
            </h3>
            <p className="mt-2 text-base font-medium text-foreground/60">
              {feature.description}
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl bg-ink ring-1 ring-foreground/10">
              <div className="aspect-[16/10] w-full">
                <video
                  src={feature.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
