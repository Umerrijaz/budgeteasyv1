// ─── Pillar 1: Server Component ──────────────────────────────────────────────
// No "use client" — every element here is static markup.
// There is zero interactivity, so we pay zero client-side JS cost.

// ─── Pillar 2: One job ───────────────────────────────────────────────────────
// Footer's only job: render the bottom-of-page navigation and legal links.
// It does NOT own auth logic, analytics, or data fetching.

// ─── Pillar 3: Data flows DOWN via props / Single Source of Truth ────────────
// All copy (app name, links) comes from config — a single file to update later.
// We do not duplicate text that already exists elsewhere in the codebase.

import Link from "next/link";
import config from "@/config";

// ─── Pillar 4: TypeScript Contract ───────────────────────────────────────────
// Define the shape of a navigation link so every entry is predictable.
interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

// ─── Pillar 3: Single Source of Truth for all footer navigation ───────────────
// Edit links here — nothing else needs to change.
const productLinks: FooterLink[] = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
];

const legalLinks: FooterLink[] = [
  { href: "/tos", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

// ─── Pillar 2: Sub-component — one job: render a titled column of links ───────
const LinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) => (
  <div className="lg:w-1/3 md:w-1/2 w-full px-4">
    <p className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
      {title}
    </p>
    <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
      {links.map((link) =>
        link.external ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            {link.label}
          </a>
        ) : (
          <Link key={link.href} href={link.href} className="link link-hover">
            {link.label}
          </Link>
        )
      )}
    </div>
  </div>
);

// ─── Pillar 1: Server Component — main export ─────────────────────────────────
export default function Footer() {
  return (
    // ─── Pillar 5: DaisyUI / Tailwind Theming ──────────────────────────────────
    // bg-base-200 and border-base-content/10 adapt automatically to the active
    // theme — no hardcoded hex colors needed.
    <footer className="bg-base-200 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-24">
        <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">

          {/* ── Brand column ─────────────────────────────────────────────── */}
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            {/* Logo / App name — links back to the top of the page */}
            <Link
              href="/"
              aria-current="page"
              className="flex gap-2 justify-center md:justify-start items-center"
            >
              <strong className="font-extrabold tracking-tight text-base md:text-lg text-base-content">
                {/* ─── Pillar 3: appName from the Single Source of Truth ─── */}
                {config.appName}
              </strong>
            </Link>

            <p className="mt-3 text-sm text-base-content/80 leading-relaxed">
              Track spending, plan savings, and reach your financial goals —
              fast.
            </p>

            <p className="mt-3 text-sm text-base-content/60">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>

          {/* ── Navigation columns ───────────────────────────────────────── */}
          <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
            {/* ─── Pillar 3: Link data flows DOWN into LinkColumn ──────── */}
            <LinkColumn title="PRODUCT" links={productLinks} />
            <LinkColumn title="LEGAL" links={legalLinks} />
          </div>

        </div>
      </div>
    </footer>
  );
}
