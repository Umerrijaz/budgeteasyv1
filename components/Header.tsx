import type { ReactNode } from "react";
import Link from "next/link";
import ButtonSignin from "./ButtonSignin";
import config from "@/config";
import MobileMenu from "./MobileMenu";

const links: { href: string; label: string; }[] = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

const cta: ReactNode = <ButtonSignin />;

export default function Header() {
  return (
    <header className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <nav className="container flex items-center justify-between px-8 py-4 mx-auto" aria-label="Global">
        
        {/* Logo/name on large screens */}
        <div className="flex lg:flex-1">
          <Link className="flex items-center gap-2 shrink-0 " href="/" title={`${config.appName} homepage`}>
             {/* Removed missing icon.png import to fix compilation */}
            <span className="font-extrabold text-lg text-black dark:text-white">{config.appName}</span>
          </Link>
        </div>

        {/* Links on large screens */}
        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link href={link.href} key={link.href} className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white font-medium transition-colors" title={link.label}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA on large screens */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1">{cta}</div>

        {/* Mobile menu (Client Component) */}
        <MobileMenu links={links} cta={cta} />

      </nav>
    </header>
  );
}