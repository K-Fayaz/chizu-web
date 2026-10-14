import Image from "next/image";
import Link from "next/link";
import { Laptop } from "lucide-react";
import { Cloud, Hills } from "./Scenery";

export function CTA() {
  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(to_bottom,#cfe6fa_0%,#e6f2f0_55%,var(--sand)_100%)] px-8 pt-16 pb-40 text-center ring-1 ring-foreground/5 sm:pb-44 lg:px-16 lg:pb-20 lg:text-left">
        <Cloud className="pointer-events-none absolute top-8 right-[30%] w-24 opacity-90" />
        <Cloud className="pointer-events-none absolute top-20 right-[6%] w-32 opacity-80" />
        <Hills className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full sm:h-40" />

        <Image
          src="/chizu-mascot.png"
          alt=""
          width={720}
          height={599}
          className="pointer-events-none absolute right-1/2 bottom-4 w-36 translate-x-1/2 drop-shadow-xl sm:w-40 lg:right-16 lg:bottom-8 lg:w-64 lg:translate-x-0"
        />

        <div className="relative lg:max-w-lg">
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Your next map video starts here.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg font-medium text-foreground/65 lg:mx-0">
            Download Chizu and bring your ideas to life.
          </p>

          <Link
            href="/download"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand px-7 py-3.5 text-base font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
          >
            Get Chizu
          </Link>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-foreground/60 lg:justify-start">
            <Laptop className="h-4 w-4" />
            <span>A desktop app for Windows &amp; Linux · macOS coming later</span>
          </div>
        </div>
      </div>
    </section>
  );
}
