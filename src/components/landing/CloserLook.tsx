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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="text-xs font-semibold tracking-[0.2em] text-brand">
          A CLOSER LOOK
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#16140f] sm:text-4xl">
          Built for creators who care.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[#16140f]/60">
          Every part of Chizu is built to turn an idea into a finished
          video, fast.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col rounded-2xl border border-black/10 bg-cream/60 p-6"
          >
            <h3 className="text-lg font-semibold text-[#16140f]">
              {feature.title}
            </h3>
            <p className="mt-1.5 text-sm text-[#16140f]/60">
              {feature.description}
            </p>

            <div className="mt-5 overflow-hidden rounded-xl border border-black/10 bg-ink">
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
