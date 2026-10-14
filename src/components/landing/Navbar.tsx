"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-foreground/5 bg-background/80 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Chizu home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-foreground/70 md:flex">
          <Link href="/#features" className="transition hover:text-brand">
            Features
          </Link>
          <Link href="/#pricing" className="transition hover:text-brand">
            Pricing
          </Link>
          <Link href="/changelog" className="transition hover:text-brand">
            Changelog
          </Link>
        </nav>

        <Link
          href="/download"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-brand/25 transition hover:bg-brand-dark"
        >
          Get Chizu
        </Link>
      </div>
    </header>
  );
}
