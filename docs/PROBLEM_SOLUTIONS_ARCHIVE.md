# 🛠 Problem & Solutions Archive

This document serves as a historical record of the problems we faced while building BudgetEasy, along with their solutions. You can refer back to this anytime you encounter a similar issue!

---

## 1. DaisyUI Themes Not Working (Synthwave / Light)
**Problem:** Setting `data-theme="synthwave"` or `data-theme="light"` wasn't updating the website correctly. Also, the Tailwind CSS v4 syntax for adding themes was causing issues.
**Solution:** 
- We ensured that `@plugin "daisyui" { themes: all; }` was correctly formatted in `globals.css`.
- We updated `app/layout.tsx` to set the `data-theme="light"` property dynamically on the `<html>` tag. 
- *Key Takeaway:* Always check the `<html>` tag in `layout.tsx` if your theme feels "stuck", as hardcoding a theme there will override your system preferences.

## 2. Inconsistent UI Spacing (Padding & Margins)
**Problem:** The layout felt jumpy as you scrolled. Sections like the Hero, Pricing, and Problem components had wildly different paddings (`py-8 lg:py-20`, `pt-24 pb-12`, `py-16 md:py-32`). There were also weird black margins on the sides of the Hero section.
**Solution:** 
- We standardized the vertical padding across all section containers to `py-16 md:py-24` (4rem on mobile, 6rem on desktop).
- We applied `max-w-7xl mx-auto` to the inner containers to ensure content was perfectly centered and didn't bleed to the edges.
- *Key Takeaway:* Consistency is key in web design. Pick one vertical spacing utility (like `py-24`) and stick to it across all your main landing page sections.

## 3. Mobile Burger Menu Alignment Issues
**Problem:** The mobile drawer menu was centered instead of being aligned to the right. The "Get Started" button was stuck at the bottom, and there was an unwanted straight line above it.
**Solution:** 
- Added the `ml-auto` utility class to the drawer container to push it to the right.
- Removed the `mt-auto` (margin-top auto) class from the button so it would naturally follow the navigation links.
- Removed the dividing border (`border-t`) that was causing the straight line.

## 4. CTA Button Sizing Inconsistency
**Problem:** Two Call-To-Action buttons on the same page had different sizes, making the design look inconsistent.
**Solution:** 
- We created a "Single Source of Truth" component: `ButtonSignin.tsx`.
- We gave it an `extraStyle` prop. This allows the Header to use the default small size (`<ButtonSignin />`), while the Hero section can pass `extraStyle="btn-wide"` to make it larger where appropriate.

## 5. Pricing Typographic Alignment (The "Tilting" Text)
**Problem:** The `/month` text next to the `$19` price looked slanted or disjointed.
**Solution:** 
- This was an optical illusion caused by the `/` slash combined with `items-baseline` alignment. `items-baseline` anchors the bottom of the large text and small text to the exact same invisible line. 
- *Key Takeaway:* `items-baseline` is the typographically correct way to align fonts of different sizes on the same line, even if special characters like slashes make it look slightly off initially.

## 6. The "use client" and Suspense Confusion
**Problem:** You weren't sure if `Suspense` was needed for the Header, or if components with simple links (like the Footer) needed the `"use client"` directive.
**Solution:** 
- We established that **links do not require `"use client"`**. Next.js `<Link>` components work perfectly in Server Components.
- We clarified that `Suspense` boundaries are only strictly necessary if a Client Component uses the `useSearchParams()` hook (which forces dynamic rendering). Since our Header and Footer are static, they do not need Suspense!

## 7. Hardcoded Text vs. Config Files (The "Marc Lou" Approach)
**Problem:** You asked why we use a `config.tsx` file for text instead of just hardcoding labels directly into components like `Pricing.tsx` or `FAQ.tsx`.
**Solution:** 
- We use a config file to separate **content** from **presentation**. 
- It makes editing copy significantly easier later on (you don't have to scroll through HTML/Tailwind classes to change a price).
- It provides a Single Source of Truth if you need to use the app name or pricing data in multiple places (like your SEO metadata or Stripe API routes).

## 8. Network Port Already In Use
**Problem:** When running `npm run dev`, it failed because port 3000 was already in use.
**Solution:** 
- This happens when a previous server crashes or is sent to the background without being properly closed. 
- *Key Takeaway:* You can kill the running port using a terminal command like `npx kill-port 3000` or by finding the process ID and terminating it.

## 9. Vercel Deployment & GitHub Integration
**Problem:** Figuring out how to deploy the Next.js app to Vercel and organize documentation in the GitHub repository.
**Solution:** 
- Deployed the site using the Vercel CLI (`npx vercel --prod`).
- Wrote a detailed `DEPLOYMENT.md` guide and moved it into a neatly organized `docs/` folder before pushing it to GitHub.

## 10. Native Smooth Scrolling Feeling "Instant"
**Problem:** We added the `scroll-smooth` class to the `<html>` tag to enable smooth scrolling to anchor links (like `#pricing`), but clicking the links still instantly snapped to the section.
**Solution:** 
- The `<html>` tag had the `h-full` class. When the `<html>` element's height is constrained to 100%, the browser gets confused about the scrolling container, which breaks CSS smooth scrolling.
- We removed `h-full` from the `<html>` tag and changed the `<body>` tag to use `min-h-screen` instead.
- *Key Takeaway:* CSS smooth scrolling requires the browser to correctly identify the document as the scroll container. Be careful when applying height constraints like `h-full` to the root `<html>` element!

## 11. Code Pushed to GitHub Not Reflecting on Vercel (The Synthwave Theme Issue)
**Problem:** You changed the theme to `synthwave`, pushed the code to GitHub (`git push origin main`), but the live Vercel site was still showing the old light theme.
**Solution:** 
- The Vercel project was never properly linked to the GitHub repository in the Vercel Dashboard, so Vercel didn't know it needed to trigger a rebuild when new code was pushed to GitHub.
- We temporarily bypassed this by running a manual production deployment from the terminal (`npx vercel --prod --yes`).
- *Key Takeaway:* If your live site isn't updating after a `git push`, your repository isn't linked. Go to your Vercel Dashboard -> Settings -> Git to connect your GitHub repo for automatic deployments.

## 12. TypeScript: `HeroProps` Not a Named Export from `@/config`
**Problem:** `Hero.tsx` used a named import `{ HeroProps } from "@/config"`, but `config.tsx` never declared or exported an interface called `HeroProps`. TypeScript reported:
```
Module '"@/config"' has no exported member 'HeroProps'.
Did you mean to use 'import HeroProps from "@/config"' instead?
```
**Root Cause:** The `config.tsx` file only had `export default config`. It had no named exports for any TypeScript interfaces, so `{ HeroProps }` could not be resolved.
**Solution:**
- Defined and exported `HeroProps` directly from `config.tsx` as a named export:
  ```ts
  export interface HeroProps {
    title: string;
    description: string;
    image: { src: string; alt: string };
  }
  ```
- No changes were needed in `Hero.tsx` — the named import `{ HeroProps } from "@/config"` was already the correct pattern.
- *Key Takeaway:* If you want to share a TypeScript interface from a file that uses `export default`, you must also explicitly add `export interface` (or `export type`) for that interface. A default export does **not** make named exports available automatically.

## 13. TypeScript: `Property 'hero' Does Not Exist on Type 'ConfigProps'`
**Problem:** `page.tsx` spread `config.hero` into the `<Hero />` component, but the `ConfigProps` interface in `config.tsx` had no `hero` field. TypeScript reported:
```
Property 'hero' does not exist on type 'ConfigProps'.
```
**Root Cause:** The `Hero` component and its `<Hero {...config.hero} />` usage in `page.tsx` were added, but the `ConfigProps` interface was never updated to include a `hero` property, and the `config` object had no `hero` data.
**Solution:**
1. Added `hero: HeroProps` to the `ConfigProps` interface in `config.tsx`.
2. Added a `hero` entry to the `config` object with `title`, `description`, and `image` fields.
- *Key Takeaway:* When you add a new component that is driven by `config.tsx`, you must update **both** the `ConfigProps` interface (so TypeScript is satisfied) **and** the actual `config` object (so the data exists at runtime). Forgetting either one will cause an error.
