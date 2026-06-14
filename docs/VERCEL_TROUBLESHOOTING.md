# 🛠 Vercel Deployment Troubleshooting Guide

When deploying a Next.js app to Vercel for the first time, or when relying on automatic deployments from GitHub, you might encounter a few common roadblocks. This document serves as a cheat sheet to solve them quickly.

---

## 1. Problem: "Changes pushed to GitHub are not showing up on Vercel"

### Why it happens:
By default, Vercel is supposed to automatically rebuild and deploy your site every time you run `git push origin main`. If your live site isn't updating after a push, it means your GitHub repository is **not properly linked** to your Vercel project, or the Vercel app doesn't have permission to read your repository.

### How to fix it (The Dashboard Method):
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your project (e.g., `budgeteasyv1`).
3. Go to **Settings** > **Git**.
4. Look at the "Connected Git Repository" section. 
5. If it's empty or throwing an error, click **Connect** and select your GitHub repository from the dropdown. You may be prompted to grant Vercel permission to access your GitHub repositories.
6. Once connected, future `git push` commands will trigger deployments automatically.

### How to fix it (The Manual Override Method):
If you just want your changes live *right now* while you figure out the GitHub linking issue, you can force a manual production deployment from your terminal:
```bash
npx vercel --prod --yes
```

---

## 2. Problem: "Failed to connect to project" in Terminal

### Why it happens:
If you run `npx vercel` and see an error like `Error: Failed to connect Umerrijaz/budgeteasyv1 to project`, the CLI is trying to link your local code to a Vercel project but is failing due to a mismatch, a typo in the repo name, or a permissions issue.

### How to fix it:
1. Delete the hidden `.vercel` folder in your project root. This folder caches your project linking settings and might contain bad data:
   ```bash
   rm -rf .vercel
   ```
2. Run the deployment command again to trigger a fresh setup:
   ```bash
   npx vercel --prod
   ```
3. The CLI will ask you "Set up and deploy?" Type `Y`. It will then ask you to link to an existing project or create a new one. Follow the prompts carefully.

---

## 3. Problem: "Build Failed" on Vercel

### Why it happens:
Your code might work perfectly on your local machine (`npm run dev`), but fail during the Vercel build process. This is almost always caused by strict TypeScript errors, unused variables, or missing dependencies that `npm run dev` ignores but the production build strictly enforces.

### How to fix it:
1. Read the Vercel logs. Go to your Vercel Dashboard, click on the failed deployment, and look at the "Build Logs". It will usually tell you exactly which file and line number caused the error.
2. Test the production build locally before pushing. Run this command in your terminal:
   ```bash
   npm run build
   ```
   This simulates the exact environment Vercel uses. Fix any red errors that pop up in your terminal here, commit them, and push again!

---

## Quick Reference Commands

- **Test a temporary preview deployment:** 
  `npx vercel`
- **Force deploy to production:** 
  `npx vercel --prod --yes`
- **Simulate the Vercel build process locally:** 
  `npm run build`
