
import config from "@/config";
import ButtonSignin from "./ButtonSignin";

// ─── Pillar 4: TypeScript Contracts ─────────────────────────────────────────
// Define props so data can flow in predictably, even if they are optional
export interface CTAProps {
  title?: string;
  description?: string;
}

// ─── Pillar 1: Server Component ──────────────────────────────────────────────
// No "use client" — this component has zero interactivity.
// Every element is static markup rendered entirely on the server.

// ─── Pillar 2: One job ───────────────────────────────────────────────────────
// CTA's only job: render the final call-to-action section to drive conversions.
// It does NOT own the sign-in logic (that lives in ButtonSignin).
export default function CTA({ 
  title = "Take control of your finances today", 
  description = "Stop wondering where your money went. Join BudgetEasy and start tracking your spending, planning your savings, and reaching your financial goals.",
}: CTAProps) {
  return (
    // ─── Pillar 5: DaisyUI / Tailwind Theming ────────────────────────────────
    // Using semantic colors (bg-neutral, text-neutral-content) ensures this 
    // component automatically adapts to whatever theme is active.
    <section className="bg-neutral text-neutral-content py-16 md:py-24">
      <div className="flex flex-col items-center max-w-xl mx-auto text-center p-4 md:p-0">
        <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 md:mb-6">
          {title}
        </h2>
        <p className="text-lg opacity-80 mb-8 md:mb-10">
          {description}
        </p>

        {/* ─── Pillar 3: Data flows DOWN / Single Source of Truth ────────── */}
        {/* ButtonSignin is the Single Source of Truth for sign-in.
            CTA delegates to it rather than duplicating button markup. */}
        <ButtonSignin extraStyle="btn-primary btn-wide" />
      </div>
    </section>
  );
}
