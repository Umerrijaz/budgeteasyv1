// ─── Pillar 4: TypeScript Contract ──────────────────────────────────────────
// Named type instead of an inline anonymous object in the function signature.
type ButtonSigninProps = {
  // extraStyle lets the caller extend the button with additional Tailwind or
  // DaisyUI classes (e.g. "btn-wide" in the Hero, nothing in the Header).
  extraStyle?: string;
};

// ─── Pillar 1: Server Component ──────────────────────────────────────────────
// No "use client" — a plain button element needs no client-side state.
// If you add onClick logic later, extract a thin Client Component wrapper.

// ─── Pillar 2: One job ───────────────────────────────────────────────────────
// ButtonSignin's only job: render a sign-in call-to-action button.
// Auth logic lives elsewhere — this component just renders the trigger.
export default function ButtonSignin({ extraStyle }: ButtonSigninProps) {
  return (
    // Pillar 5: "btn btn-primary" are DaisyUI semantic classes — they adapt
    // to the active theme automatically. No hardcoded bg-blue-600 needed.
    <button className={`btn btn-primary ${extraStyle ?? ""}`}>
      Get started
    </button>
  );
}
