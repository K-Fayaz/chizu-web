import Link from "next/link";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#16140f]/70 md:flex">
          <Link href="/#features" className="transition hover:text-[#16140f]">
            Features
          </Link>
          <Link href="/#pricing" className="transition hover:text-[#16140f]">
            Pricing
          </Link>
          <Link href="/changelog" className="transition hover:text-[#16140f]">
            Changelog
          </Link>
        </nav>

        <Link
          href="#get-chizu"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
        >
          Get Chizu
        </Link>
      </div>
    </header>
  );
}
