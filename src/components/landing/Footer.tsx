import Link from "next/link";
import { Logo } from "./Logo";

type FooterLink = { label: string; href: string };

const productLinks: FooterLink[] = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const companyLinks: FooterLink[] = [
  { label: "Contact", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

const moreLinks: FooterLink[] = [
  { label: "Changelog", href: "/changelog" },
  { label: "Twitter", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] bg-ink pt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Logo light />
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-medium text-white/50">
                Desktop app
              </span>
            </div>

            <h3 className="mt-6 text-2xl leading-tight font-semibold text-white sm:text-3xl">
              Your Stories
              <br />
              <span className="font-serif text-brand italic">
                Can Move Like This
              </span>
            </h3>

            <p className="mt-4 max-w-xs text-sm text-white/50">
              A useful map animation tool for everything you create.
            </p>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="More" links={moreLinks} />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
          <p>© 2026 Chizu. Maps for better stories.</p>
          <p>Not affiliated with any mapping provider.</p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none pb-2 text-center text-[18vw] leading-none font-bold whitespace-nowrap text-white/[0.04] select-none sm:text-[9rem]"
      >
        Chizu
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.15em] text-white/40">
        {title.toUpperCase()}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
