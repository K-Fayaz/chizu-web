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
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white/60">
                Desktop app
              </span>
            </div>

            <h3 className="mt-6 text-3xl leading-tight font-black text-white">
              Your Stories
              <br />
              <span className="text-land">
                Can Move Like This
              </span>
            </h3>

            <p className="mt-4 max-w-xs text-sm font-medium text-white/60">
              A useful map animation tool for everything you create.
            </p>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="More" links={moreLinks} />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs font-semibold text-white/45 sm:flex-row">
          <p>© 2026 Chizu. Maps for better stories.</p>
          <p>Not affiliated with any mapping provider.</p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none pb-2 text-center text-[18vw] leading-none font-black whitespace-nowrap text-white/[0.05] select-none sm:text-[9rem]"
      >
        Chizu
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="text-xs font-extrabold tracking-[0.2em] text-land/80">
        {title.toUpperCase()}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm font-semibold text-white/70 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
