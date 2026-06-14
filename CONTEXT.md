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
