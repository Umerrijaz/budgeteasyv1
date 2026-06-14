# Project Context: BudgetEasy

- **Stack:** Next.js (App Router), React, Tailwind CSS, DaisyUI, Convex.
- **Styling Rules:** Use semantic DaisyUI tokens (`bg-base-100`, `text-primary`) only. Never use hardcoded Tailwind hex colors unless specifically requested.
- **Architecture:** We follow strict Separation of Concerns. UI components (in `/components`) should be "dumb" and receive data via props. 
- **Data Flow:** All static data currently originates from `config.tsx`. When building Convex queries, wrapper components or page files should fetch data and pass it down as props to UI components.
- **Server/Client:** Default to Server Components. Only use `"use client"` when state (`useState`), browser APIs, or interactivity is explicitly required.
- **Workflow:** Ensure any new UI sections define their data contract in `config.tsx` before building the presentational component.
