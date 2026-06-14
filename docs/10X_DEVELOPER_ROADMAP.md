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
8. [The Bridge to Convex — Where the Config Pattern Evolves](#8-the-bridge-to-convex)
9. [The 10x AI Workflow — How You Will Actually Build After This Week](#9-the-10x-ai-workflow)
10. [Next.js Best Practices Checklist](#10-nextjs-best-practices-checklist)

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

---

## 2. The Universal Mental Model — 6 Laws That Never Change

These laws apply to React, Vue, Svelte, Angular, Flutter, SwiftUI, and any frontend framework that will be invented in the next 20 years. They also apply to Convex, Supabase, Firebase, or any backend you will ever use.

### Law 1: Separation of Concerns
> "Every file should have ONE reason to change."

Bad: A component that contains its own text, its own styling logic, its own API call, and its own error handling.
Good: A component that ONLY displays data it receives. The data comes from somewhere else. The styling comes from a design system. The API call lives in a separate function.

**In this codebase:** `config.tsx` owns the data. `components/` own the display. `globals.css` owns the design system. `page.tsx` owns the assembly. Four concerns, four locations.

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

### Law 3: Single Source of Truth
> "Every piece of data should have exactly ONE owner."

If your app name appears in the header, footer, SEO title, and emails — it should be defined in ONE place and imported everywhere else.

**In this codebase:** `config.appName` is used by `Header.tsx`, `Footer.tsx`, `MobileMenu.tsx`, and `layout.tsx`. Change it once → the entire app updates.

### Law 4: Static by Default, Interactive Only When Necessary
> "Don't pay for JavaScript you don't need."

Most of your UI is static — it doesn't respond to clicks, it doesn't track state, it doesn't change after the page loads. Only make something interactive (client-side) when the user needs to interact with it.

**In this codebase:** 11 component files. Only 3 have `"use client"` (`MobileMenu.tsx`, `FeaturesAccordion.tsx`, `FAQ.tsx`). The other 8 ship zero JavaScript to the browser.

### Law 5: Contracts Before Code
> "Define the shape of your data before you write a single line of UI."

When you define a TypeScript interface, you are writing a contract: "This component REQUIRES this exact shape of data, nothing more, nothing less." This prevents bugs, enables autocomplete, and — critically — allows AI to generate correct code because it knows exactly what shape to produce.

**In this codebase:** Every component exports or imports a typed interface (`HeroProps`, `PricingTier`, `FAQItemData`, etc.). The config object is typed as `ConfigProps` which references all of them.

### Law 6: Composition Over Complexity
> "Build small things that snap together, not big things that do everything."

Don't build a `MegaPage` component with 500 lines. Build 10 components with 50 lines each, then assemble them in your page file.

**In this codebase:** `page.tsx` is only 28 lines. It imports 8 components and assembles them. Each component is self-contained and testable in isolation.

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

---

## 4. The Data Flow — Following a Piece of Data from Birth to Screen

Let's trace the hero title from creation to pixel. This is the most important exercise in the entire roadmap.

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
│ function Hero({ title, description, image }) {   │  ← destructure: extract
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

### 📅 Day 7 — The Full Picture + Convex Bridge + Simulation
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

---

## 8. The Bridge to Convex

Right now, `config.tsx` is a **static** single source of truth. The data is hardcoded in a file. When you move to Convex, the single source of truth becomes a **live database**, but the mental model is IDENTICAL.

### What Changes, What Stays

| Concept | BudgetEasy (now) | BudgetEasy + Convex (future) |
|---|---|---|
| **Where data lives** | `config.tsx` (a file) | Convex database (a cloud) |
| **How data moves to components** | Props from `page.tsx` | `useQuery()` hook from Convex |
| **TypeScript contracts** | Same | Same (Convex uses your schema for types) |
| **Server vs Client** | Same decision tree | Same, but components using `useQuery()` must be `"use client"` |
| **Component structure** | Same | Same |
| **One job per component** | Same | Same |
| **Separation of concerns** | Same | Same |

### The Evolution

```
TODAY (Static Landing Page):
config.tsx  →  page.tsx  →  <Pricing tiers={config.pricing} />

TOMORROW (Convex-Powered SaaS):
Convex DB  →  useQuery(api.pricing.list)  →  <Pricing tiers={pricingData} />
```

The component `Pricing.tsx` doesn't change at all. It still receives a `PricingTier[]` and renders it. It doesn't care if the data came from a hardcoded file or a live database. **That's the power of separation of concerns.**

### What Convex Adds to Your Mental Model

```
CURRENT MENTAL MODEL:
  Data (config.tsx) → Transport (props) → Display (component)

CONVEX MENTAL MODEL:
  Data (database) → Transport (useQuery/useMutation) → Display (component)
                   → Mutations (useAction) change data → database auto-syncs
```

New concepts you'll learn with Convex:
- **`useQuery()`** — replaces reading from config. Returns live data that auto-updates
- **`useMutation()`** — lets the UI WRITE data back (like a user saving a budget)
- **Schema definitions** — similar to your TypeScript interfaces, but they define the database structure
- **Real-time reactivity** — when data changes in the DB, every connected client auto-updates. No refresh needed

But the 6 Laws still apply. Data still flows down. Components still have one job. Contracts still define shapes. You just swap the data source.

---

## 9. The 10x AI Workflow

After this week, this is how you build:

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

---

## 10. Next.js Best Practices Checklist

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

## Final Words

You don't need to be a React expert to build with AI. You need to be an **architect** who understands:

1. **Where does data live?** → Config, database, or API
2. **How does data move?** → Props down, events up
3. **Who is responsible for what?** → One job per component
4. **When is JS needed?** → Only for interactivity
5. **What shape is the data?** → TypeScript contracts

Master these 5 questions. The AI handles the rest. That's the 10x.
