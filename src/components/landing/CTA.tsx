import Link from "next/link";
import { Laptop } from "lucide-react";

export function CTA() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand px-8 py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your next map video starts here.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/80">
          Download Chizu and bring your ideas to life.
        </p>

        <Link
          href="/download"
          className="mt-7 inline-flex items-center justify-center rounded-full bg-[#16140f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Get Chizu
        </Link>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/70">
          <Laptop className="h-3.5 w-3.5" />
          <span>A desktop app for Windows &amp; Linux · macOS coming later</span>
        </div>
      </div>
    </section>
  );
}
