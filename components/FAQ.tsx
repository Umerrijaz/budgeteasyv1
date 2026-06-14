"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

// --- TypeScript Contracts (Pillar 4) ---
export interface FAQItemData {
  id: string; // Strictly enforcing unique IDs over fragile index keys
  question: string;
  answer: ReactNode;
}

export interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItemData[];
}

// --- Sub-components (Pillar 2: One Job Each) ---
const FaqItem = ({ item }: { item: FAQItemData }) => {
  const accordion = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-lg font-semibold text-left border-t md:text-xl border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen ? "rotate-180 hidden" : ""
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion.current?.scrollHeight ?? "none", opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed text-lg text-base-content/80">{item.answer}</div>
      </div>
    </li>
  );
};

// --- Main Export (Pillar 3: Data flows DOWN via props) ---
export default function FAQ({ title = "Frequently Asked Questions", subtitle = "FAQ", items }: FAQProps) {
  return (
    <section className="bg-base-200 py-16 md:py-24" id="faq">
      <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block text-xl font-bold text-primary mb-4 uppercase tracking-wider">{subtitle}</p>
          <p className="md:text-5xl text-4xl font-extrabold text-base-content">
            {title}
          </p>
        </div>

        <ul className="basis-1/2 md:mt-6">
          {items.map((item) => (
            // Using our robust ID key instead of the fragile index 'i'
            <FaqItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
