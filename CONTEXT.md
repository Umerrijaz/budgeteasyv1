# Project Context: BudgetEasy

> **Why is this file in the root directory and not in `/docs`?**
> Modern AI coding assistants (like Cursor, GitHub Copilot, and Claude) automatically scan the project's root folder for a `CONTEXT.md` file to use as their underlying system prompt. If this file is moved to `/docs`, the AI will not detect it automatically, and it will lose its memory of your architecture across sessions. **Do not move this file!**

## 1. Where We Are (Current Status)
- **Phase 1 (Completed):** Static Landing Page built with Next.js App Router, Tailwind, and DaisyUI. Data is hardcoded in `config.tsx`.
- **Phase 2 (Upcoming/In Progress):** Integrating Convex as our backend. We will be transitioning the data flow from the static `config.tsx` file to live database queries using Convex's `useQuery()`.

## 2. What Good Looks Like (The Benchmarks)
- **Server Components:** Look at `components/Pricing.tsx`. It is a pure, "dumb" presentation component that receives typed props, uses conditional DaisyUI classes perfectly, and has zero state.
- **Client Components:** Look at `components/FeaturesAccordion.tsx`. It uses `"use client"` purposefully, isolates its state (`useState` for the selected item), and lifts state correctly.
- **Data Architecture:** Look at `app/page.tsx`. It acts as "The Boss"—importing data at the top level and passing it down. The UI components themselves do not import data directly.

## 3. How We Think (Core Principles)
- **Stack:** Next.js (App Router), React, Tailwind CSS, DaisyUI, Convex.
- **Styling Rules:** Use semantic DaisyUI tokens (`bg-base-100`, `text-primary`) only. Never use hardcoded Tailwind hex colors unless specifically requested.
- **Architecture:** We follow strict Separation of Concerns. UI components (in `/components`) should be "dumb" and receive data via props. 
- **Data Flow:** All static data currently originates from `config.tsx`. When building Convex queries, wrapper components or page files should fetch data and pass it down as props to UI components.
- **Server/Client:** Default to Server Components. Only use `"use client"` when state (`useState`), browser APIs, or interactivity is explicitly required.
- **Workflow:** Ensure any new UI sections define their data contract (e.g., `export interface`) before building the presentational component.

## 4. NEVER DO (Hard Rules)

### Architecture
- ❌ **Never add `"use client"` unless the component uses `useState`, `useEffect`, `useRef`, event handlers, or browser APIs.** If it just renders props, it is a Server Component.
- ❌ **Never fetch data inside a UI component.** Data fetching belongs in `page.tsx`, layout files, or dedicated wrapper/container components — never in the presentational component itself.
- ❌ **Never put business logic in components.** Components render. Logic lives in utility functions, server actions, or Convex functions.
- ❌ **Never create god components.** If a component exceeds ~150 lines, break it into smaller sub-components within the same file or separate files.

### Styling
- ❌ **Never use hardcoded hex/rgb colors** (e.g., `bg-[#1a1a2e]`, `text-[#e94560]`). Always use DaisyUI semantic tokens (`bg-base-100`, `text-primary`, `bg-accent`).
- ❌ **Never use inline `style={{}}` for anything Tailwind or DaisyUI can handle.** The only exception is dynamic values computed at runtime (e.g., `maxHeight` for accordion animations).
- ❌ **Never override the theme with raw Tailwind colors.** Change the theme via `data-theme` on `<html>`, not by fighting the design system.

### Data & State
- ❌ **Never duplicate data.** If a value (app name, pricing, links) appears in more than one place, it must be defined once in `config.tsx` (or later, the Convex database) and imported everywhere.
- ❌ **Never use `useEffect` to fetch data on mount.** In Next.js, use Server Components or Convex's `useQuery()` — both handle data fetching without manual `useEffect` + loading state boilerplate.
- ❌ **Never store derived data in state.** If a value can be computed from existing state or props, compute it inline. Don't `useState` it.
- ❌ **Never mutate state directly.** Always use the setter function (`setX(newValue)`), never `x = newValue`.

### TypeScript
- ❌ **Never use `any`.** If you don't know the type, use `unknown` and narrow it, or define a proper interface.
- ❌ **Never skip the props interface.** Every component must have a typed props definition, even if it only has one prop.
- ❌ **Never pass `undefined` manually.** Use `?` (optional) in the interface and simply omit the prop.

### Performance & SEO
- ❌ **Never use `<img>`.** Always use Next.js `<Image>` for automatic optimization, lazy loading, and responsive sizing.
- ❌ **Never use `<a>` for internal links.** Always use Next.js `<Link>` for client-side navigation.
- ❌ **Never put more than one `<h1>` on a page.** One `<h1>` per page (in the Hero), then `<h2>` → `<h3>` hierarchy.
- ❌ **Never skip `alt` text on images.** Every image must have a descriptive `alt` attribute for accessibility and SEO.
