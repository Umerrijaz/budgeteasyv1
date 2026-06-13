import type { ReactNode } from "react";
import Link from "next/link";
import ButtonSignin from "./ButtonSignin";
import config from "@/config";
import MobileMenu from "./MobileMenu";

// Single Source of Truth: one master list for both desktop and mobile menus
const links: { href: string; label: string }[] = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

// The CTA button — typed as ReactNode so it can be a component, text, or null
const cta: ReactNode = <ButtonSignin extraStyle="px-8" />;

export default function Header() {
  return (
    // DaisyUI: "navbar" gives us a flex row with correct alignment out of the box
    <div className="navbar bg-base-100 border-b border-base-200 px-4">

      {/* Left side: Logo */}
      <div className="navbar-start">
        <Link href="/" title={`${config.appName} homepage`} className="btn btn-ghost text-xl font-extrabold">
          {config.appName}
        </Link>
      </div>

      {/* Centre: Desktop navigation links */}
      <div className="navbar-center hidden lg:flex">
        {/* DaisyUI: "menu menu-horizontal" renders links side-by-side */}
        <ul className="menu menu-horizontal px-1 gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} title={link.label} className="font-medium">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Desktop CTA + Mobile hamburger */}
      <div className="navbar-end gap-2">
        {/* CTA is hidden on mobile, visible on large screens */}
        <div className="hidden lg:flex">{cta}</div>

        {/* Mobile menu (Client Component) — only visible on small screens */}
        <MobileMenu links={links} cta={cta} />
      </div>

    </div>
  );
}