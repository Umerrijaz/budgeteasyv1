# 🏔️ The 10x Developer Roadmap
### From Zero Mental Model → Standing on the Mountain → Building Anything with AI

> Written from the perspective of a senior architect who has shipped 10+ indie products.
> This is not a tutorial. This is the operating system for your brain.

---

## Table of Contents

1. [The Mountain View — What You're Actually Learning](#1-the-mountain-view)
2. [The Universal Mental Model — 6 Laws That Never Change](#2-the-universal-mental-model)
3. [The File Map — How This Codebase Is Wired](#3-the-file-map)
4. [The Data Flow — Following a Piece of Data from Birth to Screen](#4-the-data-flow)
5. [Day-by-Day Study Plan](#5-day-by-day-study-plan)
6. [The Server vs Client Decision — The Most Important Judgment Call](#6-server-vs-client)
7. [The TypeScript Contract System — Why AI Loves This Codebase](#7-the-typescript-contract-system)
8. [Convex Fundamentals — The Backend Brain](#8-convex-fundamentals)
9. [The Bridge to Convex — Where the Config Pattern Evolves](#9-the-bridge-to-convex)
10. [The 10x AI Workflow — How You Will Actually Build After This Week](#10-the-10x-ai-workflow)
11. [The AI Context Wall — How to Survive Week 3](#11-the-ai-context-wall)
12. [Next.js Best Practices Checklist](#12-nextjs-best-practices-checklist)
13. [Convex Best Practices Checklist](#13-convex-best-practices-checklist)

---

## 1. The Mountain View

Before you look at a single line of code, understand what you're standing on.

Every frontend application that has ever been built — from Facebook to a simple landing page — solves the same problem:

```
DATA  →  LOGIC  →  PIXELS ON SCREEN
```

That's it. All of software engineering is about managing the journey from raw data to what the user sees and interacts with. The frameworks, the languages, the libraries — they are all just different vehicles for that same journey.

This codebase teaches you to see that journey clearly. Once you see it, you cannot unsee it. And once you cannot unsee it, you can build anything.

**What you are NOT learning this week:**
- Syntax to memorize
- Framework tricks
- CSS wizardry

**What you ARE learning this week:**
- Where does data live?
- How does data move?
- Who is responsible for what?
- When should something be static vs interactive?
- How do I communicate what I want to an AI so it produces correct code?

And when you add Convex to the picture, one more question:
- **How does data come alive?** (going from hardcoded → real-time, from read-only → read-write)

---

## 2. The Universal Mental Model — 6 Laws That Never Change

These laws apply to React, Vue, Svelte, Angular, Flutter, SwiftUI, and any frontend framework that will be invented in the next 20 years. They also apply to Convex, Supabase, Firebase, or any backend you will ever use.

### Law 1: Separation of Concerns
> "Every file should have ONE reason to change."

Bad: A component that contains its own text, its own styling logic, its own API call, and its own error handling.
Good: A component that ONLY displays data it receives. The data comes from somewhere else. The styling comes from a design system. The API call lives in a separate function.

**In this codebase:** `config.tsx` owns the data. `components/` own the display. `globals.css` owns the design system. `page.tsx` owns the assembly. Four concerns, four locations.

**In Convex:** The same law scales beautifully. Your `convex/` folder owns the data layer (schema + functions). Your `components/` still own the display. Your pages still own the assembly. The only change is WHERE the data lives — the separation is identical.

```
STATIC (now):                    CONVEX (future):
├── config.tsx (data)            ├── convex/schema.ts    (data shape)
├── components/ (display)        ├── convex/functions.ts (data logic)
├── globals.css (styling)        ├── components/         (display)
└── page.tsx (assembly)          ├── globals.css         (styling)
                                 └── page.tsx            (assembly)
```

### Law 2: Data Flows Down, Events Flow Up
> "Parents tell children WHAT to display. Children tell parents WHAT HAPPENED."

This is how every component-based UI works:

```
Parent (page.tsx)
  │
  ├── passes data DOWN via props ──→ Child (Hero.tsx) displays it
  │
  └── Child fires an event UP ──→ Parent decides what to do
      (e.g., "user clicked Buy")     (e.g., navigate to checkout)
```

**In this codebase:** `page.tsx` passes `config.hero` down to `Hero.tsx`. The Hero doesn't know where the data came from. It doesn't care. It just renders.

**With Convex:** The data source changes, but the flow doesn't. A parent component calls `useQuery()` to get live data, then passes it down as props. The child still doesn't know or care whether the data came from `config.tsx` or a cloud database.

```
STATIC:  page.tsx reads config.hero          → passes to <Hero />
CONVEX:  page.tsx calls useQuery(api.hero)   → passes to <Hero />
         Hero.tsx is IDENTICAL in both cases
```

### Law 3: Single Source of Truth
> "Every piece of data should have exactly ONE owner."

If your app name appears in the header, footer, SEO title, and emails — it should be defined in ONE place and imported everywhere else.

**In this codebase:** `config.appName` is used by `Header.tsx`, `Footer.tsx`, `MobileMenu.tsx`, and `layout.tsx`. Change it once → the entire app updates.

**With Convex:** The database becomes the single source of truth for dynamic data. You don't define a budget amount in config AND the database. It lives in ONE place (the database), and every component that needs it calls `useQuery()` to read the same value.

### Law 4: Static by Default, Interactive Only When Necessary
> "Don't pay for JavaScript you don't need."

Most of your UI is static — it doesn't respond to clicks, it doesn't track state, it doesn't change after the page loads. Only make something interactive (client-side) when the user needs to interact with it.

**In this codebase:** 11 component files. Only 3 have `"use client"` (`MobileMenu.tsx`, `FeaturesAccordion.tsx`, `FAQ.tsx`). The other 8 ship zero JavaScript to the browser.

**With Convex:** Components using `useQuery()` or `useMutation()` must be `"use client"` because they need a live connection to the Convex server. But you can still keep "dumb" display components as Server Components by having a wrapper fetch the data and pass it down.

### Law 5: Contracts Before Code
> "Define the shape of your data before you write a single line of UI."

When you define a TypeScript interface, you are writing a contract: "This component REQUIRES this exact shape of data, nothing more, nothing less." This prevents bugs, enables autocomplete, and — critically — allows AI to generate correct code because it knows exactly what shape to produce.

**In this codebase:** Every component exports or imports a typed interface (`HeroProps`, `PricingTier`, `FAQItemData`, etc.). The config object is typed as `ConfigProps` which references all of them.

**With Convex:** You define contracts in TWO places:
1. **The database schema** (`convex/schema.ts`) — defines what CAN be stored
2. **The component props** (`components/*.tsx`) — defines what the UI NEEDS

These two contracts are your safety net. If the database shape doesn't match what the component expects, TypeScript catches it at build time.

### Law 6: Composition Over Complexity
> "Build small things that snap together, not big things that do everything."

Don't build a `MegaPage` component with 500 lines. Build 10 components with 50 lines each, then assemble them in your page file.

**In this codebase:** `page.tsx` is only 28 lines. It imports 8 components and assembles them. Each component is self-contained and testable in isolation.

**With Convex:** The same rule applies to your backend. Don't write one massive Convex function that does everything. Write small, focused functions: one to get budgets, one to add a transaction, one to calculate totals. Then compose them.

---

## 3. The File Map — How This Codebase Is Wired

```
budgeteasyv1/
│
├── app/                          ← LAYER 1: STRUCTURE (Next.js conventions)
│   ├── globals.css               ← Design system entry point (Tailwind + DaisyUI)
│   ├── layout.tsx                ← The outer shell wrapping ALL pages
│   ├── page.tsx                  ← THE BOSS — assembles components + feeds data
│   └── favicon.ico
│
├── components/                   ← LAYER 2: PRESENTATION (pure UI blocks)
│   ├── Header.tsx                ← Server Component (reads config directly)
│   ├── Hero.tsx                  ← Server Component (receives props from page)
│   ├── Problem.tsx               ← Server Component (receives props from page)
│   ├── FeaturesAccordion.tsx     ← CLIENT Component (needs useState for accordion)
│   ├── Pricing.tsx               ← Server Component (receives props from page)
│   ├── FAQ.tsx                   ← CLIENT Component (needs useState for open/close)
│   ├── CTA.tsx                   ← Server Component (has default props)
│   ├── Footer.tsx                ← Server Component (reads config directly)
│   ├── MobileMenu.tsx            ← CLIENT Component (needs useState for drawer)
│   ├── ButtonSignin.tsx          ← Server Component (the smallest reusable unit)
│   └── TestimonialsAvatars.tsx   ← Server Component (data lives inside the file)
│
├── config.tsx                    ← LAYER 3: DATA (Single Source of Truth)
│
├── convex/                       ← LAYER 4: BACKEND (coming soon — Convex)
│   ├── _generated/               ← Auto-generated by Convex (never edit)
│   ├── schema.ts                 ← Database shape definitions
│   ├── budgets.ts                ← Budget query/mutation functions
│   ├── transactions.ts           ← Transaction query/mutation functions
│   └── categories.ts             ← Category query/mutation functions
│
├── next.config.ts                ← INFRASTRUCTURE: Next.js settings
├── tsconfig.json                 ← INFRASTRUCTURE: TypeScript settings
├── package.json                  ← INFRASTRUCTURE: Dependencies
├── postcss.config.mjs            ← INFRASTRUCTURE: CSS pipeline
└── docs/                         ← DOCUMENTATION
```

### The 3 Types of Components in This Codebase

| Type | Files | How It Gets Data | Why |
|------|-------|-----------------|-----|
| **Props-driven** | `Hero`, `Problem`, `FeaturesAccordion`, `Pricing`, `FAQ` | `page.tsx` passes `config.xxx` as props | The Boss decides what to show |
| **Config-importing** | `Header`, `Footer`, `MobileMenu` | Imports `config` directly | These components appear on EVERY page, not just the home page, so they read config themselves |
| **Self-contained** | `ButtonSignin`, `TestimonialsAvatars`, `CTA` | Data is hardcoded inside or uses defaults | The data is too small/specific to justify putting in config |

> **Senior insight:** There is no single "right" way. The decision depends on: _"Will this data ever need to change from outside the component?"_ If yes → config or props. If no → hardcode it.

### What Changes When Convex Arrives

A fourth type of component will emerge:

| Type | Example | How It Gets Data | Why |
|------|---------|-----------------|-----|
| **Convex-connected** | `BudgetList`, `TransactionForm` | Calls `useQuery()` / `useMutation()` directly | This component needs LIVE data from the database |

**Or** you can use the wrapper pattern to keep your display components pure:

```
Wrapper (Client — calls useQuery())
  └── passes data as props to...
      └── PureDisplay (Server — receives props, renders HTML)
```

---

## 4. The Data Flow — Following a Piece of Data from Birth to Screen

Let's trace the hero title from creation to pixel. This is the most important exercise in the entire roadmap.

### Flow A: Static Data (config.tsx → screen)

```
STEP 1: BIRTH — Data is defined in config.tsx
┌──────────────────────────────────────────────────┐
│ config.tsx                                       │
│                                                  │
│ hero: {                                          │
│   title: "The easiest way to take control..."    │  ← the data is born here
│   description: "Track expenses...",              │
│   image: { src: "...", alt: "..." }              │
│ }                                                │
└──────────────────────┬───────────────────────────┘
                       │
                       │  import config from "@/config"
                       ▼
STEP 2: TRANSPORT — page.tsx reads config and passes it down
┌──────────────────────────────────────────────────┐
│ app/page.tsx                                     │
│                                                  │
│ <Hero {...config.hero} />                        │  ← spread operator unpacks
│                                                  │    the object into props:
│ // This is identical to writing:                 │    title="The easiest..."
│ // <Hero                                         │    description="Track..."
│ //   title={config.hero.title}                   │    image={config.hero.image}
│ //   description={config.hero.description}       │
│ //   image={config.hero.image}                   │
│ // />                                            │
└──────────────────────┬───────────────────────────┘
                       │
                       │  props arrive as function arguments
                       ▼
STEP 3: DISPLAY — Hero.tsx destructures props and renders HTML
┌──────────────────────────────────────────────────┐
│ components/Hero.tsx                              │
│                                                  │
│ function Hero({ title, description, image }: HeroProps) {   │  ← destructure: extract
│   return (                                       │     each field by name
│     <h1>{title}</h1>                             │  ← rendered to the DOM
│   )                                              │
│ }                                                │
└──────────────────────┬───────────────────────────┘
                       │
                       │  React converts JSX → HTML
                       ▼
STEP 4: PIXEL — The browser paints it on screen
┌──────────────────────────────────────────────────┐
│ Browser DOM                                      │
│                                                  │
│ <h1 class="font-extrabold text-4xl ...">         │
│   The easiest way to take control of your budget │
│ </h1>                                            │
└──────────────────────────────────────────────────┘
```

**This is the same flow in EVERY component-based frontend.** React, Vue, Svelte — all of them. The syntax differs. The flow is identical.

### Flow B: Live Data (Convex database → screen) — SIDE BY SIDE

Now watch the same journey with Convex. Notice how STEPS 3 and 4 are identical:

```
STEP 1: BIRTH — Data lives in Convex database
┌──────────────────────────────────────────────────┐
│ Convex Dashboard / Seed Script                   │
│                                                  │
│ budgets table:                                   │
│ {                                                │
│   _id: "k17abc...",                              │  ← Convex auto-generates IDs
│   name: "June 2026",                             │
│   totalIncome: 5000,                             │  ← the data is born here
│   categories: [...]                              │
│ }                                                │
└──────────────────────┬───────────────────────────┘
                       │
                       │  Convex server sends data over WebSocket
                       ▼
STEP 2: TRANSPORT — useQuery() fetches live data
┌──────────────────────────────────────────────────┐
│ app/dashboard/page.tsx (or a wrapper component)  │
│ "use client"                                     │
│                                                  │
│ const budgets = useQuery(api.budgets.list);       │  ← replaces config import
│                                                  │
│ // budgets is the SAME shape as config data      │
│ // but it's LIVE — if another tab adds a budget, │
│ // this variable updates automatically           │
│                                                  │
│ return <BudgetList items={budgets} />             │  ← same props-down pattern
└──────────────────────┬───────────────────────────┘
                       │
                       │  props arrive as function arguments (SAME AS BEFORE)
                       ▼
STEP 3: DISPLAY — BudgetList.tsx is IDENTICAL to any static component
┌──────────────────────────────────────────────────┐
│ components/BudgetList.tsx                        │
│                                                  │
│ function BudgetList({ items }: BudgetListProps) { │  ← SAME destructuring
│   return items.map(budget => (                   │
│     <div key={budget._id}>{budget.name}</div>    │  ← SAME rendering
│   ))                                             │
│ }                                                │
└──────────────────────┬───────────────────────────┘
                       │
                       │  React converts JSX → HTML (SAME AS BEFORE)
                       ▼
STEP 4: PIXEL — The browser paints it on screen (SAME AS BEFORE)
┌──────────────────────────────────────────────────┐
│ Browser DOM                                      │
│                                                  │
│ <div>June 2026</div>                             │
│ <div>July 2026</div>                             │
└──────────────────────────────────────────────────┘
```

### The Key Difference: Convex Adds a WRITE Path

Static config is read-only. With Convex, data flows BOTH directions:

```
STATIC CONFIG (one-way):
  config.tsx ──→ component ──→ screen
  (read only, change requires editing code)

CONVEX (two-way):
  database ←──→ component ←──→ screen
     ↑              │
     │              └── useQuery() reads data DOWN
     │
     └── useMutation() writes data UP to the database
         (user clicks "Add Budget" → mutation fires → DB updates → ALL clients auto-refresh)
```

---

## 5. Day-by-Day Study Plan

> **Rule: Do NOT memorize syntax. Ask yourself: "Why was this decision made?"**

---

### 📅 Day 1 — The Skeleton (How Pages Are Born)
**Time: ~1.5 hours | Files: `globals.css` → `layout.tsx` → `page.tsx`**

#### File 1: `app/globals.css` (10 lines)
```css
@import "tailwindcss";

@plugin "daisyui" {
  themes: all;
}

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

What's happening:
- Line 1: Activates the entire Tailwind CSS engine — every utility class (`flex`, `p-4`, `text-lg`) now works
- Lines 3-5: Plugs DaisyUI into Tailwind — every semantic class (`btn`, `card`, `navbar`) now works
- Lines 7-9: Maps the Google Fonts loaded in `layout.tsx` to CSS variables Tailwind can use

**Mental model:** This file is the power switch. Without it, no styling works. With it, the entire design system is active.

#### File 2: `app/layout.tsx` (35 lines)
The outer shell. Every page on the site is wrapped inside this layout.

Key observations:
- `data-theme="synthwave"` on `<html>` — this single attribute changes EVERY color in the app. DaisyUI maps its semantic tokens (`bg-base-100`, `text-primary`, etc.) to the active theme's palette
- `{children}` — this is where `page.tsx` gets injected. Layout wraps it
- `metadata` — SEO data (title, description) lives here, not in the HTML

#### File 3: `app/page.tsx` (28 lines — THE BOSS)
```tsx
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero {...config.hero} />
        <Problem {...config.problem} />
        <FeaturesAccordion {...config.features} />
        <Pricing tiers={config.pricing} />
        <FAQ {...config.faqs} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
```

**This is the most important file to understand.** It does three things:
1. Imports data from `config.tsx`
2. Imports components from `components/`
3. Wires data into components via props

It has ZERO logic. ZERO styling. ZERO text. That is the sign of a well-architected page.

**Questions to answer before moving to Day 2:**
- [ ] What happens if you change `data-theme="synthwave"` to `data-theme="luxury"` in `layout.tsx`?
- [ ] What does `{...config.hero}` actually do? (Hint: it's called the spread operator)
- [ ] Why does `<CTA />` have no props? (Hint: look at its default parameters)

---

### 📅 Day 2 — The Data Brain
**Time: ~2 hours | File: `config.tsx`**

Read `config.tsx` completely. This is your most important study session.

#### The Architecture of `config.tsx`

```
config.tsx
│
├── IMPORTS contracts FROM components
│   ├── PricingTier      ← defined in Pricing.tsx, imported here
│   ├── ProblemProps      ← defined in Problem.tsx, imported here
│   ├── FeaturesAccordionProps ← defined in FeaturesAccordion.tsx, imported here
│   └── FAQProps          ← defined in FAQ.tsx, imported here
│
├── DEFINES its OWN contracts
│   ├── HeroProps         ← exported so Hero.tsx can import it
│   ├── NavigationLink    ← exported so Footer.tsx can import it
│   ├── FooterColumn      ← exported so Footer.tsx can import it
│   └── ConfigProps       ← the MASTER contract (shape of the whole config)
│
└── EXPORTS the config object
    └── default export → imported by page.tsx, Header.tsx, Footer.tsx, MobileMenu.tsx
```

#### Why Some Interfaces Live in Config vs Components

| Interface lives in... | Reason |
|---|---|
| **The component** (`PricingTier` in `Pricing.tsx`) | The component OWNS that data shape. It defines what it needs. Config just satisfies the contract |
| **Config** (`HeroProps` in `config.tsx`) | The Hero component is simple enough that the contract makes more sense next to the data |

Both approaches are valid. The rule: _put the interface where it's most useful for the developer reading the code._

**Questions to answer before moving to Day 3:**
- [ ] What happens if you add a new field `buttonText: string` to `HeroProps` but forget to add it to the `hero` object? (Hint: TypeScript will scream at you)
- [ ] Why is `isPopular` marked with `?` (optional) in `PricingTier`? What does the Plus plan set it to?
- [ ] The `faqs.items[0].answer` contains JSX (`<p>...</p>`), not a plain string. How is this possible? (Hint: the type is `ReactNode`)

---

### 📅 Day 3 — Static Server Components (The Display Layer)
**Time: ~2.5 hours | Files: `ButtonSignin` → `Hero` → `Problem` → `TestimonialsAvatars` → `Footer`**

Study these in order. They go from simplest to most complex, but NONE of them have `"use client"`.

#### `ButtonSignin.tsx` — The Atom (25 lines)
The smallest possible component. One prop. One element. Notice:
- `extraStyle?: string` — the `?` means optional
- `${extraStyle ?? ""}` — `??` is the "nullish coalescing" operator. It means "use empty string if undefined"
- It's used in BOTH `Hero.tsx` and `Header.tsx` with different `extraStyle` values — same component, different appearance. **That's reusability.**

#### `Hero.tsx` — Props Destructuring (46 lines)
```tsx
function Hero({ title, description, image }: HeroProps) {
```
This destructures the props object. Instead of `props.title`, you write `title`. Same data, cleaner syntax.

Key patterns:
- `priority={true}` on `<Image>` — tells Next.js this image is above the fold, load it first (performance)
- `<TestimonialsAvatars priority={true} />` — one component rendering another. This is composition

#### `Problem.tsx` — Sub-Components + Conditional Rendering (80 lines)
The most instructive server component. Three patterns to learn:

**Pattern 1: Sub-components in the same file**
```tsx
const Arrow = ({ extraStyle }) => { ... };
const Step = ({ emoji, text }) => { ... };
export default function Problem({ ... }) { ... }
```
`Arrow` and `Step` are NOT exported. They are private helpers for `Problem`. This is like having private functions in a class.

**Pattern 2: List rendering with `.map()`**
```tsx
{steps.map((step, i) => (
  <Step key={step.id} emoji={step.emoji} text={step.text} />
))}
```
`.map()` transforms an array of data into an array of components. This is the #1 most used pattern in all of React.

**Pattern 3: Conditional rendering**
```tsx
{i < steps.length - 1 && <Arrow />}
```
"If this is NOT the last item, render an arrow." The `&&` is a short-circuit: if the left side is false, React renders nothing.

#### `TestimonialsAvatars.tsx` — Self-Contained Data (110 lines)
Notice the `avatars` array is defined INSIDE the component file, NOT in `config.tsx`. Why? Because these avatar images are a design element — a product manager would never change them from a config file. They're part of the visual design, not the content.

**Senior rule:** Not everything belongs in config. Put data in config when a non-developer might need to change it. Keep it local when it's a design decision.

#### `Footer.tsx` — Direct Config Import (97 lines)
This component imports `config` directly instead of receiving props from `page.tsx`. Why?
- The Footer appears on EVERY page of the site (home, pricing, terms, etc.)
- If it received props, EVERY page would have to pass the same footer data
- By importing config directly, it's self-sufficient

This is a **pragmatic** architectural decision. Rules exist to serve you, not the other way around.

---

### 📅 Day 4 — Interactive Client Components (Adding a Brain)
**Time: ~2 hours | Files: `MobileMenu.tsx` → `FeaturesAccordion.tsx` → `FAQ.tsx`**

Today you cross the most important line in Next.js: `"use client"`.

#### The Decision Tree (print this and tape it to your wall)

```
Does this component need to...
│
├── Remember something? (open/closed, selected tab, form input)
│   └── YES → "use client" + useState
│
├── Respond to user actions? (clicks, typing, scrolling)
│   └── YES → "use client"
│
├── Access browser APIs? (window, document, localStorage)
│   └── YES → "use client"
│
└── None of the above?
    └── Server Component — NO "use client"
```

#### `MobileMenu.tsx` — The Simplest Client Component (95 lines)

```tsx
"use client";  // ← THIS LINE changes everything

const [isOpen, setIsOpen] = useState<boolean>(false);
//     ↑ value   ↑ setter                  ↑ initial value
```

`useState` is React's memory. The component REMEMBERS whether the drawer is open or closed between renders.

Key patterns:
- `checked={isOpen}` — the checkbox's visual state is driven by React state (this is "controlled input")
- `onChange={(e) => setIsOpen(e.target.checked)}` — when user toggles, React state updates
- `onClick={() => setIsOpen(false)}` — every nav link closes the menu (good UX)
- `cta` prop is typed as `ReactNode` — it can receive ANY valid JSX (a button, a link, anything)

#### `FeaturesAccordion.tsx` — The Most Advanced Component (162 lines)

Two levels of state + `useRef`:

**Level 1: Parent state — which accordion item is open**
```tsx
const [featureSelected, setFeatureSelected] = useState<number>(0);
```

**Level 2: Ref — measuring the DOM for smooth animation**
```tsx
const accordion = useRef<HTMLDivElement>(null);
// ...
style={isOpen ? { maxHeight: accordion.current?.scrollHeight } : { maxHeight: 0 }}
```

`useRef` gives you a reference to an actual DOM element. You need this to measure its pixel height for the sliding animation. This is the ONLY reason to touch the DOM directly in React.

**The lifting state up pattern:**
```tsx
// Parent defines the state
const [featureSelected, setFeatureSelected] = useState(0);

// Parent passes a setter function DOWN to the child
<Item setFeatureSelected={() => setFeatureSelected(i)} />

// Child CALLS the function when clicked — this changes the parent's state
<button onClick={() => setFeatureSelected()}> 
```
Data flows down (which item is selected). Events flow up (user clicked item 2). **Law 2 in action.**

#### `FAQ.tsx` — Each Item Owns Its Own State (102 lines)

Unlike `FeaturesAccordion` where ONE parent tracks the selection, in FAQ, EACH `FaqItem` manages its OWN open/close state independently:

```tsx
const FaqItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);  // ← each item has its own brain
```

**Senior decision:** Why the different approach? Because FAQ items can be open simultaneously (you might want to compare two answers). Accordion items are exclusive (only one feature shown at a time). The UX requirement drives the architecture.

---

### 📅 Day 5 — The Header System + The Composition Pattern
**Time: ~1 hour | Files: `Header.tsx` + `MobileMenu.tsx` (revisited)**

The Header is the masterclass in composition: a **Server Component that contains a Client Component**.

```
Header.tsx (Server — NO "use client")
├── <Link> logo                    → Server-rendered, zero JS
├── Desktop nav links (.map())     → Server-rendered, zero JS
├── Desktop <ButtonSignin>         → Server-rendered, zero JS
└── <MobileMenu>                   → CLIENT Component, loaded with JS
    └── useState for open/close    → Only JS that ships to the browser
```

The CTA button is defined ONCE and shared:
```tsx
const cta: ReactNode = <ButtonSignin extraStyle="px-8" />;

// Used in desktop nav:
<div className="hidden lg:flex">{cta}</div>

// Passed to mobile menu:
<MobileMenu links={config.headerLinks} cta={cta} />
```

Single source of truth applied to JSX elements, not just data.

**Responsive visibility pattern (used everywhere):**
- Desktop elements: `className="hidden lg:flex"` — hidden on mobile, shown on large screens
- Mobile elements: `className="lg:hidden"` — shown on mobile, hidden on large screens
- No JavaScript involved. Pure CSS.

---

### 📅 Day 6 — Conditional Styling + The Config-Driven Pattern
**Time: ~1.5 hours | Files: `Pricing.tsx` → `CTA.tsx`**

#### `Pricing.tsx` — One Component, Multiple Visual States

```tsx
className={`card ... ${
  tier.isPopular
    ? "border-primary shadow-primary/20 lg:scale-105"
    : "border-transparent"
}`}
```

The `isPopular` boolean in config.tsx drives a completely different visual treatment. One component renders BOTH pricing cards — the "popular" card just gets extra classes.

This is the #1 pattern AI produces when you ask it to build cards, tables, or lists with varying styles.

#### `CTA.tsx` — Default Props

```tsx
export default function CTA({
  title = "Take control of your finances today",
  description = "Stop wondering where your money went...",
}: CTAProps) {
```

Default values in the function signature. If `page.tsx` doesn't pass a title, the default kicks in. This means `<CTA />` works with zero props AND `<CTA title="Custom title" />` also works. Maximum flexibility.

---

### 📅 Day 7 — The Full Picture + Convex Introduction + Simulation
**Time: 2+ hours | No new files**

#### Exercise 1: Trace 3 Complete Data Journeys
Pick any 3 sections and trace the data from `config.tsx` → `page.tsx` → component → HTML element. Write it out on paper.

#### Exercise 2: Build a New Section Without AI
Add a "How It Works" section:
1. Define an interface in a new `HowItWorks.tsx` file
2. Add the data to `config.tsx` under `ConfigProps`
3. Import and render it in `page.tsx`

If you can do this from memory (not syntax — the PROCESS), you've internalized the mental model.

#### Exercise 3: Build With AI
Ask your AI to build a Testimonials grid component. Evaluate the output against the 6 Laws.

#### Exercise 4: Convex Mental Mapping
Take 3 data items from your `config.tsx` and imagine:
- What would the Convex schema look like?
- Which ones would use `useQuery()` vs stay in config?
- Would the component need to change?

(Hint: the component almost never changes — only where the data comes from)

---

### 📅 Day 8 — Convex Fundamentals: Schema & Queries
**Time: ~2.5 hours | Focus: Understanding how Convex replaces config.tsx for dynamic data**

This is where your mental model EXPANDS. You already know:
- Data → Transport → Display
- Contracts define shapes
- Components don't care where data comes from

Now you'll learn how Convex implements this on the backend side.

#### Read Section 8 (Convex Fundamentals) of this roadmap
Study the schema definitions, query patterns, and compare them side-by-side with `config.tsx`.

**Questions to answer before moving to Day 9:**
- [ ] What's the difference between `v.string()` in Convex schema and `string` in TypeScript?
- [ ] Why does `useQuery()` return `undefined` before the data loads?
- [ ] When would you keep data in `config.tsx` vs move it to Convex?

---

### 📅 Day 9 — Convex Fundamentals: Mutations & Real-Time
**Time: ~2.5 hours | Focus: Writing data back and understanding reactivity**

#### Study mutations and actions
This is where Convex goes beyond what `config.tsx` can ever do — your UI can now WRITE data.

**Questions to answer before moving to Day 10:**
- [ ] What's the difference between a mutation and an action?
- [ ] Why do mutations automatically update all connected clients?
- [ ] What happens if you call `useMutation()` in a Server Component? (Hint: it breaks)

---

### 📅 Day 10 — Integration: Building a Feature End-to-End
**Time: 3+ hours | Build a complete Convex-powered feature**

#### Exercise: Build a Budget Tracker
1. Define the schema in `convex/schema.ts`
2. Write a query function in `convex/budgets.ts`
3. Write a mutation function for adding a budget
4. Build a display component (`BudgetList.tsx`)
5. Build a form component (`BudgetForm.tsx`)
6. Wire them together in a page

Apply ALL 6 Laws. Validate against both checklists (Section 12 + 13).

---

## 6. Server vs Client

### The Complete Decision Framework

```
START HERE
│
└── Does the component need to REMEMBER anything between renders?
    ├── NO  → Server Component ✅
    └── YES → What does it remember?
             │
             ├── Open/closed state (menu, accordion, modal)
             │   └── "use client" + useState<boolean>
             │
             ├── Selected item (tab, carousel, selected plan)
             │   └── "use client" + useState<number | string>
             │
             ├── Form input (text fields, dropdowns, checkboxes)
             │   └── "use client" + useState<string> per field
             │
             └── Data from an API (user data, live prices, notifications)
                 └── "use client" + useState + useEffect
                     (or in Convex: useQuery() which replaces both)
```

### In This Codebase

| Component | Server or Client | Reason |
|---|---|---|
| `Hero.tsx` | Server | Pure display. Props in → HTML out |
| `Problem.tsx` | Server | Pure display. No interaction |
| `Pricing.tsx` | Server | Pure display. Conditional classes, but no state |
| `CTA.tsx` | Server | Pure display with default props |
| `ButtonSignin.tsx` | Server | A button element alone has no state |
| `Footer.tsx` | Server | Static links from config |
| `TestimonialsAvatars.tsx` | Server | Static display of hardcoded avatars |
| `Header.tsx` | Server | Static layout (delegates interactivity to MobileMenu) |
| `MobileMenu.tsx` | **Client** | Tracks drawer open/closed state |
| `FeaturesAccordion.tsx` | **Client** | Tracks selected feature + accordion height |
| `FAQ.tsx` | **Client** | Each item tracks its own open/closed state |

### Convex Changes the Equation

When you add Convex, a new reason for `"use client"` appears:

| Reason for "use client" | Example |
|---|---|
| Needs `useState` for UI state | MobileMenu (open/close) |
| Needs `useQuery()` for live data | BudgetList (reads from DB) |
| Needs `useMutation()` to write data | TransactionForm (writes to DB) |

**The wrapper pattern** lets you minimize client-side JavaScript:

```tsx
// ❌ BAD: The entire display component becomes "use client"
"use client";
function BudgetPage() {
  const budgets = useQuery(api.budgets.list);
  // ... 200 lines of display logic that could be server-rendered
}

// ✅ GOOD: Only the data-fetching wrapper is "use client"
// BudgetPageWrapper.tsx — "use client"
"use client";
function BudgetPageWrapper() {
  const budgets = useQuery(api.budgets.list);
  if (!budgets) return <Loading />;
  return <BudgetDisplay items={budgets} />;  // Server-compatible component
}

// BudgetDisplay.tsx — Server Component (no "use client")
function BudgetDisplay({ items }: { items: Budget[] }) {
  // Pure display, no hooks, ships zero JS
}
```

---

## 7. The TypeScript Contract System

This is your most powerful tool for AI-assisted development.

### The Pattern

```tsx
// STEP 1: Define the contract (WHAT does this component need?)
export interface PricingTier {
  id: string;            // required
  name: string;          // required
  price: string;         // required
  description: string;   // required
  features: string[];    // required — array of strings
  isPopular?: boolean;   // OPTIONAL — the ? makes it optional
}

// STEP 2: Use the contract in the component
export default function Pricing({ tiers }: { tiers: PricingTier[] }) {
//                                         ↑ expects an ARRAY of PricingTier

// STEP 3: Config satisfies the contract
pricing: [
  {
    id: "plus",           // ✅ string
    name: "Plus",         // ✅ string
    price: "$19",         // ✅ string
    description: "...",   // ✅ string
    features: ["..."],    // ✅ string[]
    // isPopular omitted  // ✅ because it's optional (?)
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    description: "...",
    features: ["..."],
    isPopular: true,      // ✅ boolean — triggers special styling
  },
]
```

### Why AI Loves This

When you tell an AI: _"Build a component that accepts `PricingTier[]`"_, the AI knows EXACTLY:
- What fields exist
- What types they are
- Which are optional
- How to loop through the array

Without the contract, the AI guesses. With the contract, the AI is precise.

### Contracts in Convex — The Same Idea, Different Syntax

In Convex, you define contracts in `schema.ts` using `v.` validators instead of TypeScript types:

```
TypeScript Interface            Convex Schema
─────────────────────           ──────────────────────
interface Budget {              defineTable({
  name: string;                   name: v.string(),
  totalIncome: number;            totalIncome: v.number(),
  isActive?: boolean;             isActive: v.optional(v.boolean()),
  categories: string[];           categories: v.array(v.string()),
}                               })
```

**The concept is identical.** Both say: "This is the shape of the data." The TypeScript version enforces it at compile time. The Convex version enforces it at runtime (the database will REJECT data that doesn't match).

---

## 8. Convex Fundamentals — The Backend Brain

This section teaches you Convex from scratch, the same way Sections 1-7 taught you the frontend. Same approach: **mental models first, syntax second.**

### 8.1 What IS Convex?

Convex is a **reactive backend-as-a-service**. Let's unpack each word:

| Word | Meaning |
|---|---|
| **Backend** | It stores your data, runs your server-side logic, handles auth — everything that doesn't happen in the browser |
| **As-a-service** | You don't set up a server. No Docker, no AWS, no database configuration. Convex runs it all for you |
| **Reactive** | When data changes, every client seeing that data updates AUTOMATICALLY. No polling, no refresh buttons, no WebSocket code |

```
Traditional Backend:
  Browser → sends HTTP request → Server processes → sends response back → Browser shows it
  (User must refresh to see updates from other users)

Convex:
  Browser ←──── live WebSocket connection ────→ Convex
  (Data updates appear INSTANTLY across all connected clients)
```

### 8.2 The Convex File Structure

```
convex/                          ← ALL backend code lives here
│
├── _generated/                  ← AUTO-GENERATED. Never edit these files!
│   ├── api.d.ts                 ← Type-safe references to YOUR functions
│   ├── server.d.ts              ← Types for query/mutation/action helpers
│   └── dataModel.d.ts           ← Types derived from YOUR schema
│
├── schema.ts                    ← THE DATA CONTRACT (like config.tsx for the DB)
│   └── Defines every table and its field types
│
├── budgets.ts                   ← FUNCTIONS for the budgets table
│   ├── query: list              ← "Give me all budgets"
│   ├── query: getById           ← "Give me one specific budget"
│   └── mutation: create         ← "Add a new budget"
│
├── transactions.ts              ← FUNCTIONS for the transactions table
│   ├── query: listByBudget      ← "Give me all transactions for budget X"
│   └── mutation: add            ← "Record a new transaction"
│
└── categories.ts                ← FUNCTIONS for categories
    ├── query: list
    └── mutation: create
```

**Mental model:** The `convex/` folder IS your backend. `schema.ts` is the shape. The other files are the behavior.

### 8.3 Schema — Your Database's Config.tsx

In your current app, `config.tsx` defines the shape of all data. In Convex, `schema.ts` does the same thing for the database.

#### Side-by-Side: config.tsx vs convex/schema.ts

```tsx
// ──────────────────────────────────────────────
// CONFIG.TSX (what you have NOW)
// ──────────────────────────────────────────────

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const config = {
  pricing: [
    { id: "plus", name: "Plus", price: "$19", ... },
    { id: "pro", name: "Pro", price: "$49", ... },
  ]
};


// ──────────────────────────────────────────────
// CONVEX/SCHEMA.TS (what you'll have with Convex)
// ──────────────────────────────────────────────

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pricing: defineTable({
    name: v.string(),
    price: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    isPopular: v.optional(v.boolean()),
  }),
});
```

#### The Validator System (`v.xxx`)

Convex uses validators instead of TypeScript types to define what can be stored in the database. They look different but serve the exact same purpose.

```
TypeScript Type        Convex Validator            What It Means
─────────────          ──────────────              ────────────────
string                 v.string()                  A text value
number                 v.number()                  A numeric value
boolean                v.boolean()                 true or false
string[]               v.array(v.string())         A list of text values
number | null          v.union(v.number(),          A number OR null
                         v.null())
optional?: string      v.optional(v.string())      The field can be omitted
any                    v.any()                     ❌ DON'T USE — same as TypeScript's `any`
```

**Advanced validators you'll need for BudgetEasy:**

```tsx
// Nested objects (like a category within a budget)
v.object({
  name: v.string(),
  allocated: v.number(),
  spent: v.number(),
})

// Array of objects (like a list of categories)
v.array(v.object({
  name: v.string(),
  allocated: v.number(),
}))

// Union types (a transaction can be "income" or "expense")
v.union(v.literal("income"), v.literal("expense"))

// Reference to another table (like a foreign key)
v.id("budgets")  // ← references a row in the "budgets" table
```

#### Full Example: BudgetEasy Schema

```tsx
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Each table is like a section in config.tsx
  budgets: defineTable({
    name: v.string(),                    // "June 2026"
    totalIncome: v.number(),             // 5000
    createdAt: v.number(),               // timestamp
    userId: v.string(),                  // who owns this budget
  }),

  categories: defineTable({
    budgetId: v.id("budgets"),           // ← links to a specific budget
    name: v.string(),                    // "Groceries"
    allocated: v.number(),               // 400 (how much budgeted)
    color: v.optional(v.string()),       // "#4CAF50" for UI display
  }),

  transactions: defineTable({
    budgetId: v.id("budgets"),           // ← links to a budget
    categoryId: v.id("categories"),      // ← links to a category
    amount: v.number(),                  // 42.50
    description: v.string(),            // "Trader Joe's groceries"
    type: v.union(                       // "income" or "expense"
      v.literal("income"),
      v.literal("expense")
    ),
    date: v.number(),                    // timestamp
  }),
});
```

**Compare this to how you'd define the same data in config.tsx:**

```tsx
// If this lived in config.tsx (static, hardcoded):
interface Budget {
  name: string;
  totalIncome: number;
  createdAt: number;
  userId: string;
}

interface Category {
  budgetId: string;      // In config, this would just be a string
  name: string;
  allocated: number;
  color?: string;
}

// The SHAPES are nearly identical. The difference:
// - config.tsx: data is hardcoded, read-only, same for all users
// - schema.ts: data is live, read-write, unique per user
```

### 8.4 Queries — Reading Data (The Convex version of importing config)

A query is a function that READS data from the database. It's the Convex equivalent of `import config from "@/config"`.

#### Side-by-Side: Config Import vs Convex Query

```tsx
// ──────────────────────────────────────────────
// STATIC (what you do NOW)
// ──────────────────────────────────────────────

// In page.tsx:
import config from "@/config";
// config.pricing is immediately available
// It NEVER changes unless you edit the file


// ──────────────────────────────────────────────
// CONVEX (what you'll do with Convex)
// ──────────────────────────────────────────────

// STEP 1: Define the query (convex/budgets.ts)
import { query } from "./_generated/server";

export const list = query({
  // No arguments needed — just "give me everything"
  args: {},
  // The handler runs on the Convex server, NOT in the browser
  handler: async (ctx) => {
    return await ctx.db.query("budgets").collect();
    //          ↑ ctx.db is the database connection
    //                    ↑ .query("budgets") = "look in the budgets table"
    //                                         ↑ .collect() = "return all rows"
  },
});

// STEP 2: Use it in a component
"use client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function BudgetList() {
  const budgets = useQuery(api.budgets.list);
  //                       ↑ type-safe reference to the query you defined
  //    ↑ budgets is undefined while loading, then becomes Budget[]

  if (!budgets) return <div>Loading...</div>;  // ← handle the loading state

  return budgets.map(budget => (
    <div key={budget._id}>{budget.name}</div>
  ));
}
```

#### Query Patterns You'll Use in BudgetEasy

```tsx
// Pattern 1: Get all items
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("budgets").collect();
  },
});

// Pattern 2: Get one item by ID
export const getById = query({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.budgetId);
    //                  ↑ .get() returns a single document by ID
  },
});

// Pattern 3: Filter items (like SQL WHERE)
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("budgets")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      //              ↑ "where userId equals the argument"
      .collect();
  },
});

// Pattern 4: Get items with ordering
export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("budgets")
      .order("desc")           // ← newest first
      .take(10);               // ← only get 10
  },
});

// Pattern 5: Get related data (join-like)
export const getWithCategories = query({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    const budget = await ctx.db.get(args.budgetId);
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("budgetId"), args.budgetId))
      .collect();
    return { ...budget, categories };
    //     ↑ combine budget + its categories into one object
  },
});
```

### 8.5 Mutations — Writing Data (What config.tsx Can Never Do)

A mutation is a function that WRITES data to the database. This is where Convex goes beyond `config.tsx`. Config is read-only. Mutations let the UI change data.

```tsx
// convex/budgets.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// CREATE a new budget
export const create = mutation({
  // Define EXACTLY what arguments this mutation accepts (the contract!)
  args: {
    name: v.string(),
    totalIncome: v.number(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert a new row into the budgets table
    const budgetId = await ctx.db.insert("budgets", {
      name: args.name,
      totalIncome: args.totalIncome,
      userId: args.userId,
      createdAt: Date.now(),
    });
    return budgetId;  // ← returns the new document's ID
  },
});

// UPDATE an existing budget
export const updateIncome = mutation({
  args: {
    budgetId: v.id("budgets"),
    newIncome: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.budgetId, {
      totalIncome: args.newIncome,
    });
    // .patch() updates ONLY the fields you specify
    // .replace() would overwrite the ENTIRE document
  },
});

// DELETE a budget
export const remove = mutation({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.budgetId);
  },
});
```

#### Using Mutations in Components

```tsx
"use client";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

function CreateBudgetForm() {
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  
  // useMutation returns a function you can call
  const createBudget = useMutation(api.budgets.create);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createBudget({
      name: name,
      totalIncome: parseFloat(income),
      userId: "user123",  // will come from auth later
    });
    
    // After the mutation succeeds:
    // 1. The database is updated
    // 2. ALL useQuery() calls watching "budgets" auto-refresh
    // 3. Every connected client sees the new budget instantly
    // 4. You don't need to manually refresh or invalidate anything
    
    setName("");
    setIncome("");
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={income} onChange={(e) => setIncome(e.target.value)} />
      <button type="submit" className="btn btn-primary">Create Budget</button>
    </form>
  );
}
```

### 8.6 Actions — When You Need the Outside World

Actions are for things that go BEYOND the database: calling external APIs, sending emails, processing payments. They're less common but important to understand.

```
query     → READ from database     (pure, cacheable, fast)
mutation  → WRITE to database      (pure, transactional, auto-syncs)
action    → TALK to outside world  (can call APIs, send emails, etc.)
```

```tsx
// convex/notifications.ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendBudgetAlert = action({
  args: { userId: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    // Actions CAN call external APIs
    await fetch("https://api.email-service.com/send", {
      method: "POST",
      body: JSON.stringify({
        to: args.userId,
        message: args.message,
      }),
    });
    
    // Actions can also call mutations internally
    await ctx.runMutation(api.notifications.markSent, {
      userId: args.userId,
    });
  },
});
```

**When to use each:**

| Use | When | Example |
|---|---|---|
| **Query** | Reading data to display | "Show me all my budgets" |
| **Mutation** | Creating, updating, or deleting data | "Add a new transaction" |
| **Action** | Calling external services | "Send an email when budget exceeds limit" |

### 8.7 The Convex Provider — Wiring It All Together

Before any `useQuery` or `useMutation` works, your app needs a `ConvexProvider` wrapping the component tree. This is like how `layout.tsx` wraps all pages.

```tsx
// app/ConvexClientProvider.tsx
"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
//                                   ↑ The URL of your Convex deployment
//                                     Set this in .env.local

export default function ConvexClientProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
```

```tsx
// app/layout.tsx — wrap your app with the provider
import ConvexClientProvider from "./ConvexClientProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html data-theme="synthwave">
      <body>
        <ConvexClientProvider>
          {children}        {/* ← now every page can use useQuery/useMutation */}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

**Mental model:** `ConvexProvider` is like plugging in the WiFi router. Without it, no component can talk to the database. With it, every component inside the tree can read and write data.

### 8.8 Indexes — Making Queries Fast

When your database grows, you need indexes to keep queries fast. Think of them like the index at the back of a textbook — instead of reading every page, you jump directly to what you need.

```tsx
// convex/schema.ts
export default defineSchema({
  transactions: defineTable({
    budgetId: v.id("budgets"),
    categoryId: v.id("categories"),
    amount: v.number(),
    date: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
  })
    // Indexes go AFTER the table definition
    .index("by_budget", ["budgetId"])           // ← fast lookup by budget
    .index("by_category", ["categoryId"])       // ← fast lookup by category
    .index("by_budget_and_date", ["budgetId", "date"]),  // ← fast lookup + sorting
});
```

Using an index in a query:

```tsx
// WITHOUT index (scans every row — slow for large tables)
export const listByBudget = query({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("budgetId"), args.budgetId))
      .collect();
  },
});

// WITH index (jumps directly to matching rows — fast)
export const listByBudget = query({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_budget", (q) => q.eq("budgetId", args.budgetId))
      //         ↑ use the index we defined in schema.ts
      .collect();
  },
});
```

**Rule of thumb:** If you're filtering by a field in a query, that field should have an index.

### 8.9 Real-Time Reactivity — The Killer Feature

This is what makes Convex fundamentally different from REST APIs. **You never manually refresh data.**

```
REST API approach (without Convex):
  1. Component mounts → fetch data → display
  2. Another user adds a budget
  3. Your screen is STALE — you're looking at old data
  4. You must manually poll or refresh to see updates

Convex approach:
  1. Component mounts → useQuery() subscribes → display
  2. Another user adds a budget
  3. Convex server pushes the update through WebSocket
  4. useQuery() automatically re-renders your component
  5. Your screen is ALWAYS up to date
```

```tsx
// This component will ALWAYS show the latest data
// Even if another user (or another browser tab) adds a budget
function BudgetList() {
  const budgets = useQuery(api.budgets.list);
  // ^^ This is not a one-time fetch. It's a SUBSCRIPTION.
  // It re-runs every time the "budgets" table changes.
  
  // You don't need:
  // ❌ useEffect(() => { fetch(...) }, [])
  // ❌ setInterval to poll for updates
  // ❌ manual cache invalidation
  // ❌ WebSocket setup code
  
  if (!budgets) return <Loading />;
  return budgets.map(b => <BudgetCard key={b._id} budget={b} />);
}
```

---

## 9. The Bridge to Convex — Where the Config Pattern Evolves

Right now, `config.tsx` is a **static** single source of truth. The data is hardcoded in a file. When you move to Convex, the single source of truth becomes a **live database**, but the mental model is IDENTICAL.

### What Changes, What Stays

| Concept | BudgetEasy (now) | BudgetEasy + Convex (future) |
|---|---|---|
| **Where data lives** | `config.tsx` (a file) | Convex database (a cloud) |
| **How data moves to components** | Props from `page.tsx` | `useQuery()` hook from Convex |
| **How data is written** | Edit the file manually | `useMutation()` from the UI |
| **TypeScript contracts** | Same | Same (Convex uses your schema for types) |
| **Server vs Client** | Same decision tree | Same, but components using `useQuery()` must be `"use client"` |
| **Component structure** | Same | Same |
| **One job per component** | Same | Same |
| **Separation of concerns** | Same | Same |
| **Real-time updates** | ❌ Not possible | ✅ Automatic |

### The Evolution in Code

```tsx
// ──────────────────────────────────────────────
// TODAY (Static Landing Page):
// ──────────────────────────────────────────────

// config.tsx
const config = {
  pricing: [
    { id: "plus", name: "Plus", price: "$19", ... },
  ]
};

// page.tsx
import config from "@/config";
<Pricing tiers={config.pricing} />

// Pricing.tsx — a SERVER Component
function Pricing({ tiers }: { tiers: PricingTier[] }) {
  return tiers.map(tier => <PriceCard key={tier.id} {...tier} />);
}


// ──────────────────────────────────────────────
// TOMORROW (Convex-Powered SaaS):
// ──────────────────────────────────────────────

// convex/pricing.ts
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pricing").collect();
  },
});

// PricingWrapper.tsx — a CLIENT Component (handles data fetching)
"use client";
function PricingWrapper() {
  const tiers = useQuery(api.pricing.list);
  if (!tiers) return <Loading />;
  return <Pricing tiers={tiers} />;
}

// Pricing.tsx — UNCHANGED. Still a SERVER-compatible Component
function Pricing({ tiers }: { tiers: PricingTier[] }) {
  return tiers.map(tier => <PriceCard key={tier.id} {...tier} />);
}
```

**The component `Pricing.tsx` doesn't change at all.** It still receives a `PricingTier[]` and renders it. It doesn't care if the data came from a hardcoded file or a live database. **That's the power of separation of concerns.**

### What Convex Adds to Your Mental Model

```
CURRENT MENTAL MODEL:
  Data (config.tsx) → Transport (props) → Display (component)

CONVEX MENTAL MODEL:
  Data (database) → Transport (useQuery/useMutation) → Display (component)
                   → Mutations (useMutation) change data → database auto-syncs
```

New concepts you've learned in this roadmap:
- **`useQuery()`** — replaces reading from config. Returns live data that auto-updates
- **`useMutation()`** — lets the UI WRITE data back (like a user saving a budget)
- **`action()`** — for external API calls (email, payments, etc.)
- **Schema definitions** — similar to your TypeScript interfaces, but they define the database structure
- **Indexes** — make queries fast by pre-organizing data
- **Real-time reactivity** — when data changes in the DB, every connected client auto-updates. No refresh needed

But the 6 Laws still apply. Data still flows down. Components still have one job. Contracts still define shapes. You just swap the data source.

### What Stays in config.tsx vs What Moves to Convex

Not everything should move to the database. Here's the decision framework:

| Data | Keep in config.tsx | Move to Convex | Why |
|---|---|---|---|
| App name, logo | ✅ | | Changes once a year, if ever |
| Navigation links | ✅ | | Same for all users, rarely changes |
| SEO metadata | ✅ | | Static, per-page |
| Hero text/images | ✅ | | Marketing copy, changes infrequently |
| Pricing tiers | Maybe | Maybe | Depends: static marketing page = config. Dynamic pricing = Convex |
| User budgets | | ✅ | Different per user, changes constantly |
| Transactions | | ✅ | Created by users, queried and filtered |
| Categories | | ✅ | Users customize them |
| User preferences | | ✅ | Theme, currency, display settings |

**Rule:** If a non-developer edits it monthly or less → `config.tsx`. If a user changes it in the app → Convex.

---

## 10. The 10x AI Workflow

After this week, this is how you build:

### For Static Components (config-driven):

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: THINK (You — 2 minutes)                            │
│                                                             │
│ "I need a Testimonials section with user quotes,            │
│  names, photos, displayed in a card grid."                  │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: DEFINE THE CONTRACT (You — 5 minutes)               │
│                                                             │
│ export interface Testimonial {                              │
│   id: string;                                               │
│   name: string;                                             │
│   quote: string;                                            │
│   avatarSrc: string;                                        │
│   role?: string;                                            │
│ }                                                           │
│                                                             │
│ Add testimonials: Testimonial[] to ConfigProps              │
│ Add the actual data to the config object                    │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: PROMPT THE AI (You — 30 seconds)                    │
│                                                             │
│ "Build a Testimonials.tsx Server Component.                 │
│  It accepts { items: Testimonial[] }.                       │
│  Display them in a responsive grid of DaisyUI cards.        │
│  Use bg-base-200 for the section background.                │
│  Follow the same patterns as my Pricing.tsx component."     │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: VALIDATE (You — 2 minutes)                          │
│                                                             │
│ Check the AI output against the 6 Laws:                     │
│ ✅ Does it have "use client"? (It shouldn't — no state)     │
│ ✅ Does it accept typed props?                               │
│ ✅ Does it use .map() to render the array?                   │
│ ✅ Does it use key={item.id}?                                │
│ ✅ Does it use semantic DaisyUI classes, not hardcoded hex?  │
│ ✅ Does it have ONE job (display testimonials)?              │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: WIRE IT UP (You — 1 minute)                         │
│                                                             │
│ In page.tsx:                                                │
│ import Testimonials from "@/components/Testimonials"        │
│ <Testimonials items={config.testimonials} />                │
└─────────────────────────────────────────────────────────────┘

Total time: ~10 minutes for a complete, production-quality section.
Without this mental model: 2-4 hours of fumbling and debugging.
```

### For Convex-Powered Features (database-driven):

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: THINK (You — 2 minutes)                            │
│                                                             │
│ "I need a budget list that shows all budgets for the        │
│  logged-in user, with real-time updates."                   │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: DEFINE THE CONTRACTS (You — 10 minutes)             │
│                                                             │
│ A. Database contract (convex/schema.ts):                    │
│    budgets: defineTable({                                   │
│      name: v.string(),                                      │
│      totalIncome: v.number(),                               │
│      userId: v.string(),                                    │
│    })                                                       │
│                                                             │
│ B. Component contract:                                      │
│    interface BudgetCardProps {                               │
│      _id: Id<"budgets">;                                    │
│      name: string;                                          │
│      totalIncome: number;                                   │
│    }                                                        │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: BUILD THE BACKEND (You or AI — 5 minutes)           │
│                                                             │
│ "Write a Convex query in convex/budgets.ts that returns     │
│  all budgets for a given userId, ordered by createdAt desc. │
│  Use the by_user index."                                    │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: BUILD THE FRONTEND (AI — 2 minutes)                 │
│                                                             │
│ "Build BudgetList.tsx as a 'use client' component.          │
│  Use useQuery(api.budgets.listByUser, { userId }).          │
│  Handle loading state. Pass data to BudgetCard components.  │
│  Use DaisyUI card classes. Follow Pricing.tsx patterns."    │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: VALIDATE (You — 3 minutes)                          │
│                                                             │
│ Check against the 6 Laws AND Convex rules:                  │
│ ✅ Does it use "use client"? (It should — uses useQuery)    │
│ ✅ Does it handle undefined/loading state?                   │
│ ✅ Does the query use an index for the filter?              │
│ ✅ Does the mutation validate its arguments?                 │
│ ✅ Is the display component separated from data fetching?   │
│ ✅ Does it use semantic DaisyUI classes?                     │
└─────────────────────────────────────────────────────────────┘

Total time: ~20 minutes for a complete, real-time, database-backed feature.
```

---

## 11. The AI Context Wall — How to Survive Week 3

The biggest trap solo developers fall into with AI: **Day one, your AI knows everything. Week three, it forgets.**

As your codebase grows, the AI loses the plot. It starts suggesting patterns you abandoned days ago. It forgets your tech stack. It overwrites your customized UI components with generic code. 

**The Fix:** Keep a single `CONTEXT.md` file in the root of your project. 

Paste the contents of this file at the start of *every single AI session* (or set it as a permanent instruction if your AI tool supports it). It should be short and evolve as you build. It acts as the permanent memory for your AI assistant.

### Example `CONTEXT.md`

```markdown
# Project Context: BudgetEasy
- **Stack:** Next.js (App Router), React, Tailwind CSS, DaisyUI, Convex.
- **Styling Rules:** Use semantic DaisyUI tokens (`bg-base-100`, `text-primary`) only. Never use hardcoded Tailwind hex colors.
- **Architecture:** We follow strict Separation of Concerns. UI components (in `/components`) should be "dumb" and receive data via props. 
- **Data Flow:** All static data originates from `config.tsx`. When building Convex queries, wrapper components fetch data and pass it down as props.
- **Server/Client:** Default to Server Components. Only use `"use client"` when state (`useState`), browser APIs, or interactivity is explicitly required.
- **Convex Rules:** All database functions live in `convex/`. Queries are pure reads. Mutations are pure writes. Actions are for external APIs only. Always define indexes for filtered queries.
```

If you do this, your AI will code like a Senior Dev on Week 3, not a confused intern.

---

## 12. Next.js Best Practices Checklist

Use this as a quick reference when building or reviewing AI-generated code.

### Architecture
- [ ] Pages are thin — they import and assemble, nothing more
- [ ] Layout wraps all pages with shared shell (fonts, theme, metadata)
- [ ] Components are self-contained — each one can be understood in isolation
- [ ] Data lives in config or a database, NOT hardcoded in components

### Performance
- [ ] Server Components by default — `"use client"` only when state or interactivity is required
- [ ] `priority={true}` on above-the-fold images
- [ ] Next.js `<Image>` instead of plain `<img>` (automatic optimization)
- [ ] Next.js `<Link>` instead of plain `<a>` for internal links (client-side navigation)

### TypeScript
- [ ] Every component has a typed props interface
- [ ] Interfaces are exported when other files need them
- [ ] Use `?` for optional fields, never pass `undefined` manually
- [ ] Config object is typed with a master interface

### Styling (Tailwind + DaisyUI)
- [ ] Use semantic DaisyUI tokens (`bg-base-100`, `text-primary`) instead of raw colors (`bg-blue-600`)
- [ ] Theme is set via `data-theme` on `<html>`, never hardcoded
- [ ] Responsive design uses Tailwind breakpoints (`md:`, `lg:`) not media queries
- [ ] Opacity uses Tailwind syntax (`text-base-content/80` = 80% opacity)

### SEO
- [ ] One `<h1>` per page (in the Hero)
- [ ] Heading hierarchy is correct (`h1` → `h2` → `h3`)
- [ ] `metadata` is exported from layout or page files
- [ ] All images have descriptive `alt` text
- [ ] All links have descriptive `title` attributes

---

## 13. Convex Best Practices Checklist

Use this alongside the Next.js checklist when building database-powered features.

### Schema
- [ ] Every table is defined in `convex/schema.ts`
- [ ] Field types use `v.` validators (never raw TypeScript types in schema)
- [ ] Optional fields use `v.optional()` (not `?`)
- [ ] References between tables use `v.id("tableName")` (not plain strings)
- [ ] Indexes are defined for every field used in `.filter()` queries

### Queries
- [ ] Queries are defined with `query()` from `"./_generated/server"`
- [ ] Arguments are validated with `args: { fieldName: v.type() }`
- [ ] Filtered queries use `.withIndex()` instead of `.filter()` when an index exists
- [ ] Queries return the minimal data needed (don't return entire tables if you only need a few fields)

### Mutations
- [ ] Mutations are defined with `mutation()` from `"./_generated/server"`
- [ ] All arguments are validated — never trust client input
- [ ] Use `.patch()` for partial updates, `.replace()` for full replacements
- [ ] Mutations return useful values (e.g., the new document's ID)

### Actions
- [ ] Actions are used ONLY for external API calls (email, payment, etc.)
- [ ] Actions call `ctx.runMutation()` or `ctx.runQuery()` to interact with the database (never `ctx.db` directly)
- [ ] Actions are NOT used for simple database operations (use mutations instead)

### Client-Side
- [ ] `ConvexProvider` wraps the app in `layout.tsx`
- [ ] `useQuery()` is only called inside `"use client"` components
- [ ] Loading states are handled (`if (!data) return <Loading />`)
- [ ] `useMutation()` functions are called in event handlers, not during render
- [ ] Error states are handled with try/catch or error boundaries

### Architecture
- [ ] Display components are separated from data-fetching components (wrapper pattern)
- [ ] Convex functions are organized by table (one file per table)
- [ ] `_generated/` folder is never manually edited
- [ ] `.env.local` contains `NEXT_PUBLIC_CONVEX_URL` (never committed to git)

---

## Final Words

You don't need to be a React expert to build with AI. You need to be an **architect** who understands:

1. **Where does data live?** → Config, Convex database, or API
2. **How does data move?** → Props down, events up, `useQuery()` subscribes, `useMutation()` writes
3. **Who is responsible for what?** → One job per component, one job per Convex function
4. **When is JS needed?** → Only for interactivity and live data
5. **What shape is the data?** → TypeScript contracts on the frontend, `v.` validators on the backend

Master these 5 questions. The AI handles the rest. That's the 10x.
