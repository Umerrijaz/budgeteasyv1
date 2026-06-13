"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import config from "@/config";

// We receive the links and CTA button as props from the parent
type MobileMenuProps = {
  links: { href: string; label: string }[];
  cta: ReactNode;
};

export default function MobileMenu({ links, cta }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex lg:hidden">
      {/* Burger button to open menu on mobile */}
      <button
        type="button"
        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open main menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-base-content">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div className="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-white dark:bg-zinc-900 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300">
          
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <Link className="flex items-center gap-2 shrink-0 " title={`${config.appName} homepage`} href="/">
              {/* Removed missing icon.png import to fix compilation */}
              <span className="font-extrabold text-lg text-black dark:text-white">{config.appName}</span>
            </Link>
            
            {/* Close Button */}
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>
              <span className="sr-only">Close menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flow-root mt-6">
            <div className="py-4">
              <div className="flex flex-col gap-y-4 items-start">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="text-black dark:text-white font-medium hover:text-blue-600"
                    title={link.label}
                    onClick={() => setIsOpen(false)} // Close menu immediately when clicked
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="my-4 border-t border-zinc-200 dark:border-zinc-800"></div>
            {/* CTA Button */}
            <div className="flex flex-col">{cta}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
