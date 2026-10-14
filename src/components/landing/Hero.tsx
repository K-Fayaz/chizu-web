import Image from "next/image";
import Link from "next/link";
import { Laptop, Play, SquarePlus, Wand2, Share2 } from "lucide-react";
import { Cloud, Eyebrow, Hills } from "./Scenery";

const steps = [
  {
    icon: SquarePlus,
    label: "Create",
    caption: "Bring ideas to life",
    tile: "bg-ocean/15 text-brand",
  },
  {
    icon: Wand2,
    label: "Animate",
    caption: "Tell your story",
    tile: "bg-land/20 text-[#4d7c0f]",
  },
  {
    icon: Share2,
    label: "Export",
    caption: "Share with the world",
    tile: "bg-coral/15 text-[#c2410c]",
  },
];

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-[linear-gradient(to_bottom,#d9ecfb_0%,#eef5f3_45%,var(--background)_100%)] -mt-[69px] pt-[calc(4rem+69px)] pb-32 sm:pt-[calc(5rem+69px)] lg:pb-40">
      <Cloud className="pointer-events-none absolute top-28 left-[36%] hidden w-28 opacity-90 sm:block" />
      <Cloud className="pointer-events-none absolute top-40 right-[8%] hidden w-36 opacity-80 sm:block" />
      <Cloud className="pointer-events-none absolute top-[45%] left-[42%] hidden w-20 opacity-70 lg:block" />
      <Hills className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full sm:h-56" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
        <div>
          <Eyebrow>CREATE. ANIMATE. EXPORT.</Eyebrow>

          <h1 className="mt-5 text-5xl leading-[1.05] font-black tracking-tight text-foreground sm:text-6xl">
            A desktop app
            <br />
            for <span className="text-brand">map storytellers.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg font-medium text-foreground/65">
            Explore the world, bring it to life with animations, add your
            audio, and export beautiful map videos.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/download"
              className="rounded-full bg-brand px-7 py-3.5 text-base font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
            >
              Get Chizu
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-full bg-white/70 px-5 py-3.5 text-base font-bold text-foreground ring-1 ring-foreground/10 transition hover:bg-white"
            >
              <Play className="h-4 w-4 text-coral" fill="currentColor" />
              Watch video
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground/55">
            <Laptop className="h-4 w-4" />
            <span>Available for Windows &amp; Linux · macOS coming later</span>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 gap-4">
            {steps.map(({ icon: Icon, label, caption, tile }) => (
              <div key={label} className="flex flex-col gap-2.5">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tile}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-extrabold text-foreground">
                    {label}
                  </span>
                  <span className="text-xs font-semibold text-foreground/55">
                    {caption}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] bg-white p-2.5 shadow-[0_40px_90px_-30px_rgba(15,42,36,0.45)] ring-1 ring-foreground/5 lg:rotate-[1.5deg]">
            <div className="overflow-hidden rounded-[1.5rem]">
              <Image
                src="/public.png"
                alt="Chizu app screenshot"
                width={1912}
                height={1123}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
          <Image
            src="/chizu-mascot.png"
            alt=""
            width={720}
            height={599}
            className="pointer-events-none absolute -bottom-16 -left-10 hidden w-44 drop-shadow-xl sm:block lg:-left-20 lg:w-52"
          />
        </div>
      </div>
    </section>
  );
}
