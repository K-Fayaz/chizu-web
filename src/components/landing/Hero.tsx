import Image from "next/image";
import Link from "next/link";
import { Laptop, Play, SquarePlus, Wand2, Share2 } from "lucide-react";

const steps = [
  { icon: SquarePlus, label: "Create", caption: "Bring ideas to life" },
  { icon: Wand2, label: "Animate", caption: "Tell your story" },
  { icon: Share2, label: "Export", caption: "Share with the world" },
];

export function Hero() {
  return (
    <section className="relative bg-white pt-16 pb-28 sm:pt-20 lg:pb-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden bg-[radial-gradient(60%_60%_at_50%_0%,#f7ecd0_0%,rgba(247,236,208,0)_100%)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1fr_1.35fr] lg:gap-4">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] text-brand">
            CREATE. ANIMATE. EXPORT.
          </span>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#16140f] sm:text-5xl">
            A desktop app
            <br />
            for <span className="text-brand">map storytellers.</span>
          </h1>

          <p className="mt-5 max-w-md text-base text-[#16140f]/60 sm:text-lg">
            Explore the world, bring it to life with animations, add your
            audio, and export beautiful map videos.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="#get-chizu"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
            >
              Get Chizu
            </Link>
            <Link
              href="#"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#16140f] transition hover:text-brand"
            >
              <Play className="h-4 w-4" />
              Watch video
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-[#16140f]/50">
            <Laptop className="h-3.5 w-3.5" />
            <span>Available for Linux · Windows &amp; macOS coming soon</span>
          </div>

          <div className="mt-12 flex items-center gap-8">
            {steps.map(({ icon: Icon, label, caption }) => (
              <div key={label} className="flex flex-col gap-1">
                <Icon className="h-4 w-4 text-[#16140f]" strokeWidth={1.75} />
                <span className="text-sm font-semibold text-[#16140f]">
                  {label}
                </span>
                <span className="text-xs text-[#16140f]/50">{caption}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative [perspective:1800px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-16 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_60%_40%,#f7ecd0_0%,rgba(247,236,208,0)_100%)]"
          />
          <div className="overflow-hidden rounded-2xl border border-black/10 shadow-2xl shadow-black/30 lg:[transform:rotateY(-28deg)_rotateX(10deg)_rotateZ(-3deg)_scale(1.15)]">
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
      </div>
    </section>
  );
}
