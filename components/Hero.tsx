import Image from "next/image";
import Link from "next/link";
import config from "@/config";
import ButtonSignin from "./ButtonSignin";
import TestimonialsAvatars from "./TestimonialsAvatars";

// ─── Pillar 1: Server Component ──────────────────────────────────────────────
// No "use client" — this component has zero interactivity.
// Every element is static markup rendered entirely on the server.

// ─── Pillar 2: One job ───────────────────────────────────────────────────────
// Hero's only job: render the above-the-fold marketing section.
// It does NOT own the sign-in logic (that lives in ButtonSignin).
// It does NOT own the avatar/rating logic (that lives in TestimonialsAvatars).
export default function Hero() {
  return (
    // Pillar 5: bg-base-100 is applied to a full-width outer wrapper so the
    // background stretches edge-to-edge. The inner div handles max-width.
    <section className="w-full bg-base-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">

        {/* ── Left column: copy + CTA ──────────────────────────────────────── */}
        <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">


          {/* SEO: one <h1> per page, keyword-rich, above the fold */}
          <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 text-base-content">
            Manage your budget in days, not weeks
          </h1>

          {/* Pillar 5: text-base-content/80 handles dark mode automatically */}
          <p className="text-lg text-base-content/80 leading-relaxed">
            {config.appName} gives you everything you need to track spending,
            plan savings, and reach your financial goals — fast.
          </p>

          {/* Pillar 3: ButtonSignin is the Single Source of Truth for sign-in.
              Hero delegates to it rather than duplicating button markup.
              extraStyle widens the button to match the hero CTA size. */}
          <ButtonSignin extraStyle="btn-wide" />

          {/* Child component — receives priority=true because it is above the
              fold and its images should be preloaded for LCP performance */}
          <TestimonialsAvatars priority={true} />

        </div>

        {/* ── Right column: product screenshot ─────────────────────────────── */}
        <div className="lg:w-full">
          <Image
            src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
            alt={`${config.appName} product dashboard screenshot`}
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