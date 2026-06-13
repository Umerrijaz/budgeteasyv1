"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import config from "@/config";

// Contract: the exact shape of data this component accepts from the Parent
type MobileMenuProps = {
  links: { href: string; label: string }[];
  cta: ReactNode;
};

export default function MobileMenu({ links, cta }: MobileMenuProps) {
  // The "brain" — tracks whether the drawer is open or closed
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    // Only visible on small screens — hidden on large screens
    <div className="flex lg:hidden drawer drawer-end z-50">
      
      {/* Hidden checkbox to toggle the drawer */}
      <input 
        id="mobile-menu-drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isOpen} 
        onChange={(e) => setIsOpen(e.target.checked)} 
      />

      {/* Hamburger button — opens the drawer */}
      <div className="drawer-content">
        <label
          htmlFor="mobile-menu-drawer"
          className="btn btn-ghost btn-square"
          aria-expanded={isOpen}
          aria-label="Open main menu"
        >
          {/* DaisyUI swap icon pattern — three horizontal lines */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </label>
      </div>

      {/* DaisyUI "drawer-side" panel — slides in from the right */}
      <div className="drawer-side">
        {/* Overlay to close the drawer */}
        <label htmlFor="mobile-menu-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        {/* Panel content */}
        <div className="min-h-full w-full sm:w-80 bg-base-100 text-base-content flex flex-col">
          
          {/* Panel header: logo + close button */}
          <div className="flex items-center justify-between p-4 border-b border-base-200">
            <Link href="/" title={`${config.appName} homepage`} className="font-extrabold text-lg" onClick={() => setIsOpen(false)}>
              {config.appName}
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-square btn-sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation links — DaisyUI "menu" for a clean vertical list */}
          <ul className="menu p-4 text-base-content gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={link.label}
                  className="font-medium text-base"
                  onClick={() => setIsOpen(false)} // Close menu when a link is clicked
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider + CTA button at the bottom */}
          <div className="divider mx-4 my-0 mt-auto" />
          <div className="p-4">{cta}</div>

        </div>
      </div>
    </div>
  );
}
