"use client";

import { useState, useRef } from "react";
import type { JSX } from "react";
import Image from "next/image";

// --- TypeScript Contracts (Pillar 4) ---
// Exported so config.ts can import and enforce the shape of each feature.
export interface Feature {
  id: string;
  title: string;
  description: string;
  type?: "video" | "image";
  path?: string;
  format?: string;
  alt?: string;
  svg?: JSX.Element;
}

export interface FeaturesAccordionProps {
  title: string;
  highlightedText: string;
  features: Feature[];
}

// --- Sub-components (Pillar 2: One Job Each) ---

// An SEO-friendly accordion item including the title and a collapsible description.
const Item = ({
  feature,
  isOpen,
  setFeatureSelected,
}: {
  feature: Feature;
  isOpen: boolean;
  setFeatureSelected: () => void;
}) => {
  const accordion = useRef<HTMLDivElement>(null);
  const { title, description, svg } = feature;

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span className={`duration-100 ${isOpen ? "text-primary" : ""}`}>
          {svg}
        </span>
        <span
          className={`flex-1 text-base-content ${
            isOpen ? "text-primary font-semibold" : ""
          }`}
        >
          <h3 className="inline">{title}</h3>
        </span>
      </button>

      <div
        ref={accordion}
        className="transition-all duration-300 ease-in-out text-base-content/70 overflow-hidden"
        style={
          isOpen
            ? {
                maxHeight: accordion.current?.scrollHeight ?? "none",
                opacity: 1,
              }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{description}</div>
      </div>
    </li>
  );
};

// Displays the media (video or image) associated with the selected feature.
// Video is set to autoplay for best UX. Falls back to an empty placeholder div.
const Media = ({ feature }: { feature: Feature }) => {
  const { type, path, format, alt } = feature;
  const style = "rounded-2xl aspect-square w-full sm:w-[26rem]";
  const size = { width: 500, height: 500 };

  if (type === "video") {
    return (
      <video
        className={style}
        autoPlay
        muted
        loop
        playsInline
        controls
        width={size.width}
        height={size.height}
      >
        <source src={path} type={format} />
      </video>
    );
  } else if (type === "image") {
    return (
      <Image
        src={path!}
        alt={alt!}
        className={`${style} object-cover object-center`}
        width={size.width}
        height={size.height}
      />
    );
  } else {
    return <div className={`${style} !border-none`}></div>;
  }
};

// --- Main Export (Pillar 3: Data flows DOWN via props) ---
// This component owns no data. It receives everything from the Boss (page.tsx)
// via props, which get their data from the Single Source of Truth (config.ts).
export default function FeaturesAccordion({
  title,
  highlightedText,
  features,
}: FeaturesAccordionProps) {
  const [featureSelected, setFeatureSelected] = useState<number>(0);

  return (
    <section
      className="py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-base-100"
      id="features"
    >
      <div className="px-8">
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24">
          {title}
          <span className="bg-neutral text-neutral-content px-4 py-1 md:py-2 ml-1 md:ml-1.5 leading-relaxed box-decoration-clone">
            {highlightedText}
          </span>
        </h2>
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <ul className="w-full">
              {features.map((feature, i) => (
                <Item
                  key={feature.id}
                  feature={feature}
                  isOpen={featureSelected === i}
                  setFeatureSelected={() => setFeatureSelected(i)}
                />
              ))}
            </ul>
            <Media
              feature={features[featureSelected]}
              key={features[featureSelected].id}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
