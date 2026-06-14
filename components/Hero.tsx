import Image from "next/image";
import Link from "next/link";
import ButtonSignin from "./ButtonSignin";
import TestimonialsAvatars from "./TestimonialsAvatars";
import { HeroProps } from "@/config";

export default function Hero({ title, description, image }: HeroProps) {
  return (
    <section className="hero bg-base-100 py-16 md:py-24">
      <div className="hero-content flex-col lg:flex-row max-w-7xl w-full gap-16 lg:gap-20 px-8">

        {/* ── Left column: copy + CTA ──────────────────────────────────────── */}
        <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start lg:w-1/2">

          {/* SEO: one <h1> per page, keyword-rich, above the fold */}
          <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 text-base-content">
            {title}
          </h1>

          <p className="text-lg text-base-content/80 leading-relaxed">
            {description}
          </p>

          <ButtonSignin extraStyle="btn-wide" />

          <TestimonialsAvatars priority={true} />

        </div>

        {/* ── Right column: product screenshot ─────────────────────────────── */}
        <div className="lg:w-1/2 w-full">
          <Image
            src={image.src}
            alt={image.alt}
            className="w-full rounded-2xl shadow-2xl"
            priority={true}
            width={500}
            height={500}
          />
        </div>

      </div>
    </section>
  );
}
