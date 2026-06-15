# Project Context: BudgetEasy

> **Why is this file in the root directory and not in `/docs`?**
> Modern AI coding assistants (like Cursor, GitHub Copilot, and Claude) automatically scan the project's root folder for a `CONTEXT.md` file to use as their underlying system prompt. If this file is moved to `/docs`, the AI will not detect it automatically, and it will lose its memory of your architecture across sessions. **Do not move this file!**

> **For the AI:** This file is the source of truth for *how* we build. If anything here is ambiguous, prefer the more specific rule, and never invent a pattern that isn't described here. The deep reference (with full reasoning and worked examples) lives in `docs/10X_DEVELOPER_ROADMAP.md`.

---

## 1. Where We Are (Current Status)
- **Phase 1 (Completed):** Static landing page built with Next.js App Router, Tailwind, and DaisyUI. All content is hardcoded in `config.tsx`.
- **Phase 2 (Upcoming / In Progress):** Integrating Convex as the backend. The Convex folder does **not exist yet** — do not assume it does. When it lands, we transition dynamic data from `config.tsx` to live Convex queries using the **Orchestrator Pattern** (Section 6).

---

## 2. Tech Stack & Versions (do not assume otherwise)
- **Next.js `16.2.9`** — App Router only. **`params` and `searchParams` are Promises** and MUST be `await`ed in Server Components (or unwrapped with `React.use()` in Client Components). Synchronous `params.id` access throws.
- **React `19.2.4`**.
- **Tailwind CSS `v4`** — **CSS-first config.** There is **no `tailwind.config.js`** and we do not create one. All Tailwind/DaisyUI configuration lives in `app/globals.css` via `@import "tailwindcss";` and `@plugin "daisyui";`. PostCSS uses `@tailwindcss/postcss`.
- **DaisyUI `v5`** — loaded as a Tailwind plugin in `globals.css` with `themes: all`. The active theme is `synthwave`, set via `data-theme="synthwave"` on `<html>` in `app/layout.tsx`.
- **TypeScript `v5`, `strict: true`** — no `any`.
- **Convex** — planned, not yet installed. Client URL will be `NEXT_PUBLIC_CONVEX_URL` in `.env.local` (never committed).
- **Import alias:** `@/*` maps to the **project root** (e.g. `@/config`, `@/components/Pricing`).

---

## 3. Project Structure — Where Everything Lives
```
budgeteasyv1/
├── app/                     ← routing + shell (App Router)
│   ├── layout.tsx           ← root layout: <html>/<body>, fonts, data-theme,
│   │                          and (Phase 2) the <ConvexClientProvider>
│   ├── page.tsx             ← "/" landing page (Server Component — "The Boss")
│   └── globals.css          ← Tailwind v4 + DaisyUI config (the ONLY style config)
│
├── components/              ← presentational UI (11 files). "Dumb", props-in → JSX-out.
│   │                          Server Components by default.
│   ├── (client) MobileMenu.tsx, FeaturesAccordion.tsx, FAQ.tsx   ← the only "use client" files
│   └── (server) Header, Hero, Problem, Pricing, CTA, Footer,
│                ButtonSignin, TestimonialsAvatars
│
├── config.tsx               ← SINGLE SOURCE OF TRUTH for static content.
│                              Defines/imports typed interfaces + exports the `config` object.
├── convex/                  ← (Phase 2, not created yet) backend: schema.ts + one file per table
├── docs/10X_DEVELOPER_ROADMAP.md  ← canonical deep reference (incl. routing in Section 15)
└── CONTEXT.md               ← this file
```
- New **pages/routes** follow the routing template in `docs/10X_DEVELOPER_ROADMAP.md` Section 15 (folders = URLs, `[id]` = dynamic, `(group)` = grouping, `page.tsx` makes a folder visitable).

---

## 4. What Good Looks Like (The Benchmarks)
- **Server Component:** `components/Pricing.tsx` — pure, "dumb" presentation, typed props, conditional DaisyUI classes, zero state.
- **Client Component:** `components/FeaturesAccordion.tsx` — uses `"use client"` purposefully, isolates `useState`, lifts state correctly.
- **Assembly ("The Boss"):** `app/page.tsx` — imports `config` at the top, passes data down as props. UI components never import data themselves.
- **Contracts:** `config.tsx` — every section has an `export interface` (e.g. `HeroProps`, `PricingTier`); the whole object is typed by `ConfigProps`.

---

## 5. How We Think (Core Principles)
- **Architecture:** Strict Separation of Concerns. UI components in `/components` are "dumb" and receive data via props.
- **Single Source of Truth:** Every value lives in exactly one place — `config.tsx` today, the Convex database tomorrow — and is imported everywhere else.
- **Static Data Flow (today):** Static content originates in `config.tsx`. A page (or layout) imports it and passes it down as props. This is fine in a Server Component because importing a static object is **not** data fetching.
- **Live Data Flow (Convex, Phase 2):** Use the **Orchestrator Pattern** in Section 6. `useQuery()` is a client-only hook — it is **never** called in `page.tsx` or any Server/UI component.
- **Server/Client:** Default to Server Components. Only use `"use client"` when `useState`/`useEffect`/`useRef`, event handlers, browser APIs, or Convex hooks (`useQuery`/`useMutation`) are required.
- **Convex Functions:** Every public `query`/`mutation`/`action` must (1) validate both `args` AND `returns` with `v.` validators, and (2) call `ctx.auth.getUserIdentity()` and verify the record belongs to the user (`identity.subject`) before reading or writing. Use `.withIndex()` (not `.filter()`), pass the table name to `ctx.db.get/patch/delete`, and only call `internal.*` (never `api.*`) from server code.
- **Workflow:** Define the data contract (`export interface`) before building the presentational component.

---

## 6. The Orchestrator Pattern (THE data-fetching law)

> **Critical:** `useQuery()` / `useMutation()` are React hooks from `convex/react`. Hooks **cannot run in Server Components**. Putting `useQuery()` in `page.tsx` (a Server Component) **crashes the app**. To avoid this, we always split into three layers:

1. **`page.tsx` — ALWAYS a Server Component.** It handles layout and reads route `params` (await them). It **never** fetches Convex data. It renders a `<Feature>Wrapper`.
2. **`<Feature>Wrapper.tsx` — ALWAYS `"use client"`.** This is the ONLY place Convex hooks live. It calls `useQuery()`/`useMutation()`, handles the loading state (`if (data === undefined) return <Loading/>`), computes derived values, and passes plain data + event handlers down as props.
3. **UI components — "dumb", typically Server-compatible.** They receive props and render. **No Convex imports here, ever.**

```tsx
// app/(app)/budget/[id]/page.tsx  — Server Component, no hooks
import BudgetWrapper from "@/components/BudgetWrapper";
import { Id } from "@/convex/_generated/dataModel";

export default async function BudgetPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;                 // Next.js 16: params is a Promise
  return <BudgetWrapper budgetId={id as Id<"budgets">} />;
}

// components/BudgetWrapper.tsx  — the ONLY place useQuery lives
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import BudgetView from "@/components/BudgetView";

export default function BudgetWrapper({ budgetId }: { budgetId: Id<"budgets"> }) {
  const budget = useQuery(api.budgets.getById, { budgetId });
  if (budget === undefined) return <span className="loading loading-spinner" />;
  return <BudgetView budget={budget} />;        // pass data DOWN as props
}

// components/BudgetView.tsx  — dumb, no Convex import
export default function BudgetView({ budget }: { budget: BudgetViewProps }) {
  return <h1 className="text-2xl font-bold text-base-content">{budget.name}</h1>;
}
```

- **Naming:** the client data layer is always `<Feature>Wrapper.tsx` (e.g. `BudgetWrapper`, `TransactionsWrapper`).
- **Advanced exception (rare):** to read Convex data *inside a Server Component*, use `preloadQuery`/`fetchQuery` from `convex/nextjs` — **never** the `useQuery` hook. Default to the Wrapper pattern unless explicitly told otherwise.

---

## 7. Conventions
- **Files:** Components are PascalCase `.tsx` in `/components`. One component concept per file (small private sub-components may share the file).
- **Props:** Every component has a typed props interface named `<Component>Props`. Export it when another file (like `config.tsx` or a wrapper) needs it.
- **Imports:** Use the `@/` alias from the project root, not long relative paths.
- **Styling:** DaisyUI semantic tokens only (`bg-base-100`, `text-primary`, `text-base-content/80`). Responsive via Tailwind breakpoints (`md:`, `lg:`). Theme changes go through `data-theme`, never raw colors.
- **Routing:** Follow Section 15 of the roadmap. `page.tsx` makes a folder a route; `layout.tsx` is shared shell; `loading.tsx`/`error.tsx` for those states; `[id]` for dynamic; `(group)` for organizing without changing the URL.
- **Links/Images:** Next.js `<Link>` for internal navigation, `<Image>` for images (never `<a>`/`<img>`).

---

## 8. NEVER DO (Hard Rules)

### Architecture
- ❌ **Never add `"use client"` unless the component uses `useState`, `useEffect`, `useRef`, event handlers, browser APIs, or Convex hooks.** If it just renders props, it is a Server Component.
- ❌ **Never call `useQuery()`/`useMutation()` in a Server Component or in `page.tsx`.** They go ONLY in a `"use client"` Wrapper (Section 6).
- ❌ **Never fetch data inside a dumb UI component.** Data fetching belongs in a Wrapper (Convex) or a page/layout (static import) — never in the presentational component.
- ❌ **Never put business logic in components.** Components render. Logic lives in utility functions, server actions, or Convex functions.
- ❌ **Never create god components.** If a component exceeds ~150 lines, break it into smaller sub-components.

### Styling
- ❌ **Never use hardcoded hex/rgb colors** (e.g., `bg-[#1a1a2e]`, `text-[#e94560]`). Always use DaisyUI semantic tokens (`bg-base-100`, `text-primary`, `bg-accent`).
- ❌ **Never use inline `style={{}}` for anything Tailwind or DaisyUI can handle.** The only exception is dynamic values computed at runtime (e.g., `maxHeight` for accordion animations).
- ❌ **Never create a `tailwind.config.js`.** This is Tailwind v4 — config lives in `app/globals.css`.
- ❌ **Never override the theme with raw Tailwind colors.** Change the theme via `data-theme` on `<html>`.

### Data & State
- ❌ **Never duplicate data.** If a value (app name, pricing, links) appears in more than one place, define it once in `config.tsx` (or later, the Convex database) and import it everywhere.
- ❌ **Never use `useEffect` to fetch data on mount.** For static data use a Server Component import; for live data use a Convex Wrapper with `useQuery()` (Section 6). Both avoid manual `useEffect` + loading boilerplate.
- ❌ **Never store derived data in state.** If a value can be computed from existing state or props, compute it inline. Don't `useState` it.
- ❌ **Never mutate state directly.** Always use the setter function (`setX(newValue)`), never `x = newValue`.

### Convex
- ❌ **Never write a public function without `returns:` validators.** Both `args` AND `returns` must be defined — `args` protects the way in, `returns` protects the way out.
- ❌ **Never skip the auth check.** Every public `query`/`mutation`/`action` must call `ctx.auth.getUserIdentity()` and verify ownership via `identity.subject` before touching data. Never trust a client-supplied ID alone, and never use a spoofable field (like email) for access control.
- ❌ **Never use `.filter()` on a database query when an index exists.** Use `.withIndex()`. Define an index for every field you query by.
- ❌ **Never call `Date.now()` inside a query** (it breaks caching/reactivity) — pass time as an argument or store a status field updated by a scheduled function.
- ❌ **Never call `api.*` from server code.** Schedule and `ctx.run*` only `internal.*` functions.
- ❌ **Never edit the `convex/_generated/` folder by hand.**

### TypeScript
- ❌ **Never use `any`.** If you don't know the type, use `unknown` and narrow it, or define a proper interface.
- ❌ **Never skip the props interface.** Every component must have a typed props definition, even if it only has one prop.
- ❌ **Never pass `undefined` manually.** Use `?` (optional) in the interface and simply omit the prop.
- ❌ **Never read `params`/`searchParams` synchronously.** They are Promises in Next.js 16 — `await` them (Server Component) or use `React.use()` (Client Component).

### Performance & SEO
- ❌ **Never use `<img>`.** Always use Next.js `<Image>` for automatic optimization, lazy loading, and responsive sizing.
- ❌ **Never use `<a>` for internal links.** Always use Next.js `<Link>` for client-side navigation.
- ❌ **Never put more than one `<h1>` on a page.** One `<h1>` per page (in the Hero), then `<h2>` → `<h3>` hierarchy.
- ❌ **Never skip `alt` text on images.** Every image must have a descriptive `alt` attribute for accessibility and SEO.

---

## 9. Commands & Source of Truth
- **Develop:** `npm run dev` (Next.js). **Build:** `npm run build`. **Lint:** `npm run lint`.
- **Convex (Phase 2):** `npx convex dev` for development. **Never** `npx convex deploy` except for production.
- **Deep reference:** `docs/10X_DEVELOPER_ROADMAP.md` — the full reasoning, data-flow diagrams, Convex fundamentals (Section 8), the capstone feature (Section 14), and the routing template (Section 15). When this file and the roadmap disagree, this file wins for rules; the roadmap wins for explanations.
