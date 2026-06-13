import Image from "next/image";

// ─── Pillar 3: Single Source of Truth ───────────────────────────────────────
// All avatar data lives here. Change a photo in one place → both this
// component and any future consumer update automatically.
type Avatar = {
  src: string;
  alt: string;
};

const avatars: Avatar[] = [
  {
    alt: "Happy customer, woman smiling",
    // Tip: swap for a local import (e.g. import img from "@/public/avatar1.png")
    // for better LCP scores — external URLs add a network round-trip.
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3276&q=80",
  },
  {
    alt: "Happy customer, woman with curly hair",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "Happy customer, young man in white shirt",
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "Happy customer, man with beard",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "Happy customer, man in dark jacket",
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3376&q=80",
  },
];

// ─── Pillar 4: TypeScript Contract ──────────────────────────────────────────
// Named type (not an inline anonymous object) mirrors the MobileMenuProps
// pattern from the masterclass — explicit, readable, and reusable.
type TestimonialsAvatarsProps = {
  // priority = true tells Next.js to preload these images.
  // Pass true when this component is above the fold (e.g. in the Hero).
  priority?: boolean;
};

// ─── Pillar 1 & 2: Server Component, one job ─────────────────────────────────
// No "use client" — this is pure static markup, cooked in the Kitchen.
// One job: render a row of avatar images + a star rating + social proof text.
export default function TestimonialsAvatars({ priority = false }: TestimonialsAvatarsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-3">

      {/* ── Avatars ──────────────────────────────────────────────────────── */}
      {/* DaisyUI: "avatar-group" stacks children with negative margin overlap */}
      <div className="avatar-group -space-x-4 justify-start">
        {avatars.map((avatar) => (
          // DaisyUI: "avatar" wraps the image; "w-12 h-12 rounded-full"
          // applies the circular crop. The key uses the src — more stable
          // than an array index if the list is ever reordered.
          <div key={avatar.src} className="avatar w-12 h-12">
            <div className="w-12 rounded-full">
              <Image
                src={avatar.src}
                alt={avatar.alt}
                priority={priority}
                width={48}
                height={48}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Rating + social proof ────────────────────────────────────────── */}
      <div className="flex flex-col justify-center items-center md:items-start gap-1">

        {/* Display-only star row. We use a plain flex div (not DaisyUI's
            "rating" class) because DaisyUI rating is an interactive input
            element — using it for display-only content is semantically wrong
            and creates accessibility issues. */}
        <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-yellow-500"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>

        {/* DaisyUI semantic tokens: text-base-content/80 handles both light
            and dark mode automatically — no "dark:" prefix needed. */}
        <p className="text-base text-base-content/80">
          <span className="font-semibold text-base-content">32</span> makers
          ship faster
        </p>

      </div>
    </div>
  );
}
